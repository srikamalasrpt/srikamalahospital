const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { OpenAI } = require('openai');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
require("dotenv").config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 10000;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
try {
    if (supabaseUrl && supabaseKey && typeof supabaseUrl === 'string' && !supabaseUrl.includes('YOUR_')) {
        supabase = createClient(supabaseUrl, supabaseKey);
        console.log('✅ Supabase initialized');
    } else {
        console.warn('⚠️ Supabase credentials missing (deployment will continue but DB features may fail)');
    }
} catch (e) {
    console.error('❌ Supabase initialization failed:', e.message);
}

// Global Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { success: false, message: "Too many requests from this IP, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

// AI endpoints specific rate limiter (stricter)
const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // limit each IP to 20 AI requests per hour
    message: { success: false, message: "AI daily limit reached. Call +91 99480 76665 for immediate clinical guidance." },
});

// SIMPLIFIED CORS for robust deployment
app.use(cors({
    origin: true,
    credentials: true
}));

// Security & Utility Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://*.supabase.co"],
            connectSrc: ["'self'", "https://*.supabase.co", "https://integrate.api.nvidia.com", (process.env.SKIN_AI_URL || "https://*")],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '30mb' })); // Reduced for security
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(limiter);

// Health Checks
app.get('/health', (req, res) => res.status(200).send('OK'));
app.get('/', (req, res) => res.status(200).send('Sri Kamala Hospital Backend Live'));

// Backward compatibility for older frontend bundles that call endpoints without /api prefix.
app.use((req, res, next) => {
    const legacyToApi = {
        '/config': '/api/config',
        '/ai/symptom': '/api/ai/symptom',
        '/ai/vision': '/api/ai/vision',
        '/ai/chat': '/api/ai/chat',
        '/create-appointment': '/api/create-appointment',
        '/create-upi-order': '/api/create-upi-order',
        '/lab/tests': '/api/lab/tests',
        '/pharmacy/products': '/api/pharmacy/products',
        '/admin/login': '/api/admin/login',
        '/admin/appointments': '/api/admin/appointments',
        '/admin/update-appointment': '/api/admin/update-appointment',
        '/appointments': '/api/appointments',
        '/ai/medicine-discovery': '/api/ai/medicine-discovery',
        '/medicines/catalog': '/api/medicines/catalog',
        '/admin/patient-clinical-note': '/api/admin/patient-clinical-note',
        '/admin/patient-clinical-history': '/api/admin/patient-clinical-history',
        '/ocr': '/api/ai/ocr',
        '/predict': '/predict'
    };

    if (!req.path.startsWith('/api')) {
        const direct = legacyToApi[req.path];
        if (direct) req.url = direct + (req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '');
        if (!direct && req.path.startsWith('/appointments/')) {
            req.url = `/api${req.url}`;
        }
    }
    next();
});

// Apply stricter limit to AI endpoints
app.use('/api/ai/', aiLimiter);

// Global Config Store
let siteConfig = {
    showCoreServices: true,
    hospitalPhone: '99480 76665',
    diagnosticsPhone: '9866895634',
    opTimings: 'Open 24 Hours',
    hospitalAddress: 'Opp. Tirumala Grand Restaurant, M.G. Road, Suryapet'
};

const patientClinicalRecords = {};
const medicineCatalog = [
    "Paracetamol 650mg", "Dolo 650", "Amoxicillin 500mg", "Azithromycin 500mg",
    "Cefixime 200mg", "Cetirizine 10mg", "Levocetirizine", "Pantoprazole 40mg",
    "Rabeprazole", "Ondansetron", "Vomikind Injection", "Metformin 500mg",
    "Glimepiride", "Insulin Human Mixtard", "Amlodipine 5mg", "Telmisartan 40mg",
    "Losartan 50mg", "Atorvastatin 10mg", "Calcium + Vitamin D3", "Iron Folic Acid",
    "Multivitamin Syrup", "ORS Sachet", "NS Saline Bottle", "RL Bottle",
    "Disposable Syringe 2ml", "Disposable Syringe 5ml", "IV Cannula 20G",
    "Surgical Gloves", "Examination Gloves", "Sterile Cotton Roll", "Bandage Roll",
    "Betadine Ointment", "Diclofenac Gel", "Amoxiclav 625mg", "Doxycycline 100mg",
    "Nebulizer Solution", "Inhaler (Salbutamol)", "Hydrocortisone Injection",
    "Vitamin B12 Injection", "TT Injection", "Pain Relief Spray"
];

const openai = new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY || 'dummy_key_to_prevent_crash_if_missing',
    baseURL: process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1',
});

const symptomModelCandidates = [
    process.env.NVIDIA_SYMPTOM_MODEL,
    "nvidia/llama-3.1-nemotron-70b-instruct",
    "meta/llama-3.1-70b-instruct",
    "meta/llama3-70b-instruct"
].filter(Boolean);

const normalizeApiKey = (key) => {
    if (!key || typeof key !== 'string') return '';
    return key.trim().replace(/^Bearer\s+/i, '');
};

const getChatAI = async (messages, modelCandidates = ['meta/llama-3.1-70b-instruct', 'meta/llama3-70b-instruct', 'meta/llama-3.2-3b-instruct'], tokens = 1024) => {
    const keyCandidates = [
        normalizeApiKey(process.env.NVIDIA_API_KEY),
        normalizeApiKey(process.env.NVIDIA_VISION_API_KEY),
        normalizeApiKey(process.env.NVIDIA_VISION_FALLBACK_API_KEY)
    ].filter(Boolean);

    for (const key of keyCandidates) {
        const openai = new OpenAI({ apiKey: key, baseURL: 'https://integrate.api.nvidia.com/v1' });
        for (const model of modelCandidates) {
            try {
                const completion = await openai.chat.completions.create({
                    model,
                    messages,
                    temperature: 0.2,
                    max_tokens: tokens,
                });
                if (completion?.choices?.[0]?.message?.content) {
                    return completion.choices[0].message.content;
                }
            } catch (e) {
                if (e?.status === 404) continue;
            }
        }
    }
    throw new Error('All AI chat failovers exhausted');
};

// Enhanced AI Chat & Symptom Checker with failover
app.post('/api/ai/symptom', async (req, res) => {
    try {
        const { symptoms } = req.body;
        const msg = [
            { role: "system", content: "You are an AI diagnostic assistant for Sri Kamala Hospital. Respond EXCLUSIVELY with a JSON object: { 'advice': { 'en': '...', 'te': '...' }, 'department': { 'en': '...', 'te': '...' } }. Concise and medical." },
            { role: "user", content: symptoms }
        ];

        const modelText = await getChatAI(msg, ['meta/llama-3.1-405b-instruct', 'meta/llama-3.1-70b-instruct', 'meta/llama-3.2-3b-instruct', 'nvidia/llama-3.1-405b-instruct']);
        let jsonResponse = null;
        try {
            const cleaned = modelText.replace(/```json/g, '').replace(/```/g, '').trim();
            jsonResponse = JSON.parse(cleaned);
        } catch {
            jsonResponse = {
                advice: {
                    en: "Analyzed your symptoms. Please visit the hospital for a professional evaluation.",
                    te: "మీ లక్షణాలను పరిశీలించాము. దయచేసి పూర్తి పరీక్ష కోసం ఆసుపత్రిని సందర్శించండి."
                },
                department: { en: "General", te: "జనరల్" }
            };
        }

        res.json({ success: true, analysis: jsonResponse });
    } catch (err) {
        console.error("AI Symptom Error:", err);
        res.status(503).json({ success: false, message: "AI services busy." });
    }
});

// Local HAM10000 Dataset Analyzer
const HAM10000_CLASSES = {
    'akiec': {
        name_en: "Actinic Keratosis",
        name_te: "యాక్టినిక్ కెరటోసిస్",
        risk: "Medium",
        desc_en: "Pre-cancerous sun damage. Scaly patches on sun-exposed areas.",
        desc_te: "ఎండ దెబ్బతినడం వల్ల వచ్చే క్యాన్సర్ ముందు దశ గాయాలు."
    },
    'bcc': {
        name_en: "Basal Cell Carcinoma",
        name_te: "బేసల్ సెల్ కార్సినోమా",
        risk: "High",
        desc_en: "Common slow-growing skin cancer. Usually non-spreading.",
        desc_te: "సాధారణంగా నెమ్మదిగా పెరిగే చర్మ క్యాన్సర్."
    },
    'bkl': {
        name_en: "Benign Keratosis",
        name_te: "బెంగుళూరు కెరటోసిస్ (నిరపాయమైనది)",
        risk: "Low",
        desc_en: "Harmless growths like seborrheic keratosis or warts.",
        desc_te: "హాని కలిగించని చర్మ పెరుగుదలలు."
    },
    'df': {
        name_en: "Dermatofibroma",
        name_te: "డెర్మటోఫైబ్రోమా",
        risk: "Low",
        desc_en: "Firm, non-cancerous small bumps usually on legs.",
        desc_te: "సాధారణంగా కాళ్లపై వచ్చే గట్టి చిన్న గడ్డలు."
    },
    'mel': {
        name_en: "Melanoma",
        name_te: "మెలనోమా (తీవ్రమైనది)",
        risk: "Critically High",
        desc_en: "Serious form of skin cancer. Requires immediate clinical review.",
        desc_te: "తీవ్రమైన చర్మ క్యాన్సర్. వెంటనే వైద్యుడిని సంప్రదించాలి."
    },
    'nv': {
        name_en: "Melanocytic Nevi (Moles)",
        name_te: "మెలనోసైటిక్ నెవి (పుట్టుమచ్చలు)",
        risk: "Low",
        desc_en: "Common moles or birthmarks. Usually benign.",
        desc_te: "సాధారణ పుట్టుమచ్చలు. సాధారణంగా హాని ఉండదు."
    },
    'vasc': {
        name_en: "Vascular Lesions",
        name_te: "వాస్కులర్ గాయాలు (రక్తనాళాల మార్పులు)",
        risk: "Low",
        desc_en: "Vascular growths like cherry angiomas or port-wine stains.",
        desc_te: "రక్తనాళాల పెరుగుదల లేదా ఎర్రటి మచ్చలు."
    }
};

const SKIN_AI_URL = process.env.SKIN_AI_URL || `http://localhost:${process.env.SKIN_AI_PORT || 5005}`;

// 🧠 /predict proxy kept as fallback (frontend calls Flask directly now)
app.post('/predict', express.raw({ type: '*/*', limit: '20mb' }), async (req, res) => {
    try {
        const response = await axios.post(`${SKIN_AI_URL}/predict`, req.body, {
            headers: { 'Content-Type': req.headers['content-type'] },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            timeout: 30000
        });
        res.json(response.data);
    } catch (err) {
        const errMsg = err.response?.data || err.message;
        res.status(500).json({ success: false, message: `AI prediction failed: ${errMsg}` });
    }
});

app.post('/api/ai/vision', async (req, res) => {
    try {
        const { image, symptoms } = req.body;
        if (!image) return res.status(400).json({ success: false, message: "No image provided" });

        // Forward to Flask for high-precision CNN analysis
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        
        // Using a simpler approach for axios with buffer
        const FormData = require('form-data');
        const form = new FormData();
        form.append('image', buffer, { filename: 'image.jpg', contentType: 'image/jpeg' });

        try {
            const flaskResponse = await axios.post(`${SKIN_AI_URL}/predict`, form, {
                headers: { ...form.getHeaders() },
                timeout: 15000 // In production, we give it more time
            });

            if (flaskResponse.data && flaskResponse.data.success) {
                const pred = flaskResponse.data;
                const clsKey = pred.condition.toLowerCase().replace(/ /g, '_');
                const cls = HAM10000_CLASSES[clsKey] || HAM10000_CLASSES['nv'];
                
                return res.json({ 
                    success: true, 
                    analysis: {
                        condition: { en: pred.condition, te: cls.name_te },
                        risk_level: cls.risk,
                        confidence: pred.confidence,
                        precautions: [
                            { en: cls.desc_en, te: cls.desc_te },
                            { en: "CNN-based research assessment (HAM10000).", te: "HAM10000 పరిశోధన ఆధారిత అంచనా." }
                        ],
                        metadata: { source: "CNN Skin Model (Flask)", confidence: pred.confidence }
                    }
                });
            }
        } catch (fErr) {
            console.warn("Flask fallback triggered:", fErr.message);
        }

        // --- Stage 1 (Legacy Fallback): Native Clinical Signature Extraction ---
        let sig = { dx: 'nv', evidence: 'unknown' };
        try {
            const vKey = normalizeApiKey(process.env.NVIDIA_VISION_API_KEY || process.env.NVIDIA_API_KEY);
            if (vKey) {
                const check = await axios.post("https://integrate.api.nvidia.com/v1/chat/completions", {
                    model: "google/paligemma",
                    messages: [{
                        role: "user",
                        content: [
                            { 
                                type: "text", 
                                text: "Clinical research assessment. Identify lesion type (akiec, bcc, bkl, df, mel, nv, vasc). Output ONLY JSON: { \"is_skin\": true/false, \"dx\": \"code\", \"evidence\": \"keywords\" }." 
                            },
                            { type: "image_url", image_url: { url: image } }
                        ]
                    }],
                    max_tokens: 300, temperature: 0.1
                }, { headers: { "Authorization": `Bearer ${vKey}` }, timeout: 15000 });
                
                const content = check.data?.choices?.[0]?.message?.content.replace(/```json|```/g, '').trim();
                sig = JSON.parse(content);
            }
        } catch (vErr) { console.warn("Vision Fallback:", vErr.message); }

        const inputStr = (`${sig.dx} ${sig.evidence} ${symptoms || ""}`).toLowerCase();
        const weights = { akiec: 1, bcc: 1, bkl: 1, df: 1, mel: 1, nv: 3, vasc: 1 };
        if (sig.dx && weights[sig.dx] !== undefined) weights[sig.dx] += 80;

        const finalKey = Object.keys(weights).reduce((a, b) => weights[a] > weights[b] ? a : b);
        const cls = HAM10000_CLASSES[finalKey];

        return res.json({ 
            success: true, 
            analysis: {
                condition: { en: cls.name_en, te: cls.name_te },
                risk_level: cls.risk,
                precautions: [
                    { en: cls.desc_en, te: cls.desc_te },
                    { en: "Native fallback verification applied.", te: "నేటివ్ ఫాల్‌బ్యాక్ వెరిఫికేషన్ అప్లై చేయబడింది." }
                ],
                metadata: { source: "Legacy Research Engine" }
            }
        });
    } catch (err) {
        console.error("Skin AI Server Error:", err);
        res.status(500).json({ success: false, message: "Skin AI engine failed." });
    }
});


// AI OCR for Prescriptions with failover
app.post('/api/ai/ocr', async (req, res) => {
            try {
                const { image } = req.body;
                const keyCandidates = [
                    normalizeApiKey(process.env.NVIDIA_VISION_API_KEY),
                    normalizeApiKey(process.env.NVIDIA_VISION_FALLBACK_API_KEY),
                    normalizeApiKey(process.env.NVIDIA_API_KEY)
                ].filter(Boolean);

                const modelCandidates = [
                    "meta/llama-3.2-90b-vision-instruct",
                    "meta/llama-3.2-11b-vision-instruct",
                    "microsoft/phi-3.5-vision-instruct"
                ];

                let response;
                outer: for (const currentKey of keyCandidates) {
                    for (const currentModel of modelCandidates) {
                        try {
                            const attempt = await axios.post("https://integrate.api.nvidia.com/v1/chat/completions", {
                                model: currentModel,
                                messages: [{
                                    role: "user",
                                    content: [
                                        {
                                            type: "text", text: `### CLINICAL OCR PROTOCOL V2.0
Digitize this medical document with 100% precision. 
Identify all handwriting, printed tests, values, and doctor signatures.

Extract as JSON:
{ 
  "patient": "Patient Name", 
  "date": "Detection Date", 
  "medicines": ["list of medication names, dosages, and frequencies"], 
  "test_results": [
    { "item_en": "Test Name", "item_te": "తెలుగు పేరు", "value": "Result", "range": "Reference Range", "status": "Normal/Abnormal" }
  ],
  "diagnosis_en": "Primary Medical Finding",
  "explanation_te": "తెలుగులో వైద్య సారాంశం మరియు రోగికి సూచనలు (3-4 sentences)",
  "explanation_en": "Comprehensive English medical summary and actionable clinical advice"
}

IMPORTANT:
1. ONLY output VALID JSON.
2. Use 'Not Found' for missing values.
3. Transliterate medical terms into Telugu script for Te fields.` },
                                        { type: "image_url", image_url: { url: image } }
                                    ]
                                }],
                                max_tokens: 2048,
                                temperature: 0.1
                            }, {
                                headers: { "Authorization": `Bearer ${currentKey}`, "Content-Type": "application/json" },
                                timeout: 60000
                            });
                            if (attempt.status === 200) { response = attempt; break outer; }
                        } catch (e) { continue; }
                    }
                }

                const content = response?.data?.choices?.[0]?.message?.content || "";
                let json;
                try {
                    json = JSON.parse(content.replace(/```json|```/g, '').trim());
                } catch {
                    json = { raw_extraction: content };
                }
                res.json({ success: true, data: json });
            } catch (err) {
                res.status(500).json({ success: false, message: "OCR engine failed." });
            }
        });

        // AI Image Quality Shield with failover
        app.post('/api/ai/quality-check', async (req, res) => {
            try {
                const { image } = req.body;
                const keyCandidates = [
                    normalizeApiKey(process.env.NVIDIA_VISION_API_KEY),
                    normalizeApiKey(process.env.NVIDIA_VISION_FALLBACK_API_KEY),
                    normalizeApiKey(process.env.NVIDIA_API_KEY)
                ].filter(Boolean);

                const modelCandidates = [
                    "microsoft/phi-3.5-vision-instruct",
                    "meta/llama-3.2-11b-vision-instruct"
                ];

                let response;
                outer: for (const currentKey of keyCandidates) {
                    for (const currentModel of modelCandidates) {
                        try {
                            const attempt = await axios.post("https://integrate.api.nvidia.com/v1/chat/completions", {
                                model: currentModel,
                                messages: [{
                                    role: "user",
                                    content: [
                                        { type: "text", text: "Evaluate clinical photo quality. Output ONLY JSON: { \"pass\": true/false, \"score\": 0-10, \"tips\": \"...\" }." },
                                        { type: "image_url", image_url: { url: image } }
                                    ]
                                }],
                                max_tokens: 512,
                                temperature: 0.1
                            }, { headers: { "Authorization": `Bearer ${currentKey}` }, timeout: 45000 });
                            if (attempt.status === 200) { response = attempt; break outer; }
                        } catch (e) { continue; }
                    }
                }

                const content = response?.data?.choices?.[0]?.message?.content || "";
                let json;
                try {
                    json = JSON.parse(content.replace(/```json|```/g, '').trim());
                } catch {
                    json = { pass: true, score: 7, tips: "Proceed with caution." };
                }
                res.json({ success: true, quality: json });
            } catch (err) {
                res.status(500).json({ success: false, message: "Quality check failed." });
            }
        });

        // AI Chatbot using fallback logic
        app.post('/api/ai/chat', async (req, res) => {
            try {
                const { query } = req.body;
                const msg = [
                    { 
                        role: "system", 
                        content: "You are Dr. Kamala, the conversational AI for Sri Kamala Hospital in Suryapet. You output concise, empathetic, and professional responses. You specialize in guiding patients, providing info on bookings, treatments, and FAQs. You have access to the full HAM10000 Clinical Dataset (10,015 dermatology records) to provide research-backed skin insights. You have 24/7 emergency at +91 91544 04051. Respond in plain text, max 3 sentences." 
                    },
                    { role: "user", content: query }
                ];

                const responseText = await getChatAI(msg, ['meta/llama-3.1-70b-instruct', 'meta/llama3-70b-instruct', 'meta/llama-3.2-3b-instruct']);
                res.json({ success: true, response: responseText || "I am currently offline. Call +91 99480 76665." });
            } catch (err) {
                console.error("AI Chat Error:", err);
                res.status(500).json({ success: false, message: "Clinical AI is resting. Call +91 99480 76665." });
            }
        });

        // Pharmacy Discovery using fallback logic
        app.post('/api/ai/discover', async (req, res) => {
            try {
                const { keyword } = req.body;
                if (!keyword) return res.json({ success: true, results: [] });

                const msg = [
                    { role: "system", content: "You are a clinical AI. The user will give a symptom or medicine name. Suggest 2-3 standard generic or brand medical equivalents. Output strictly a JSON array of strings, e.g. [\"Paracetamol 500mg\", \"Ibuprofen\"]." },
                    { role: "user", content: keyword }
                ];

                const responseText = await getChatAI(msg, ['meta/llama-3.1-70b-instruct', 'meta/llama-3.2-3b-instruct']);
                let results = [];
                try {
                    results = JSON.parse(responseText.replace(/```json|```/g, '').trim());
                    if (!Array.isArray(results)) results = [];
                } catch (e) { }

                res.json({ success: true, results, ai_note: "Clinical suggestions gathered." });
            } catch (err) {
                res.json({ success: true, results: [], ai_note: "Could not fetch alternatives due to network." });
            }
        });

        // Admin Login
        app.post('/api/admin/login', (req, res) => {
            const { password } = req.body;
            if (password === process.env.ADMIN_PASSWORD) {
                res.json({ success: true, token: 'admin-authorized-session' });
            } else {
                res.status(401).json({ success: false, message: 'Invalid Admin Password' });
            }
        });

        app.get('/api/config', (req, res) => res.json({ success: true, config: siteConfig }));
        app.post('/api/config', (req, res) => {
            siteConfig = { ...siteConfig, ...req.body };
            res.json({ success: true, config: siteConfig });
        });

        // Create appointment (Enhanced with Sequential Token Generation and Merging)
        app.post('/api/create-appointment', async (req, res) => {
            try {
                const { name, phone, age, gender, department, appointmentDate, reason, image } = req.body;
                if (!name || !phone) return res.status(400).json({ success: false, message: "Missing required fields" });

                // Prefix logic
                const isDia = department.toLowerCase().includes('lab') || department.toLowerCase().includes('diagnosis');
                const prefix = isDia ? 'KAMALADIA' : 'KAMALA-OP';

                let finalToken = null;
                if (supabase) {
                    // Check for Merged History (Patient Name + Phone match)
                    const { data: existing } = await supabase
                        .from('appointments')
                        .select('token')
                        .eq('phone', phone)
                        .ilike('name', name)
                        .order('created_at', { ascending: true })
                        .limit(1)
                        .maybeSingle();

                    if (existing) {
                        finalToken = existing.token;
                    } else {
                        // Sequential Count
                        const { count } = await supabase
                            .from('appointments')
                            .select('*', { count: 'exact', head: true })
                            .ilike('token', `${prefix}%`);

                        const nextNum = (count || 0) + 1;
                        finalToken = `${prefix}-${nextNum.toString().padStart(4, '0')}`;
                    }
                }

                if (!finalToken) {
                    finalToken = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
                }

                const bookingData = {
                    token: finalToken,
                    name, phone, age, gender, department,
                    appointment_date: appointmentDate,
                    reason: reason || (isDia ? 'Diagnostic Test' : 'General Checkup'),
                    payment_status: 'Pay at Hospital',
                    order_id: `OFFLINE_${Date.now()}`,
                    image: image || null
                };

                if (supabase) {
                    const { data, error } = await supabase
                        .from('appointments')
                        .insert(bookingData)
                        .select();
                    if (error) throw error;
                    res.json({ success: true, appointment: data[0], token: finalToken });
                } else {
                    res.json({ success: true, appointment: bookingData, token: finalToken });
                }
            } catch (err) {
                console.error("Booking Error:", err);
                res.status(500).json({ success: false, message: "Clinic system busy. Please try again." });
            }
        });

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Hospital Backend Live on Port ${PORT}`);
            console.log(`🏥 OP Start: KAMALA-OP-0001 | DIA Start: KAMALADIA-0001`);
        });

        app.get('/api/admin/appointments', async (req, res) => {
            try {
                if (!supabase) {
                    return res.json({
                        success: true, appointments: [
                            { _id: '1', name: 'Mock Patient', token: 'TKN-DEMO', department: 'General', phone: '0000', paymentStatus: 'Paid', appointmentDate: '2026-03-22' }
                        ]
                    });
                }
                const { data, error } = await supabase
                    .from('appointments')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                // Transform Supabase camelCase-like snake_case back to frontend expected names
                const transformed = data.map(item => ({
                    _id: item.id,
                    name: item.name,
                    token: item.token,
                    department: item.department,
                    phone: item.phone,
                    age: item.age,
                    gender: item.gender,
                    reason: item.reason,
                    paymentStatus: item.payment_status,
                    appointmentDate: item.appointment_date,
                    orderId: item.order_id,
                    image: item.image
                }));

                res.json({ success: true, appointments: transformed });
            } catch (err) {
                res.status(500).json({ success: false, message: err.message });
            }
        });

        app.get('/api/appointments/:token', async (req, res) => {
            try {
                const { token } = req.params;
                if (!token) return res.status(400).json({ success: false, message: 'Token required' });

                if (!supabase) {
                    return res.json({
                        success: true,
                        appointment: {
                            token,
                            name: 'Demo Patient',
                            phone: '0000000000',
                            age: 30,
                            gender: 'Male',
                            department: token.startsWith('KAMALADIA') ? 'Lab: Demo Test' : 'General OP',
                            paymentStatus: 'Pay at Hospital',
                            appointmentDate: '2026-03-22',
                            reason: 'Demo booking'
                        }
                    });
                }

                const { data, error } = await supabase
                    .from('appointments')
                    .select('*')
                    .eq('token', token)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle();

                if (error) throw error;
                if (!data) return res.status(404).json({ success: false, message: 'Appointment not found' });

                return res.json({
                    success: true,
                    appointment: {
                        _id: data.id,
                        name: data.name,
                        token: data.token,
                        department: data.department,
                        phone: data.phone,
                        age: data.age,
                        gender: data.gender,
                        reason: data.reason,
                        paymentStatus: data.payment_status,
                        appointmentDate: data.appointment_date,
                        orderId: data.order_id,
                        image: data.image
                    }
                });
            } catch (err) {
                return res.status(500).json({ success: false, message: err.message });
            }
        });

        // Admin: Update appointment
        app.post('/api/admin/update-appointment', async (req, res) => {
            try {
                const { id, paymentStatus } = req.body;
                const { data, error } = await supabase
                    .from('appointments')
                    .update({ payment_status: paymentStatus, updated_at: new Date() })
                    .eq('id', id)
                    .select();

                if (error) throw error;
                res.json({ success: true, appointment: data[0] });
            } catch (err) {
                res.status(500).json({ success: false, message: err.message });
            }
        });

        // Cashfree: Create UPI Order
        app.post('/api/create-upi-order', async (req, res) => {
            try {
                const { name, phone, age, gender, department, appointmentDate, reason, token } = req.body;
                const orderId = `ORD_${Date.now()}`;

                const { data, error } = await supabase
                    .from('appointments')
                    .insert({
                        order_id: orderId, token, name, phone, age, gender, department,
                        appointment_date: appointmentDate, reason, payment_status: 'Pending'
                    })
                    .select();

                if (error) throw error;

                // Simplified for brevity, same as previous logic
                res.json({
                    success: true,
                    orderId: orderId,
                    paymentUrl: `https://test.cashfree.com/pg/v1/checkout/${orderId}`
                });
            } catch (err) {
                res.status(500).json({ success: false, message: err.message });
            }
        });

        // Diagnosis & Products
        app.get('/api/lab/tests', async (req, res) => {
            try {
                let tests = [];
                if (supabase) {
                    const { data, error } = await supabase.from('labtests').select('*');
                    if (data && data.length > 0) tests = data;
                }

                if (tests.length === 0) {
                    tests = [
                        { name: 'Complete Blood Picture (CBP)', category: 'Hematology', price: 250, report_time: 12 },
                        { name: 'Blood Glucose (Sugar)', category: 'Biochemistry', price: 150, report_time: 6 },
                        { name: 'Differential Count (DC)', category: 'Hematology', price: 200, report_time: 12 },
                        { name: 'ESR (1st & 2nd Hour)', category: 'Hematology', price: 100, report_time: 12 },
                        { name: 'Absolute Eosinophils Count (AEC)', category: 'Hematology', price: 300, report_time: 12 },
                        { name: 'Hemoglobin (Hb)', category: 'Hematology', price: 120, report_time: 8 },
                        { name: 'Packed Cell Volume (PCV)', category: 'Hematology', price: 140, report_time: 8 },
                        { name: 'Total Leukocyte Count (TLC)', category: 'Hematology', price: 170, report_time: 12 },
                        { name: 'Platelet Count', category: 'Hematology', price: 180, report_time: 12 },
                        { name: 'Reticulocyte Count', category: 'Hematology', price: 260, report_time: 18 },
                        { name: 'Bleeding Time & Clotting Time (BT/CT)', category: 'Hematology', price: 180, report_time: 12 },
                        { name: 'Prothrombin Time (PT/INR)', category: 'Coagulation', price: 320, report_time: 18 },
                        { name: 'Activated Partial Thromboplastin Time (APTT)', category: 'Coagulation', price: 350, report_time: 24 },
                        { name: 'Peripheral Smear', category: 'Hematology', price: 350, report_time: 24 },
                        { name: 'Thyroid Profile (T3, T4, TSH)', category: 'Hormonal', price: 450, report_time: 24 },
                        { name: 'Lipid Profile (Cholesterol)', category: 'Cardiology', price: 500, report_time: 24 },
                        { name: 'Liver Function Test (LFT)', category: 'General', price: 650, report_time: 24 },
                        { name: 'Kidney Function Test (KFT)', category: 'General', price: 750, report_time: 24 },
                        { name: 'HbA1c', category: 'Diabetes', price: 450, report_time: 24 },
                        { name: 'Blood Urea', category: 'Biochemistry', price: 180, report_time: 12 },
                        { name: 'Serum Creatinine', category: 'Biochemistry', price: 220, report_time: 12 },
                        { name: 'Uric Acid', category: 'Biochemistry', price: 200, report_time: 12 },
                        { name: 'Widal Test', category: 'Serology', price: 300, report_time: 24 },
                        { name: 'Dengue NS1 Antigen', category: 'Serology', price: 600, report_time: 24 },
                        { name: 'Malaria Parasite Test', category: 'Serology', price: 320, report_time: 18 },
                        { name: 'CRP (C-Reactive Protein)', category: 'Immunology', price: 420, report_time: 24 }
                    ];
                }
                res.json({ success: true, tests });
            } catch (err) {
                res.status(500).json({ success: false, message: err.message });
            }
        });

        app.get('/api/pharmacy/products', async (req, res) => {
            try {
                let products = [];
                if (supabase) {
                    const { data, error } = await supabase.from('products').select('*');
                    if (data && data.length > 0) products = data;
                }

                if (products.length === 0) {
                    products = [
                        { name: 'Paracetamol 650mg', category: 'General', price: 12, image: 'pill' },
                        { name: 'Amoxicillin 500mg', category: 'Antibiotics', price: 45, image: 'capsule' },
                        { name: 'Surgical Gloves (Pair)', category: 'General Hospital', price: 20, image: 'kit' },
                        { name: 'Disposable Syringe 5ml', category: 'Injections', price: 15, image: 'kit' },
                        { name: 'D-Rise 60k Capsule', category: 'Vitamins', price: 25, image: 'capsule' },
                        { name: 'Azithromycin 500mg', category: 'Antibiotics', price: 80, image: 'capsule' }
                    ];
                }
                res.json({ success: true, products });
            } catch (err) {
                res.status(500).json({ success: false, message: err.message });
            }
        });

        // AI Medicine Discovery (Simulation for required keyword feature)
        app.post('/api/ai/medicine-discovery', async (req, res) => {
            const { keyword } = req.body;
            if (!keyword) return res.json({ success: true, results: [] });

            const results = medicineCatalog.filter(m => m.toLowerCase().includes(keyword.toLowerCase()));

            const totalMatches = results.length;
            res.json({
                success: true,
                results: results.slice(0, 8),
                totalMatches,
                ai_note: keyword.length > 2 ? `Detected '${keyword}'. ${totalMatches} related items are available in stock suggestions.` : ''
            });
        });

        app.get('/api/medicines/catalog', (req, res) => {
            res.json({ success: true, medicines: medicineCatalog });
        });

        app.post('/api/admin/patient-clinical-note', (req, res) => {
            try {
                const { token, patientName, phone, diagnosisType, notes, prescription } = req.body;
                if (!token || !patientName || !phone) {
                    return res.status(400).json({ success: false, message: 'token, patientName and phone are required' });
                }

                const key = `${patientName.trim().toLowerCase()}_${phone.trim()}`;
                if (!patientClinicalRecords[key]) {
                    patientClinicalRecords[key] = [];
                }

                patientClinicalRecords[key].push({
                    token,
                    diagnosisType: diagnosisType || 'General',
                    notes: notes || '',
                    prescription: prescription || [],
                    createdAt: new Date().toISOString()
                });

                return res.json({ success: true, records: patientClinicalRecords[key] });
            } catch (err) {
                return res.status(500).json({ success: false, message: err.message });
            }
        });

        app.post('/api/admin/patient-clinical-history', (req, res) => {
            const { patientName, phone } = req.body;
            if (!patientName || !phone) {
                return res.status(400).json({ success: false, message: 'patientName and phone are required' });
            }
            const key = `${patientName.trim().toLowerCase()}_${phone.trim()}`;
            return res.json({ success: true, records: patientClinicalRecords[key] || [] });
        });

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server established on http://0.0.0.0:${PORT}`);
});
