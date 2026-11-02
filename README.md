# DecaLens – AI Visual Analytics Platform

**Transforming retail spaces into data-driven environments through computer vision and customer analytics.**

DecaLens is an AI-powered visual analytics platform designed to help understand customer behaviour in retail environments. It combines computer vision, object detection, customer tracking, and interactive dashboards to organize visual data into meaningful analytics.

The project includes a React-based analytics dashboard, a FastAPI backend for serving structured analytics data, and computer-vision experiments for object detection and customer movement analysis.

---

## Overview

Understanding how customers move through a retail environment can help businesses improve store layouts, product placement, and customer experiences.

DecaLens explores this problem by processing visual data and organizing the resulting information into analytics such as:

- Customer journey analysis
- Customer interaction tracking
- Zone-wise visit analysis
- Object detection and tracking
- Frame-level analytics
- Interactive visual reports and dashboards

## Key Features

### 1. Analytics Dashboard
- Dashboard overview with key performance indicators.
- Customer dwell-time visualization.
- Zone-wise visit analytics.
- Interactive charts and visual reports.

### 2. Customer Analytics
- Customer journey data access.
- Customer interaction analytics.
- Zone visit information.
- Tracking and frame-level metrics.

### 3. Computer Vision
- YOLO-based object detection experiments.
- Object tracking and movement analysis.
- Video-frame processing.
- Structured CSV generation for downstream analytics.

### 4. REST API
The FastAPI backend exposes endpoints for retrieving customer, interaction, zone, tracking, and frame analytics.

---

## Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React.js, TypeScript, Vite |
| UI | Tailwind CSS, Radix UI, Lucide React |
| Data Visualization | Recharts |
| Backend | Python, FastAPI |
| Computer Vision | OpenCV, YOLO, Supervision |
| Data Processing | Pandas, NumPy |
| API Communication | REST APIs |
| Version Control | Git, GitHub |

---

## Project Structure

```text
DecaLens/
│
├── backend/
│   └── app/
│       ├── main.py
│       ├── routers/
│       │   ├── customers.py
│       │   ├── interactions.py
│       │   ├── zones.py
│       │   ├── tracks.py
│       │   └── frames.py
│       │
│       └── utils/
│           └── data_loader.py
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── lib/
│   ├── package.json
│   └── vite.config.ts
│
├── data/
│
├── ObjectDetection/
├── ObjectDetection-2/
├── ObjectDetection-3/
├── PointGeneration/
│
└── README.md
```

---

# Getting Started

Follow these instructions to run DecaLens locally.

## Prerequisites

Install the following before starting:

- Python 3.10 or later
- Node.js 20.19+ or 22.12+
- npm
- Git

Check your installations:

```bash
python --version
node --version
npm --version
git --version
```

## 1. Clone the Repository

```bash
git clone https://github.com/Tharun72/workchk.git
```

Navigate into the project:

```bash
cd workchk
```

## 2. Set Up the Backend

Open a terminal in the project directory.

Navigate to the backend:

```bash
cd backend
```

Create a Python virtual environment:

**Windows:**

```bash
python -m venv venv
venv\Scripts\activate
```

**Linux / macOS:**

```bash
python3 -m venv venv
source venv/bin/activate
```

Install the backend dependencies:

```bash
pip install fastapi uvicorn pandas
```

Start the FastAPI server:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

### API Documentation

FastAPI automatically generates interactive API documentation.

Open:

```text
http://127.0.0.1:8000/docs
```

You can explore and test the available endpoints directly from the browser.

## 3. Set Up the Frontend

Open a second terminal.

Navigate to the client directory from the project root:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will display the local development URL, usually:

```text
http://localhost:5173
```

Open that address in your browser to access the DecaLens dashboard.

### Optional API Configuration

The frontend API utility supports a configurable backend URL.

Create a `.env` file inside the `client/` directory:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Restart the frontend development server after changing environment variables.

---

## Backend API Endpoints

The FastAPI backend currently provides the following GET endpoints:

| Endpoint | Description |
|---|---|
| `/` | Backend health/status |
| `/customers/` | Customer journey records |
| `/interactions/` | Customer interaction records |
| `/zones/` | Zone visit records |
| `/tracks/` | Object tracking records |
| `/frames/` | Frame-level metrics |

Example:

```bash
curl http://127.0.0.1:8000/customers/
```

Each analytics endpoint returns a JSON response containing a record count and its corresponding data.

## 4. Analytics Data

The backend reads CSV files from the repository's root `data/` directory.

Expected filenames:

```text
data/
├── customerjourneyreport.csv
├── interactions.csv
├── zone_visits.csv
├── tracks.csv
└── frame_metrics.csv
```

These files are used by the backend to serve analytics through the REST API.

**Important:** The backend currently returns an empty list if a requested CSV file is missing. Add the corresponding generated or supplied CSV files to the `data/` directory to receive actual records.

---

## 5. Computer Vision Experiments

The repository also contains computer-vision notebooks and supporting scripts.

| Directory | Purpose |
|---|---|
| `ObjectDetection/` | Object detection experiments |
| `ObjectDetection-2/` | Extended detection and tracking experiments |
| `ObjectDetection-3/` | Detection pipeline with structured analytics CSV outputs |
| `PointGeneration/` | Processing tracking and interaction data into point-based outputs |

For notebook-based experiments, use Jupyter Notebook or Google Colab.

Install the commonly used computer-vision dependencies:

```bash
pip install ultralytics supervision opencv-python numpy pandas
```

Open the relevant notebook and execute its cells in order. Check the notebook's configuration and input paths before running it.

---

## Current Implementation Notes

- The React dashboard currently uses frontend mock/demo datasets for its displayed overview and visualizations.
- The FastAPI backend separately provides CSV-backed analytics endpoints.
- The computer-vision notebooks contain the experimental processing workflows.
- Running the dashboard does not automatically start video processing or connect a live camera.

These components can be developed and integrated further as the platform evolves.

---

## Future Enhancements

- Integrate live video streams with the analytics dashboard.
- Connect computer-vision processing directly to backend APIs.
- Implement real-time customer tracking and zone monitoring.
- Add automated report generation.
- Introduce historical analytics and trend comparisons.
- Improve data storage and scalability.

---

## Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Implement your changes.
4. Commit and push your changes.
5. Open a pull request describing your contribution.

---

## Author

**Tharun Raaj D A**

- GitHub: [@Tharun72](https://github.com/Tharun72)

---

**DecaLens – Turning visual data into actionable retail insights.**
