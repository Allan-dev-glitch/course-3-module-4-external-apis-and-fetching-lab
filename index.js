const stateInput = document.getElementById("state-input");
const fetchAlertsBtn = document.getElementById("fetch-alerts");
const alertsDisplay = document.getElementById("alerts-display");
const errorMessageDiv = document.getElementById("error-message");

// Mapping state abbreviations to full names
const stateNames = {
    AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas",
    CA: "California", CO: "Colorado", CT: "Connecticut", DE: "Delaware",
    FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho",
    IL: "Illinois", IN: "Indiana", IA: "Iowa", KS: "Kansas",
    KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
    MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi",
    MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada",
    NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York",
    NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma",
    OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
    SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah",
    VT: "Vermont", VA: "Virginia", WA: "Washington", WV: "West Virginia",
    WI: "Wisconsin", WY: "Wyoming"
};

fetchAlertsBtn.addEventListener("click", function () {
    const state = stateInput.value.trim();

    // Input validation: must be exactly 2 capital letters
    if (!/^[A-Z]{2}$/.test(state)) {
        displayError("Please enter a valid state abbreviation");
        return;
    }

    fetchWeatherData(state);
});

function fetchWeatherData(state) {
    const url = `https://api.weather.gov/alerts/active?area=${state}`;

    fetch(url)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Failed to fetch alerts. Network error.");
            }
            return response.json();
        })
        .then(function (data) {
            displayWeather(data, state);
            clearError();
            stateInput.value = ""; // Clear input after successful fetch
        })
        .catch(function (error) {
            displayError(error.message);
        });
}

function displayWeather(data, state) {
    alertsDisplay.innerHTML = "";

    const count = data.features.length;
    const fullStateName = stateNames[state];

    // Create summary
    const summary = document.createElement("p");
    summary.textContent =
        "Current watches, warnings, and advisories for " +
        fullStateName +
        ": " +
        count;
    alertsDisplay.appendChild(summary);

    // Create list of alert headlines
    const ul = document.createElement("ul");
    data.features.forEach(function (alert) {
        const li = document.createElement("li");
        li.textContent = alert.properties.headline || "No headline available";
        ul.appendChild(li);
    });

    alertsDisplay.appendChild(ul);
}

// Display error message
function displayError(message) {
    errorMessageDiv.textContent = message;
    alertsDisplay.innerHTML = ""; // Clear alerts on error
}

// Clear error message
function clearError() {
    errorMessageDiv.textContent = "";
}
