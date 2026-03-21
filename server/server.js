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

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
if (supabaseUrl && supabaseKey && !supabaseUrl.includes('YOUR_')) {
    supabase = createClient(supabaseUrl, supabaseKey);
}

// SIMPLIFIED CORS for robust deployment
app.use(cors({
    origin: true, 
    credentials: true
}));

// Health Checks
app.get('/health', (req, res) => res.status(200).send('OK'));
app.get('/', (req, res) => res.status(200).send('Server is Up!'));

app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Global Config Store (Persists during runtime, ideally in DB for production)
let siteConfig = {
    showCoreServices: true,
    emergencContact: '+91 91544 04051',
    opTimings: '8:00 AM - 8:00 PM'
};

const openai = new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY || 'dummy_key_to_prevent_crash_if_missing',
    baseURL: process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1',
});

// AI Symptom Checker using NVIDIA NeMo AI (Nemotron 70B)
app.post('/api/ai/symptom', async (req, res) => {
    try {
        const { symptoms } = req.body;
        if (!process.env.NVIDIA_API_KEY) return res.status(400).json({ success: false, message: "NVIDIA API Key not configured." });

        const completion = await openai.chat.completions.create({
            model: "nvidia/llama-3.1-nemotron-70b-instruct",
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

        const jsonResponse = JSON.parse(completion.choices[0].message.content);
        res.json({ success: true, analysis: jsonResponse });
    } catch (err) {
        console.error("AI Symptom Error:", err);
        res.status(500).json({ success: false, message: "Failed to analyze symptoms." });
    }
});

// AI Vision Analyzer using custom NVIDIA Llama 3.2 90B Python -> Axios conversion
app.post('/api/ai/vision', async (req, res) => {
    try {
        const { image, symptoms } = req.body;
        // Using the separate Vision API Key from the user's request
        const visionKey = process.env.NVIDIA_VISION_API_KEY;
        if (!visionKey) return res.status(400).json({ success: false, message: "NVIDIA Vision API Key not configured." });
        if (!image) return res.status(400).json({ success: false, message: "No image provided." });

        const invokeUrl = "https://integrate.api.nvidia.com/v1/chat/completions";
        const headers = {
            "Authorization": `Bearer ${visionKey}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
        };

        const payload = {
            "model": "meta/llama-3.2-90b-vision-instruct",
            "messages": [{
                "role": "user",
                "content": [
                    { "type": "text", "text": `Analyze the clinical image. Patient symptoms: ${symptoms || 'None'}. Output purely JSON containing: 'condition' (suspected condition names), 'precautions' (array), 'requirements' (array), 'medicine' (array for OTC info but emphasize doctor), and 'lab_tests' (array). Provide all fields in bilingual format (English and Telugu) inside an object, e.g., "condition": { "en": "...", "te": "..." }. No markdown.` },
                    { "type": "image_url", "image_url": { "url": image } }
                ]
            }],
            "max_tokens": 512,
            "temperature": 1.00,
            "top_p": 1.00,
            "frequency_penalty": 0.00,
            "presence_penalty": 0.00,
            "stream": false
        };

        const response = await axios.post(invokeUrl, payload, { headers });
        const jsonContent = response.data.choices[0].message.content;

        let jsonResponse;
        try {
            jsonResponse = JSON.parse(jsonContent);
        } catch (e) {
            // Cleanup markdown if AI ignores instructions
            const cleaned = jsonContent.replace(/```json/g, '').replace(/```/g, '');
            jsonResponse = JSON.parse(cleaned);
        }

        res.json({ success: true, analysis: jsonResponse });
    } catch (err) {
        console.error("AI Vision Python-Migrated Error:", err.response?.data || err.message);
        res.status(500).json({ success: false, message: "Failed to analyze clinical image via custom Vision API." });
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
        res.status(500).json({ success: false, message: "Clinical AI is currently resting." });
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

// Create appointment (Pay at Hospital)
app.post('/api/create-appointment', async (req, res) => {
    try {
        const { token, name, phone, age, gender, department, appointmentDate, reason } = req.body;
        if (!token || !name || !phone) return res.status(400).json({ success: false, message: "Missing required fields" });

        const { data, error } = await supabase
            .from('appointments')
            .upsert({
                token, name, phone, age, gender, department, appointment_date: appointmentDate, reason,
                payment_status: 'Pay at Hospital',
                order_id: `OFFLINE_${Date.now()}`
            }, { onConflict: 'token' })
            .select();

        if (error) throw error;
        res.json({ success: true, appointment: data[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
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

        if (error) throw error;
        // Transform Supabase camelCase-like snake_case back to frontend expected names
        const transformed = data.map(item => ({
            _id: item.id,
            name: item.name,
            token: item.token,
            department: item.department,
            phone: item.phone,
            paymentStatus: item.payment_status,
            appointmentDate: item.appointment_date,
            orderId: item.order_id
        }));

        res.json({ success: true, appointments: transformed });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
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
        const { data, error } = await supabase.from('labtests').select('*');
        if (error) throw error;
        res.json({ success: true, tests: data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get('/api/pharmacy/products', async (req, res) => {
    try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        res.json({ success: true, products: data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} with SUPABASE`));
