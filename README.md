# Real-Time AI Investment Advisor Dashboard

## Project Overview

This project is a real-time AI-powered investment advisor dashboard designed to help users make smarter financial decisions based on risk profiling, stock forecasting, explainable AI insights, and portfolio recommendations.

## Key Features

* **User Risk Profiling**: Dynamic questionnaire and ML-based scoring system to assess individual risk tolerance.
* **Real-Time Market Data**: Integration with Alpha Vantage API to fetch live stock data.
* **Stock Forecasting**: Predictive modeling using machine learning to forecast stock trends.
* **Explainable AI (XAI)**: Uses SHAP and LIME to provide transparency behind investment recommendations.
* **Portfolio Analysis**: Interactive visualization tools for assessing asset allocation and risk exposure.
* **News Integration**: Real-time financial news feed with NLP-based sentiment tagging.

## Tech Stack

* **Frontend**: React.js, TypeScript, Tailwind CSS, Recharts
* **Backend**: Python Flask, REST API, MongoDB
* **AI/ML**: Scikit-learn, Pandas, SHAP, LIME
* **Data Sources**: Alpha Vantage, News API

## Folder Structure

```
Real-Time AI Investment Advisor Dashboard/
├── backend/
│   ├── app.py
│   ├── model/
│   └── services/
├── frontend/
│   ├── src/
│   └── public/
├── README.md
├── .gitignore
└── package.json
```

## How to Run

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Future Enhancements

* Integration with more financial APIs (e.g., Yahoo Finance)
* Advanced portfolio optimization using MPT
* User authentication and profile management
* Mobile responsive version

## License

This project is open source and available under the MIT License.
