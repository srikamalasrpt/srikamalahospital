from flask import Flask, request, jsonify
from flask_cors import CORS
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

# Load TFLite model (Ultra-lightweight - only ~50MB RAM!)
interpreter = None
input_details = None
output_details = None

MODEL_PATH = os.path.join(os.path.dirname(__file__), "skin_model.tflite")
if os.path.exists(MODEL_PATH):
    try:
        import tflite_runtime.interpreter as tflite
        interpreter = tflite.Interpreter(model_path=MODEL_PATH)
    except ImportError:
        # Fallback to tensorflow lite if tflite_runtime not available
        import tensorflow as tf
        interpreter = tf.lite.Interpreter(model_path=MODEL_PATH)
    
    interpreter.allocate_tensors()
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    print(f"✅ Loaded TFLite model: {MODEL_PATH}")
else:
    print(f"❌ Model not found at {MODEL_PATH}")

# Alphabetical order as trained by Keras flow_from_dataframe
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
    return jsonify({
        "status": "Skin AI Server is Up",
        "model_loaded": (interpreter is not None),
        "model_type": "TFLite (Lightweight)"
    })

@app.route("/predict", methods=["POST"])
def predict():
    if interpreter is None:
        return jsonify({"success": False, "error": "Model not loaded"}), 503

    if 'image' not in request.files:
        return jsonify({"success": False, "error": "No image uploaded"}), 400

    try:
        file = request.files['image']
        img = Image.open(file).convert('RGB').resize((224, 224))
        img_array = np.array(img, dtype=np.float32) / 255.0
        img_array = img_array.reshape(1, 224, 224, 3)

        # Run inference with TFLite
        interpreter.set_tensor(input_details[0]['index'], img_array)
        interpreter.invoke()
        pred = interpreter.get_tensor(output_details[0]['index'])[0]

        class_id = int(np.argmax(pred))
        confidence = float(np.max(pred))

        return jsonify({
            "success": True,
            "prediction": class_id,
            "condition": CLASS_NAMES[class_id],
            "confidence": confidence
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    print(f"🚀 AI Server starting on port {SKIN_AI_PORT}...")
    app.run(host="0.0.0.0", port=SKIN_AI_PORT)
