import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
import os

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score

# ==== 1. Load Data ====
df = pd.read_csv("data/ag_news.csv", header=None)
df.columns = ['Class', 'Title', 'Description']
df['Text'] = df['Title'] + " " + df['Description']
X = df['Text']
y = df['Class']

# ==== 2. Split ====
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ==== 3. Vectorize ====
tfidf = TfidfVectorizer(stop_words='english', max_features=5000)
X_train_tfidf = tfidf.fit_transform(X_train)
X_test_tfidf = tfidf.transform(X_test)

# ==== 4. Train ====
model = LogisticRegression(max_iter=1000)
model.fit(X_train_tfidf, y_train)

# ==== 5. Predict & Evaluate ====
y_pred = model.predict(X_test_tfidf)
report = classification_report(y_test, y_pred, output_dict=True)
accuracy = accuracy_score(y_test, y_pred)

print("\nClassification Report:\n")
print(classification_report(y_test, y_pred))
print("Accuracy:", accuracy)

# ==== 6. Visualize Report ====
df_report = pd.DataFrame(report).transpose()
plt.figure(figsize=(8, 6))
sns.heatmap(df_report.iloc[:-1, :-1], annot=True, cmap="Blues", fmt=".2f")
plt.title("Classification Report Heatmap")
plt.tight_layout()
plt.savefig("classification_report.png")
plt.show()

# ==== 7. Save Model and Vectorizer ====
os.makedirs("backend/models", exist_ok=True)
joblib.dump(model, "backend/models/saved_model.pkl")
joblib.dump(tfidf, "backend/models/tfidf_vectorizer.pkl")

print("\n Model, vectorizer, and report saved.")