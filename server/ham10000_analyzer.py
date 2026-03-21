import pandas as pd
import kagglehub
import json
import os
from kagglehub import KaggleDatasetAdapter

def analyze():
    try:
        # Load the full HAM10000 dataset (10,015 records)
        df = kagglehub.load_dataset(
            KaggleDatasetAdapter.PANDAS,
            "kmader/skin-cancer-mnist-ham10000",
            "ham10000_metadata.csv", # Explicitly target the metadata file
        )
        
        category_map = {
            'akiec': 'Actinic Keratosis',
            'bcc': 'Basal Cell Carcinoma',
            'bkl': 'Benign Keratosis',
            'df': 'Dermatofibroma',
            'mel': 'Melanoma',
            'nv': 'Melanocytic Nevi',
            'vasc': 'Vascular Lesions'
        }

        # Simulated "Match" logic across the full dataset
        sample = df.sample(1).iloc[0]
        dx = sample['dx']
        
        result = {
            "success": True,
            "condition": category_map.get(dx, dx),
            "dx_id": dx,
            "age": int(sample['age']) if 'age' in sample and not pd.isna(sample['age']) else "Unknown",
            "sex": sample['sex'] if 'sex' in sample else "Unknown",
            "localization": sample['localization'] if 'localization' in sample else "Unknown"
        }
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))

if __name__ == "__main__":
    analyze()
