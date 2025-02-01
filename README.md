# BOTSQUAD - Text Analytics AI Dashboard

### Deployed Webpage: https://text-analytics-dashboard.expo.app
---

![BotSquad-Welcome11-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/db29d5a4-ffaa-4761-8798-83f2a8ef9826)

## Overview
Text-Analytics-AI-Dashboard is an interactive AI-powered dashboard that allows users to upload and analyze text datasets with ease. The project includes a React Native frontend for seamless user interaction and a Python backend for processing the uploaded data.

## Features

- User-friendly interface for uploading datasets
- AI-driven text analysis
- Visualization tools for insights
- Mobile-friendly design using React Native

Figure 1: Uploading of Datasets
<img width="1114" alt="image" src="https://github.com/user-attachments/assets/5b1110d1-5608-4b87-8ec8-f3f118bfc2ff" />

Figure 2: AI-Driven Text Analysis - ER Diagram + Complex Network Graph
<img width="1110" alt="image" src="https://github.com/user-attachments/assets/2772690c-0c87-4e97-a860-aa0b09bfca05" />

---

## Installation

### Backend (Python)

Ensure you have Python 3.8+ installed, then set up your environment:

```bash
# Clone the repository
git clone https://github.com/your-repo/text-analytics-dashboard.git
cd text-analytics-dashboard

# Create a virtual environment
python -m venv env
source env/bin/activate  # On Windows use `env\Scripts\activate`

# Install dependencies
pip install -r requirements.txt
```

### Frontend (React Native)

Ensure you have **Node.js** and **Expo CLI** installed:

```bash
# Install Expo CLI
yarn global add expo-cli  # Or use npm install -g expo-cli

# Navigate to the React Native app directory
cd frontend

# Install dependencies
yarn install  # Or use npm install
```

---

## Usage

### Running the Backend

Start the Python server:

```bash
cd backend
python main.py
```

### Running the Frontend

Start the React Native app:

```bash
cd frontend
expo start
```

Scan the QR code in the Expo Go app to run on your mobile device. or go to the link provided.

---

---
## Deployment

Deployed the backend on Render: https://text-analytics-dashboard.onrender.com

Deployed the frontend on EAS: https://text-analytics-dashboard--pkenhup8br.expo.app/
  EAS Website: https://docs.expo.dev/build/introduction/

Hosted MySQL database on: sql12.freesqldatabase.com
Managed by PHPMyAdmin: https://www.phpmyadmin.co/sql.php?server=1&db=sql12759742&table=articles&pos=0
```
cd frontend
npm install --global eas-cli
eas init --id 836a7315-71c0-471c-9745-ce6229505bcd
npx expo export --platform web
eas deploy
eas deploy --prod
```

---

## Project Structure

```
Text-Analytics-AI-Dashboard/
│── backend/
│   ├── main.py
│   ├── data_processing.py
│   ├── requirements.txt
│
│── frontend/
│   ├── App.js
│   ├── src/
│   │   ├── screens/
│   │   │   ├── WelcomeScreen.js
│   │   │   ├── UploadScreen.js
│   │   ├── components/
│   ├── assets/
│
│── README.md
```

---

## Example Workflow

1. Open the app and navigate to the upload screen.
2. Select and upload a text dataset.
3. View the processed results and analytics on the dashboard.

---

## Contributors

- Chia Ming Han [https://github.com/minghan101]
- Bryan Ng Wen Hann [https://github.com/Bryng23]
- Delia Tan Hwee Cheng [https://github.com/delulu04]
- Cheng Lynn [https://github.com/notlynnnn]

---

## License

This project is licensed under the MIT License.

