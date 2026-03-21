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

// SIMPLIFIED CORS for robust deployment
app.use(cors({
    origin: true,
    credentials: true
}));

// Health Checks
app.get('/health', (req, res) => res.status(200).send('OK'));
app.get('/', (req, res) => res.status(200).send('Server is Up!'));
app.get('/api/debug/env', (req, res) => {
    const mask = (value) => {
        if (!value || typeof value !== 'string') return null;
        const trimmed = value.trim();
        if (!trimmed) return null;
        if (trimmed.length <= 8) return `${trimmed[0]}***${trimmed[trimmed.length - 1]}`;
        return `${trimmed.slice(0, 4)}...${trimmed.slice(-4)}`;
    };

    res.json({
        success: true,
        env: {
            hasNvidiaApiKey: Boolean(process.env.NVIDIA_API_KEY && process.env.NVIDIA_API_KEY.trim()),
            hasNvidiaVisionApiKey: Boolean(process.env.NVIDIA_VISION_API_KEY && process.env.NVIDIA_VISION_API_KEY.trim()),
            hasNvidiaVisionFallbackApiKey: Boolean(process.env.NVIDIA_VISION_FALLBACK_API_KEY && process.env.NVIDIA_VISION_FALLBACK_API_KEY.trim()),
            hasNvidiaBaseUrl: Boolean(process.env.NVIDIA_BASE_URL && process.env.NVIDIA_BASE_URL.trim()),
            hasAdminPassword: Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.trim()),
            hasSupabaseUrl: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_URL.trim()),
            hasSupabaseServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY.trim()),
            nvidiaBaseUrlResolved: (process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1').trim(),
            nvidiaKeyPreview: mask(process.env.NVIDIA_API_KEY),
            nvidiaVisionKeyPreview: mask(process.env.NVIDIA_VISION_API_KEY),
            nvidiaVisionFallbackKeyPreview: mask(process.env.NVIDIA_VISION_FALLBACK_API_KEY)
        },
        server: {
            port: PORT,
            supabaseInitialized: Boolean(supabase)
        },
        time: new Date().toISOString()
    });
});

app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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
        '/admin/patient-clinical-history': '/api/admin/patient-clinical-history'
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

// AI Vision Analyzer using custom NVIDIA Llama 3.2 90B Python -> Axios conversion
app.post('/api/ai/vision', async (req, res) => {
    try {
        const { image, symptoms } = req.body;
        const keyCandidates = [
            normalizeApiKey(process.env.NVIDIA_VISION_API_KEY),
            normalizeApiKey(process.env.NVIDIA_VISION_FALLBACK_API_KEY),
            normalizeApiKey(process.env.NVIDIA_API_KEY)
        ].filter(Boolean);

        const modelCandidates = [
            process.env.NVIDIA_VISION_MODEL,
            process.env.NVIDIA_VISION_FALLBACK_MODEL,
            "meta/llama-3.2-11b-vision-instruct",
            "microsoft/phi-3.5-vision-instruct",
            "google/paligemma",
            "meta/llama-3.2-90b-vision-instruct"
        ].filter(Boolean);

        if (keyCandidates.length === 0) return res.status(400).json({ success: false, message: "No Vision AI keys configured." });
        if (!image) return res.status(400).json({ success: false, message: "No image provided." });

        let response = null;
        let lastError = null;
        const invokeUrl = "https://integrate.api.nvidia.com/v1/chat/completions";

        // Industrial-grade failover across ALL keys for ALL models
        outerLoop: for (const currentKey of keyCandidates) {
            for (const currentModel of modelCandidates) {
                try {
                    const headers = {
                        "Authorization": `Bearer ${currentKey}`,
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    };

                    const payload = {
                        "model": currentModel,
                        "messages": [
                            {
                                "role": "system",
                                "content": "You are a professional Dermatological AI specialized in the HAM10000 (Human Against Machine) skin lesion dataset. You classify lesions into 7 categories: akiec, bcc, bkl, df, mel, nv, vasc. You provide structured clinical JSON output with extreme precision. No prose."
                            },
                            {
                                "role": "user",
                                "content": [
                                    {
                                        "type": "text",
                                        "text": `Structural Vision Extraction Task (HAM10000 Standards):
                                      Analyze the image for: [Actinic Keratoses, Basal Cell Carcinoma, Benign Keratosis, Dermatofibroma, Melanoma, Nevi, or Vascular Lesions].
                                      
                                      Required JSON Schema:
                                      {
                                        "condition": { "en": "Primary finding (e.g. Melanocytic nevi)", "te": "తెలుగు వ్యాధి పేరు" },
                                        "precautions": [ { "en": "...", "te": "..." } ],
                                        "risk_level": "Low/Medium/High",
                                        "medicine": [ { "en": "...", "te": "..." } ]
                                      }`
                                    },
                                    { "type": "image_url", "image_url": { "url": image } }
                                ]
                            }
                        ],
                        "max_tokens": 1024,
                        "temperature": 0.1,
                        "top_p": 0.7
                    };

                    const attempt = await axios.post(invokeUrl, payload, { headers, timeout: 90000 });
                    if (attempt.status === 200) {
                        response = attempt;
                        response.modelUsed = currentModel;
                        break outerLoop;
                    }
                } catch (err) {
                    lastError = err;
                    const status = err.response?.status;
                    const msg = err.response?.data?.message || err.message;
                    console.warn(`Vision fail: Key ending in ${currentKey.slice(-4)} | Model: ${currentModel} | Reason: ${msg}`);

                    if (status === 429) break;
                    continue;
                }
            }
        }

        if (!response) throw lastError || new Error("All vision keys and models exhausted.");
        const jsonContent = response.data?.choices?.[0]?.message?.content;
        const modelUsed = response.modelUsed || "Unknown";

        if (!jsonContent) throw new Error("Empty response from Vision AI.");

        const buildVisionFallback = (rawText) => ({
            condition: {
                en: "Clinical image analysis is temporarily unavailable.",
                te: "క్లినికల్ ఇమేజ్ విశ్లేషణ తాత్కాలికంగా అందుబాటులో లేదు."
            },
            precautions: [
                {
                    en: "Please consult a doctor for direct clinical assessment.",
                    te: "దయచేసి ప్రత్యక్ష క్లినికల్ అంచనాకు వైద్యుడిని సంప్రదించండి."
                }
            ],
            requirements: [
                {
                    en: "Provide a clearer image and symptom details for better analysis.",
                    te: "మెరుగైన విశ్లేషణ కోసం స్పష్టమైన చిత్రం మరియు లక్షణాల వివరాలు ఇవ్వండి."
                }
            ],
            medicine: [
                {
                    en: "Do not self-medicate based only on image output.",
                    te: "కేవలం చిత్రం ఫలితాల ఆధారంగా స్వయంగా మందులు తీసుకోకండి."
                }
            ],
            lab_tests: [
                {
                    en: "Physical examination and lab confirmation are recommended.",
                    te: "భౌతిక పరీక్ష మరియు ల్యాబ్ నిర్ధారణ సిఫార్సు చేయబడింది."
                }
            ],
            note: `[Model: ${modelUsed}] ${typeof rawText === 'string' ? rawText.slice(0, 220) : ''}`
        });

        const responseIsInvalid = (text) => {
            if (!text || typeof text !== 'string') return true;
            const t = text.trim().toLowerCase();
            // If it doesn't look like JSON at all, it's a refusal or error message
            if (!t.startsWith('{') && !t.includes('{"')) return true;

            return [
                "i don't think this conversation is a good idea",
                "i'm not going to engage",
                "i can't help",
                "cannot help",
                "cannot assist",
                "policy",
                "refusal"
            ].some((k) => t.includes(k));
        };

        let jsonResponse;
        if (responseIsInvalid(jsonContent)) {
            jsonResponse = buildVisionFallback(jsonContent);
            return res.json({ success: true, analysis: jsonResponse });
        }

        try {
            // High-precision cleanup for common AI markdown artifacts
            let cleaned = jsonContent.trim();
            if (cleaned.includes('```')) {
                cleaned = cleaned.replace(/```json\n?|```/g, '').trim();
            }
            try {
                jsonResponse = JSON.parse(cleaned);
            } catch {
                // Try extracting first JSON object when model adds extra prose/refusal text.
                const firstBrace = cleaned.indexOf('{');
                const lastBrace = cleaned.lastIndexOf('}');
                if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                    jsonResponse = JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
                } else {
                    throw new Error('No JSON object found in model response');
                }
            }
        } catch (e) {
            console.error("JSON Parse Error in Vision AI:", jsonContent);
            jsonResponse = buildVisionFallback(jsonContent);
        }

        res.json({ success: true, analysis: jsonResponse });
    } catch (err) {
        console.error("Vision Error:", err);
        res.status(500).json({ success: false, message: "Clinical Vision system busy." });
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
            "meta/llama-3.2-11b-vision-instruct",
            "microsoft/phi-3.5-vision-instruct",
            "google/paligemma"
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
                                { type: "text", text: `Extract clinical text as JSON with the following schema: 
                                { 
                                  "patient": "Patient Name", 
                                  "date": "Detection Date", 
                                  "medicines": ["list of medicines if any"], 
                                  "test_results": [
                                    { "item_en": "Test Name", "item_te": "Telugu Name", "value": "Result", "range": "Normal Range", "status": "Normal/Abnormal" }
                                  ],
                                  "explanation_te": "Detailed Telugu medical summary and advice for the patient",
                                  "explanation_en": "Detailed English medical summary and advice"
                                } 
                                ONLY output valid JSON. Use Telugu for names and explanations where specified.` },
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
                } catch(e) { continue; }
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
            { role: "system", content: "You are Dr. Kamala, the conversational AI for Sri Kamala Hospital in Suryapet. You output concise, empathetic, and professional responses. You specialize in guiding patients, providing info on bookings, treatments, and FAQs. You have 24/7 emergency at +91 91544 04051. Respond in plain text, max 3 sentences." },
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
        } catch(e) {}

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
