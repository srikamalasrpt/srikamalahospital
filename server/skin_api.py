from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import os
from dotenv import load_dotenv

# Load Environment Variables
env_path = os.path.join(os.path.dirname(__file__), '.env')
if not os.path.exists(env_path):
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(env_path)

SKIN_AI_PORT = int(os.getenv('SKIN_AI_PORT', 5005))

app = Flask(__name__)
CORS(app)

# Load trained model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "skin_model.h5")
if os.path.exists(MODEL_PATH):
    model = tf.keras.models.load_model(MODEL_PATH)
    print(f"✅ Loaded model: {MODEL_PATH}")
else:
    model = None
    print(f"❌ '{MODEL_PATH}' not found. Please wait for training to finish.")

# Alphabetical order as expected by Keras flow_from_dataframe
CLASS_NAMES = [
    "Actinic Keratosis",
    "Basal Cell Carcinoma",
    "Benign Keratosis",
    "Dermatofibroma",
    "Melanocytic Nevi",
    "Melanoma",
    "Vascular Lesions"
]

@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "Skin AI Server is Up", "model_loaded": (model is not None)})

@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"success": False, "error": "Model not loaded"}), 503
        
    if 'image' not in request.files:
        return jsonify({"success": False, "error": "No image uploaded"}), 400
        
    try:
        file = request.files['image']
        img = Image.open(file).convert('RGB').resize((224, 224))
        img = np.array(img) / 255.0
        img = img.reshape(1, 224, 224, 3)

        pred = model.predict(img)
        class_id = pred.argmax()
        confidence = float(np.max(pred))

        return jsonify({
            "success": True,
            "prediction": int(class_id),
            "condition": CLASS_NAMES[class_id],
            "confidence": confidence
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    print(f"🚀 AI Server starting on port {SKIN_AI_PORT}...")
    app.run(host="0.0.0.0", port=SKIN_AI_PORT)
