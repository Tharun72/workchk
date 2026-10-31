from pathlib import Path
import pandas as pd

BASE_DIR = Path(__file__).resolve().parents[3]
DATA_DIR = BASE_DIR / "data"

def load_csv(filename: str):
    file_path = DATA_DIR / filename
    if not file_path.exists():
        return []
    df = pd.read_csv(file_path)
    return df.to_dict(orient="records")
