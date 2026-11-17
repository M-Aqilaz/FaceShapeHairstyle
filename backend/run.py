import os
from pathlib import Path
import sys
import uvicorn

# Pastikan root direktori proyek ada di sys.path dan PYTHONPATH untuk reloader process
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

os.environ["PYTHONPATH"] = (
    str(ROOT_DIR)
    + (os.pathsep + os.environ["PYTHONPATH"] if "PYTHONPATH" in os.environ else "")
)

if __name__ == "__main__":
    uvicorn.run(
        "backend.app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        app_dir=str(ROOT_DIR),
    )
