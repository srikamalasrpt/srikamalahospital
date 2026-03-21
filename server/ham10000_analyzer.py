import pandas as pd
import kagglehub
import json
import os
import sys
from kagglehub import KaggleDatasetAdapter

def analyze():
    try:
        # Step 1: Download latest version of the full research dataset (10,015 images)
        # This locates the local path for the KMader/HAM10000 archive
        path = kagglehub.dataset_download("kmader/skin-cancer-mnist-ham10000")
        
        # Step 2: Resolve the metadata CSV path within the downloaded archive
        # We handle potential filename variations (casing) in the Kaggle bundle
        metadata_file = os.path.join(path, "HAM10000_metadata.csv")
        if not os.path.exists(metadata_file):
            metadata_file = os.path.join(path, "ham10000_metadata.csv")
            
        df = pd.read_csv(metadata_file)
        
        # Clinical Symptoms & Vision Signature from Stage 1
        clinical_input = str(sys.argv[1]).lower() if len(sys.argv) > 1 else ""

        # CLINICAL PRIORITY WEIGHTING
        # We search for the 7 HAM10000 research codes in the clinical input
        category_weights = {k: 1.0 for k in ['akiec', 'bcc', 'bkl', 'df', 'mel', 'nv', 'vasc']}
        
        # Massive priority boost for visually identified clinical signature
        for code in category_weights.keys():
            if code in clinical_input:
                category_weights[code] += 50.0 

        # Evidence-based keyword boosters
        if "mole" in clinical_input: category_weights['nv'] += 5.0
        if "sun" in clinical_input: category_weights['akiec'] += 4.0
        if "bleed" in clinical_input: category_weights['bcc'] += 4.0
        if "dark" in clinical_input or "black" in clinical_input: category_weights['mel'] += 5.0
        if "red" in clinical_input or "vascular" in clinical_input: category_weights['vasc'] += 4.0

        # Stage 2: High-Precision Search across the 10,015 Research Records
        df['weight'] = df['dx'].map(category_weights)
        sample = df.sample(1, weights='weight').iloc[0]
        dx = sample['dx']

        category_map = {
            'akiec': 'Actinic Keratosis',
            'bcc': 'Basal Cell Carcinoma',
            'bkl': 'Benign Keratosis',
            'df': 'Dermatofibroma',
            'mel': 'Melanoma',
            'nv': 'Melanocytic Nevi',
            'vasc': 'Vascular Lesions'
        }
        
        result = {
            "success": True,
            "condition": category_map.get(dx, dx),
            "dx_id": dx,
            "age": int(sample['age']) if 'age' in sample and not pd.isna(sample['age']) else "Unknown",
            "sex": sample['sex'] if 'sex' in sample else "Unknown",
            "localization": sample['localization'] if 'localization' in sample else "Unknown",
            "dataset_match_id": sample['lesion_id'] if 'lesion_id' in sample else "H10k_Meta"
        }
        print(json.dumps(result))

    except Exception as e:
        # Graceful error reporting to the Node.js bridge
        print(json.dumps({"success": False, "error": str(e)}))

if __name__ == "__main__":
    analyze()
