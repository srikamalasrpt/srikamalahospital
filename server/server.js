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
            hasNvidiaBaseUrl: Boolean(process.env.NVIDIA_BASE_URL && process.env.NVIDIA_BASE_URL.trim()),
            hasAdminPassword: Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.trim()),
            hasSupabaseUrl: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_URL.trim()),
            hasSupabaseServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY.trim()),
            nvidiaBaseUrlResolved: (process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1').trim(),
            nvidiaKeyPreview: mask(process.env.NVIDIA_API_KEY),
            nvidiaVisionKeyPreview: mask(process.env.NVIDIA_VISION_API_KEY)
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

// AI Symptom Checker using NVIDIA NeMo AI (Nemotron 70B)
app.post('/api/ai/symptom', async (req, res) => {
    try {
        const { symptoms } = req.body;
        if (!process.env.NVIDIA_API_KEY) {
            return res.json({
                success: false,
                message: "NVIDIA API Key not configured.",
                analysis: {
                    advice: {
                        en: "AI service is temporarily unavailable. Please try again later or contact hospital support.",
                        te: "AI సేవ తాత్కాలికంగా అందుబాటులో లేదు. దయచేసి తర్వాత మళ్లీ ప్రయత్నించండి లేదా ఆసుపత్రి సపోర్ట్‌ను సంప్రదించండి."
                    },
                    department: { en: "General", te: "జనరల్" }
                }
            });
        }

        let completion = null;
        let lastModelError = null;
        for (const modelName of symptomModelCandidates) {
            try {
                completion = await openai.chat.completions.create({
                    model: modelName,
                    messages: [{
                        role: "system",
                        content: "You are an AI diagnostic assistant for Sri Kamala Hospital based on the NVIDIA NeMo framework. The user will provide symptoms. Respond EXCLUSIVELY with a JSON object containing two fields: 'advice' (an object with 'en' and 'te' fields for English and Telugu bilingual advice) and 'department' (an object with 'en' and 'te' fields for the most relevant hospital department). Keep advice highly professional, concise, and medical. ALWAYS output valid JSON without any markdown formatting."
                    }, {
                        role: "user",
                        content: symptoms
                    }],
                    temperature: 0.2,
                    top_p: 0.7,
                    max_tokens: 1024,
                });
                break;
            } catch (modelErr) {
                lastModelError = modelErr;
                const status = modelErr?.status || modelErr?.response?.status;
                // Model not available for this account -> try next model candidate.
                if (status === 404) continue;
                throw modelErr;
            }
        }

        if (!completion) throw lastModelError || new Error('No available symptom model');

        const modelText = completion?.choices?.[0]?.message?.content || '';
        let jsonResponse = null;
        try {
            jsonResponse = JSON.parse(modelText);
        } catch (e) {
            const cleaned = modelText.replace(/```json/g, '').replace(/```/g, '').trim();
            try {
                jsonResponse = JSON.parse(cleaned);
            } catch {
                jsonResponse = {
                    advice: {
                        en: typeof modelText === 'string' && modelText.trim()
                            ? modelText
                            : "Unable to generate AI summary at the moment.",
                        te: "ప్రస్తుతం AI సారాంశాన్ని రూపొందించలేకపోయాము."
                    },
                    department: { en: "General", te: "జనరల్" }
                };
            }
        }

        res.json({ success: true, analysis: jsonResponse });
    } catch (err) {
        console.error("AI Symptom Error:", err.response?.data || err.message);
        res.json({
            success: false,
            message: "AI upstream service temporarily unavailable.",
            analysis: {
                advice: {
                    en: "AI service is temporarily unavailable. Please try again later or contact +91 99480 76665.",
                    te: "AI సేవ తాత్కాలికంగా అందుబాటులో లేదు. దయచేసి తర్వాత మళ్లీ ప్రయత్నించండి లేదా +91 99480 76665 కు కాల్ చేయండి."
                },
                department: { en: "Support", te: "మద్దతు" }
            }
        });
    }
});

// AI Vision Analyzer using custom NVIDIA Llama 3.2 90B Python -> Axios conversion
app.post('/api/ai/vision', async (req, res) => {
    try {
        const { image, symptoms } = req.body;
        const visionKey = normalizeApiKey(process.env.NVIDIA_VISION_API_KEY) || normalizeApiKey(process.env.NVIDIA_API_KEY);
        if (!visionKey) return res.status(400).json({ success: false, message: "NVIDIA Vision API Key not configured." });
        if (!image) return res.status(400).json({ success: false, message: "No image provided." });

        const invokeUrl = "https://integrate.api.nvidia.com/v1/chat/completions";
        const headers = {
            "Authorization": `Bearer ${visionKey}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
        };

        const visionModelCandidates = [
            process.env.NVIDIA_VISION_MODEL,
            "meta/llama-3.2-90b-vision-instruct",
            "nvidia/llama-3.1-405b-instruct"
        ].filter(Boolean);

        let response = null;
        let lastError = null;

        for (const modelName of visionModelCandidates) {
            try {
                const payload = {
                    "model": modelName,
                    "messages": [{
                        "role": "user",
                        "content": [
                            { 
                              "type": "text", 
                              "text": `You are a clinical diagnostic expert. Analyze this medical image. 
                              Patient context: ${symptoms || 'Visual only analysis'}. 
                              Output ONLY a JSON object (strictly no markdown) with these keys: 
                              'condition' (Primary diagnosis/issue detected), 
                              'precautions' (At least 3 specific safety precautions), 
                              'medicine' (Suggested OTC first-aid/small medicines, but add a medical warning), 
                              'lab_tests' (Recommended blood or diagnostic tests). 
                              CRITICAL: Every value MUST be an object { "en": "English text", "te": "Telugu text" }. 
                              The 'precautions', 'medicine', and 'lab_tests' values should be ARRAYS of these objects.` 
                            },
                            { 
                              "type": "image_url", 
                              "image_url": { "url": image } 
                            }
                        ]
                    }],
                    "max_tokens": 1024,
                    "temperature": 0.1, // Near-zero for strict structure adherence
                    "top_p": 0.7
                };

                response = await axios.post(invokeUrl, payload, { headers, timeout: 90000 });
                if (response.status === 200) break;
            } catch (err) {
                lastError = err;
                console.warn(`Vision model ${modelName} failed:`, err.message);
                if (err.response?.status === 404 || err.response?.status === 429) continue;
                throw err;
            }
        }

        if (!response) throw lastError || new Error("No available Vision AI models responded.");
        const jsonContent = response.data?.choices?.[0]?.message?.content;
        
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
            note: typeof rawText === 'string' ? rawText.slice(0, 220) : ''
        });

        const refusalDetected = (text) => {
            if (!text || typeof text !== 'string') return false;
            const t = text.toLowerCase();
            return [
                "i don't think this conversation is a good idea",
                "i'm not going to engage",
                "i cannot help with that",
                "can't help with that",
                "cannot assist with that request",
                "refuse",
                "not able to provide"
            ].some((k) => t.includes(k));
        };

        let jsonResponse;
        if (refusalDetected(jsonContent)) {
            jsonResponse = buildVisionFallback("Vision model refused this image/content. Please retake a clear clinical image.");
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
        const errorDetail = err.response?.data || err.message;
        console.error("AI Vision Python-Migrated Error:", JSON.stringify(errorDetail));
        
        // Return a more descriptive error if possible for debugging (key issues, quota, etc)
        res.status(500).json({ 
            success: false, 
            message: "Failed to analyze clinical image.",
            error_reason: JSON.stringify(errorDetail).includes('quota') ? 'API Quota Exhausted' : 'Check NVIDIA_VISION_API_KEY value'
        });
    }
});

// AI Chatbot using NVIDIA Llama 3 70B
app.post('/api/ai/chat', async (req, res) => {
    try {
        const { query } = req.body;
        if (!process.env.NVIDIA_API_KEY) return res.status(400).json({ success: false, message: "NVIDIA API Key not configured." });

        const completion = await openai.chat.completions.create({
            model: "meta/llama3-70b-instruct",
            messages: [{
                role: "system",
                content: "You are Dr. Kamala, the conversational AI for Sri Kamala Hospital in Suryapet. You output concise, empathetic, and professional responses. You specialize in guiding patients, providing info on bookings, treatments (Diabetes, Ortho, Gynecology), and general hospital FAQs. You have 24/7 emergency at +91 91544 04051. Respond in plain text, do not use markdown lists. Max 3 sentences."
            }, {
                role: "user",
                content: query
            }],
            temperature: 0.5,
            top_p: 1,
            max_tokens: 1024,
        });

        res.json({ success: true, response: completion.choices[0].message.content });
    } catch (err) {
        console.error("AI Chat Error:", err);
        res.status(500).json({ success: false, message: "Clinical AI is currently resting. For urgent queries call +91 99480 76665." });
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
        const { name, phone, age, gender, department, appointmentDate, reason } = req.body;
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
            order_id: `OFFLINE_${Date.now()}`
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
            orderId: item.order_id
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
                orderId: data.order_id
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
