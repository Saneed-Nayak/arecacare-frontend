# 🌴 ArecaCare AI – Smart Arecanut Disease Detection System

An AI-powered web application designed to help arecanut farmers identify plant diseases through image-based detection, view prediction results, and access agricultural guidance.

## 🚀 Project Overview

**ArecaCare AI** is a smart agricultural solution that uses deep learning and computer vision to detect diseases in arecanut plants. Users can upload plant images and receive AI-based predictions through a responsive web interface.

The frontend communicates with a Python FastAPI backend that processes uploaded images using a trained MobileNetV2 model.

## ✨ Key Features

- **AI Disease Detection:** Upload arecanut plant images for disease classification.
- **Prediction Results:** View detected categories and prediction confidence.
- **Grad-CAM Visualization:** View heatmaps highlighting image regions influencing the AI prediction.
- **Disease Information:** Explore information about arecanut diseases and healthy plant categories.
- **Agricultural Assistance:** Access AI-powered agricultural guidance through the chat interface.
- **Dashboard:** View plant health information and detection summaries.
- **Scan History:** Review previous plant image detection results.
- **Weather & Risk Information:** Access weather-related and disease-risk information.
- **Farm Management:** Maintain farm-related information.
- **Reports:** View plant health reports.
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices.

## 🧠 AI Model

The frontend integrates with the backend AI model:

| Component | Technology |
|---|---|
| Model | MobileNetV2 |
| Algorithm | Convolutional Neural Network (CNN) |
| Technique | Transfer Learning |
| Image Input | 224 × 224 pixels |
| Explainable AI | Grad-CAM |
| Classification | 9 categories |

The model classifies images into five disease categories and four healthy plant-part categories.

**Reported model test accuracy:** 85.90%.

## 🛠️ Technologies Used

- React
- TypeScript
- Vite
- CSS
- JavaScript
- FastAPI (backend integration)
- REST API

## 📁 Project Structure

```text
arecacare-frontend/
│
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── data/
│   ├── lib/
│   ├── views/
│   └── ...
│
├── dist/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Saneed-Nayak/arecacare-frontend.git
```

### 2. Navigate to the Project

```bash
cd arecacare-frontend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Backend API

Create a `.env` file in the frontend root directory:

```env
VITE_API_URL=http://127.0.0.1:8000
```

This connects the frontend to the locally running FastAPI backend.

### 5. Start the Development Server

```bash
npm run dev
```

Open the URL displayed in your terminal, usually:

```text
http://localhost:5173
```

## 🔗 Backend Integration

The frontend uses a FastAPI backend for AI image processing, disease prediction, and Grad-CAM visualization.

**Backend Repository:**

https://github.com/Saneed-Nayak/arecacare-backend

**Local Backend API:**

```text
http://127.0.0.1:8000
```

**API Documentation:**

```text
http://127.0.0.1:8000/docs
```

Make sure the backend server is running before testing image detection.

## 🌐 Live Demo

**Frontend Application:**

https://arecadiseasefinder.netlify.app/

**Hosting:** Netlify

## 🎯 Project Objectives

1. Develop an AI-powered arecanut disease detection application.
2. Provide an easy-to-use image upload interface.
3. Display disease classification results.
4. Integrate Grad-CAM for visual model explanations.
5. Provide useful agricultural information.
6. Build a responsive and accessible web application.
7. Connect the frontend with a real-time AI prediction backend.

## 🔮 Future Enhancements

- Improve disease classification accuracy.
- Add support for more arecanut disease categories.
- Introduce multilingual support for farmers.
- Improve mobile accessibility.
- Expand agricultural advisory features.
- Add additional AI-based plant health monitoring capabilities.

## 👨‍💻 Project Information

**Project Name:** ArecaCare AI – Smart Arecanut Disease Detection System

**Department:** Computer Science and Engineering – Data Science

**Project Type:** Final Year Academic Project

## 📄 License

This project is developed for academic and educational purposes.

---

⭐ If you find this project interesting, consider starring the repository!
