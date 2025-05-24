let predictionHistory = [];

function classifyNews() {
  const input = document.getElementById("newsInput").value;
  if (!input.trim()) {
    alert("Please enter or select a news article.");
    return;
  }

  document.getElementById("loading").style.display = "block";
  document.getElementById("result").innerText = "";

  fetch("http://localhost:5000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text: input })
  })
  .then(response => response.json())
  .then(data => {
    document.getElementById("loading").style.display = "none";

    const category = data.category;
    const icons = {
      "World": "🌍",
      "Sports": "⚽",
      "Business": "💼",
      "Sci/Tech": "🔬"
    };
    const icon = icons[category] || "❓";
    const timestamp = new Date().toLocaleString();
    const predictionText = `${icon} Predicted Category: ${category} — ${timestamp}`;

    document.getElementById("result").innerText = predictionText;
    updatePredictionHistory(predictionText);
  })
  .catch(error => {
    document.getElementById("loading").style.display = "none";
    console.error("Error:", error);
    document.getElementById("result").innerText = "❌ Error making prediction.";
  });
}

function updatePredictionHistory(text) {
  if (predictionHistory.length >= 5) {
    predictionHistory.shift();
  }
  predictionHistory.push(text);
  localStorage.setItem("predictionHistory", JSON.stringify(predictionHistory));

  const historyList = document.getElementById("history");
  historyList.innerHTML = "";
  predictionHistory.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    historyList.appendChild(li);
  });
}

function clearPredictionHistory() {
  predictionHistory = [];
  localStorage.removeItem("predictionHistory");
  document.getElementById("history").innerHTML = "";
}

function setExample(text) {
  document.getElementById("newsInput").value = text;
}

window.onload = () => {
  const saved = localStorage.getItem("predictionHistory");
  if (saved) {
    predictionHistory = JSON.parse(saved);
    const historyList = document.getElementById("history");
    predictionHistory.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      historyList.appendChild(li);
    });
  }
};

function toggleDarkMode() {
  const toggle = document.getElementById("darkModeToggle");
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("darkMode", "enabled");
    toggle.textContent = "☀️"; // sun icon
    toggle.title = "Switch to Light Mode";
  } else {
    localStorage.setItem("darkMode", "disabled");
    toggle.textContent = "🌙"; // moon icon
    toggle.title = "Switch to Dark Mode";
  }
}

window.onload = () => {
  // your existing onload code for predictionHistory...

  // Dark mode icon load
  const toggle = document.getElementById("darkModeToggle");
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    toggle.textContent = "☀️";
    toggle.title = "Switch to Light Mode";
  } else {
    toggle.textContent = "🌙";
    toggle.title = "Switch to Dark Mode";
  }
};
