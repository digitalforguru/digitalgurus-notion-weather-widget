const weatherWidget = document.getElementById("weatherWidget");
const weatherIcon = document.getElementById("weatherIcon");
const locationElement = document.getElementById("locationName");
const temperatureElement = document.getElementById("temperature");
const descriptionElement = document.getElementById("description");
const cityInput = document.getElementById("cityInput");
const locationPopup = document.getElementById("locationPopup");
const locationBtn = document.getElementById("locationBtn");
const themeToggle = document.getElementById("themeToggle");
const themeOptions = document.getElementById("themeOptions");
const themeCircles = document.querySelectorAll(".theme-circle");
const appearanceToggle = document.getElementById("appearanceToggle");
const appearanceOptions = document.getElementById("appearanceOptions");
const appearanceChoices = document.querySelectorAll(".appearance-option");
const fontToggle = document.getElementById("fontToggle");
const fontOptions = document.getElementById("fontOptions");
const fontChoices = document.querySelectorAll(".font-option");
const copyLinkBtn = document.getElementById("copyLinkBtn");
const params = new URLSearchParams(window.location.search);
const isEmbed = params.get("embed") === "true";

const iconMap = {
  "Clear": "https://i.pinimg.com/originals/09/fb/e5/09fbe54e3fdbf459e490006c56f999f9.gif",
  "Clouds": "https://i.pinimg.com/originals/e3/9d/e9/e39de96ddbf852ed53a4e9a993550641.gif",
  "Rain": "https://i.pinimg.com/originals/2e/50/b8/2e50b8f6c94ecce01cbc30eb275fc6ea.gif",
  "Snow": "https://i.pinimg.com/originals/6e/36/7c/6e367ce95ab109121d03f12ed7d250c8.gif",
  "Thunderstorm": "https://i.pinimg.com/originals/86/5e/10/865e10e7bcc6a739e01598dfbe38e300.gif",
};

const cloudIconURL = "https://i.pinimg.com/originals/e3/9d/e9/e39de96ddbf852ed53a4e9a993550641.gif";
const apiKey = "8b38a4d3d6920110547bdaef3d73c0ba";

if (isEmbed) {
  const builderUI = document.querySelector(".builder-ui");
  if (builderUI) builderUI.style.display = "none";
}

function buildWidgetURL(city, theme, font, appearance) {
  const base = window.location.origin + window.location.pathname;

  return `${base}?city=${encodeURIComponent(city)}&theme=${theme}&font=${font}&appearance=${appearance}&embed=true`;
}

function copyWidgetLink() {
  const city = localStorage.getItem("userCity") || "Los Angeles";
  const theme = localStorage.getItem("userTheme") || "pink";
  const font = localStorage.getItem("userFont") || "default";
  const appearance = localStorage.getItem("userAppearance") || "transparent";
  
  const url = buildWidgetURL(city, theme, font, appearance);

  navigator.clipboard.writeText(url);

  const message = document.getElementById("copyMessage");

  if (message) {
    message.classList.remove("hidden");
    message.classList.add("show");
  }
  if (!isEmbed && copyLinkBtn) {
  copyLinkBtn.style.display = "none";
}

} 

appearanceToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  appearanceOptions.classList.toggle("hidden");
});

appearanceChoices.forEach(option => {
  option.addEventListener("click", () => {
    const appearance = option.getAttribute("data-appearance");

    applyAppearance(appearance);

    appearanceOptions.classList.add("hidden");
  });
});

fontToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  fontOptions.classList.toggle("hidden");
});

fontChoices.forEach(option => {
  option.addEventListener("click", () => {
    const font = option.getAttribute("data-font");

    localStorage.setItem("userFont", font);

    applyFont(font);

    fontOptions.classList.add("hidden");
  });
});

function applyFont(font) {
  let fontFamily = "";

  if (font === "serif") {
    fontFamily = "Georgia, serif";
  } else if (font === "mono") {
    fontFamily = "ui-monospace, SFMono-Regular, Menlo, monospace";
  } else {
    fontFamily = "'Satoshi', sans-serif";
  }

  weatherWidget.style.fontFamily = fontFamily;
}
function applyAppearance(appearance) {
  document.body.classList.remove(
    "appearance-transparent",
    "appearance-light",
    "appearance-dark",
    "appearance-system"
  );

  document.body.classList.add(`appearance-${appearance}`);
  localStorage.setItem("userAppearance", appearance);
}


locationBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  const isHidden = locationPopup.classList.contains("hidden");

  if (isHidden) {
    locationPopup.classList.remove("hidden");
    cityInput.focus();
  } else {
    locationPopup.classList.add("hidden");
  }
});

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();

    const city = cityInput.value.trim();

    if (city) {
      localStorage.setItem("userCity", city);
      getWeather(city);

      locationPopup.classList.add("hidden");
    }
  }
});
cityInput.addEventListener("blur", () => {
  locationPopup.classList.add("hidden");
});
document.addEventListener("click", (e) => {
  const isClickInsidePopup = locationPopup?.contains(e.target);
  const isClickLocationBtn = locationBtn.contains(e.target);

  if (!isClickInsidePopup && !isClickLocationBtn) {
    locationPopup.classList.add("hidden");
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  const urlCity = params.get("city");
  const urlTheme = params.get("theme");
  const urlFont = params.get("font");
  const urlAppearance = params.get("appearance");
  const savedAppearance = urlAppearance || localStorage.getItem("userAppearance") || "transparent";

  const savedCity = urlCity || localStorage.getItem("userCity");
  const savedTheme = urlTheme || localStorage.getItem("userTheme");
  const savedFont = urlFont || localStorage.getItem("userFont");

  if (savedCity) {
    cityInput.value = savedCity;
    getWeather(savedCity);
  } else {
    getWeather("Los Angeles");
  }

 if (savedTheme) {
  weatherWidget.className = `widget ${savedTheme} small-square`;
} else {
  weatherWidget.className = `widget pink small-square`;
}
applyAppearance(savedAppearance);
// apply font AFTER theme so it doesn't get wiped
if (savedFont) {
  applyFont(savedFont);
} else {
  applyFont("default");
}
});


function getWeather(city) {
  if (!city) return;

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=imperial&appid=${apiKey}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) throw new Error("city not found");
      return response.json();
    })
    .then(data => {
      const mainWeather = data.weather[0].main;
      const iconURL = iconMap[mainWeather] || cloudIconURL;
      weatherIcon.src = iconURL;
      weatherIcon.alt = data.weather[0].description;

      locationElement.textContent = data.name.toLowerCase();
      temperatureElement.textContent = `${Math.round(data.main.temp)}°f`;
      descriptionElement.textContent = data.weather[0].description.toLowerCase();
    })
    .catch(() => {
      weatherIcon.src = "";
      weatherIcon.alt = "";
      locationElement.textContent = "unable to fetch weather";
      temperatureElement.textContent = "";
      descriptionElement.textContent = "";
    });
}


if (copyLinkBtn) {
  copyLinkBtn.addEventListener("click", copyWidgetLink);
}

themeToggle.addEventListener("click", () => {
  themeOptions.classList.toggle("hidden");
});

themeCircles.forEach(circle => {
  circle.addEventListener("click", () => {
    const theme = circle.getAttribute("data-theme");

    weatherWidget.className = `widget ${theme} small-square`;
    localStorage.setItem("userTheme", theme);
    
    themeOptions.classList.add("hidden");
  });
  
document.addEventListener("click", (e) => {
  const clickedInsideFont = fontOptions.contains(e.target);
  const clickedFontBtn = fontToggle.contains(e.target);

  if (!clickedInsideFont && !clickedFontBtn) {
    fontOptions.classList.add("hidden");
  }
});
  
});
