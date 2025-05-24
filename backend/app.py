from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Load model and vectorizer
model = joblib.load("backend/models/saved_model.pkl")
tfidf = joblib.load("backend/models/tfidf_vectorizer.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "Invalid input"}), 400
    
    text = data["text"]
    vector = tfidf.transform([text])
    prediction = model.predict(vector)[0]

    # Map number to label
    label_map = {
        1: "World",
        2: "Sports",
        3: "Business",
        4: "Sci/Tech"
    }
    label = label_map.get(int(prediction), "Unknown")

    return jsonify({"category": label})

if __name__ == "__main__":
    app.run(debug=True)
