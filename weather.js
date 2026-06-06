const weatherWidget = document.getElementById("weatherWidget");
const previewWeatherWidget = document.getElementById("previewWeatherWidget");

const weatherIcon = document.getElementById("weatherIcon");
const previewWeatherIcon = document.getElementById("previewWeatherIcon");

const locationElement = document.getElementById("locationName");
const previewLocationElement = document.getElementById("previewLocationName");

const temperatureElement = document.getElementById("temperature");
const previewTemperatureElement = document.getElementById("previewTemperature");

const descriptionElement = document.getElementById("description");
const previewDescriptionElement = document.getElementById("previewDescription");

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
const copyMessage = document.getElementById("copyMessage");

const params = new URLSearchParams(window.location.search);
const isEmbed = params.get("embed") === "true";

const iconMap = {
  Clear: "https://i.pinimg.com/originals/09/fb/e5/09fbe54e3fdbf459e490006c56f999f9.gif",
  Clouds: "https://i.pinimg.com/originals/e3/9d/e9/e39de96ddbf852ed53a4e9a993550641.gif",
  Rain: "https://i.pinimg.com/originals/2e/50/b8/2e50b8f6c94ecce01cbc30eb275fc6ea.gif",
  Snow: "https://i.pinimg.com/originals/6e/36/7c/6e367ce95ab109121d03f12ed7d250c8.gif",
  Thunderstorm: "https://i.pinimg.com/originals/86/5e/10/865e10e7bcc6a739e01598dfbe38e300.gif",
};

const cloudIconURL =
  "https://i.pinimg.com/originals/e3/9d/e9/e39de96ddbf852ed53a4e9a993550641.gif";

const apiKey = "8b38a4d3d6920110547bdaef3d73c0ba";

if (isEmbed) {
  document.documentElement.classList.add("embed-mode");
}

function buildWidgetURL(city, theme, font, appearance) {
  const base = window.location.origin + window.location.pathname;

  return `${base}?city=${encodeURIComponent(
    city
  )}&theme=${theme}&font=${font}&appearance=${appearance}&embed=true`;
}

function setWeatherContent({ iconURL, alt, location, temperature, description }) {
  [weatherIcon, previewWeatherIcon].forEach((icon) => {
    if (!icon) return;

    icon.src = iconURL || "";
    icon.alt = alt || "";
  });

  [locationElement, previewLocationElement].forEach((element) => {
    if (element) element.textContent = location || "";
  });

  [temperatureElement, previewTemperatureElement].forEach((element) => {
    if (element) element.textContent = temperature || "";
  });

  [descriptionElement, previewDescriptionElement].forEach((element) => {
    if (element) element.textContent = description || "";
  });
}

function applyWidgetClass(theme) {
  const selectedTheme = theme || "pink";

  if (weatherWidget) {
    weatherWidget.className = `widget ${selectedTheme} small-square embed-widget`;
  }

  if (previewWeatherWidget) {
    previewWeatherWidget.className = `widget ${selectedTheme} small-square`;
  }

  if (themeToggle) {
    themeToggle.style.setProperty(
      "--theme-color",
      getComputedStyle(document.documentElement).getPropertyValue("--theme-color")
    );
  }
}

function copyWidgetLink() {
  const city = localStorage.getItem("userCity") || "Los Angeles";
  const theme = localStorage.getItem("userTheme") || "pink";
  const font = localStorage.getItem("userFont") || "default";
  const appearance = localStorage.getItem("userAppearance") || "system";

  const url = buildWidgetURL(city, theme, font, appearance);

  navigator.clipboard.writeText(url);

  if (copyMessage) {
    copyMessage.classList.remove("hidden");
    copyMessage.classList.add("show");

    setTimeout(() => {
      copyMessage.classList.remove("show");
      copyMessage.classList.add("hidden");
    }, 2500);
  }
}

function applyFont(font) {
  let fontFamily = "";

  if (font === "serif") {
    fontFamily = "Georgia, serif";
  } else if (font === "mono") {
    fontFamily = "ui-monospace, SFMono-Regular, Menlo, monospace";
  } else {
    fontFamily = "'Satoshi', sans-serif";
  }

  [weatherWidget, previewWeatherWidget].forEach((widget) => {
    if (widget) widget.style.fontFamily = fontFamily;
  });
}

function applyAppearance(appearance) {
  const selectedAppearance = appearance || "transparent";

  document.body.classList.remove(
    "appearance-transparent",
    "appearance-light",
    "appearance-dark",
    "appearance-system"
  );

  document.body.classList.add(`appearance-${selectedAppearance}`);
  localStorage.setItem("userAppearance", selectedAppearance);
}

function getWeather(city) {
  if (!city) return;

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&units=imperial&appid=${apiKey}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) throw new Error("city not found");
      return response.json();
    })
    .then((data) => {
      const mainWeather = data.weather[0].main;
      const iconURL = iconMap[mainWeather] || cloudIconURL;

      setWeatherContent({
        iconURL,
        alt: data.weather[0].description,
        location: data.name.toLowerCase(),
        temperature: `${Math.round(data.main.temp)}°f`,
        description: data.weather[0].description.toLowerCase(),
      });
    })
    .catch(() => {
      setWeatherContent({
        iconURL: "",
        alt: "",
        location: "unable to fetch weather",
        temperature: "",
        description: "",
      });
    });
}

window.addEventListener("DOMContentLoaded", () => {
  const urlCity = params.get("city");
  const urlTheme = params.get("theme");
  const urlFont = params.get("font");
  const urlAppearance = params.get("appearance");

  const savedCity = urlCity || localStorage.getItem("userCity") || "Los Angeles";
  const savedTheme = urlTheme || localStorage.getItem("userTheme") || "pink";
  const savedFont = urlFont || localStorage.getItem("userFont") || "default";
  const savedAppearance =
    urlAppearance || localStorage.getItem("userAppearance") || "transparent";

  if (cityInput) cityInput.value = savedCity;

  localStorage.setItem("userCity", savedCity);
  localStorage.setItem("userTheme", savedTheme);
  localStorage.setItem("userFont", savedFont);
  localStorage.setItem("userAppearance", savedAppearance);

  getWeather(savedCity);
  applyWidgetClass(savedTheme);
  applyAppearance(savedAppearance);
  applyFont(savedFont);
});

if (locationBtn && locationPopup && cityInput) {
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
    setTimeout(() => {
      locationPopup.classList.add("hidden");
    }, 120);
  });
}

if (copyLinkBtn) {
  copyLinkBtn.addEventListener("click", copyWidgetLink);
}

if (themeToggle && themeOptions) {
  themeToggle.addEventListener("click", (e) => {
    e.stopPropagation();

    themeOptions.classList.toggle("hidden");
    fontOptions?.classList.add("hidden");
    appearanceOptions?.classList.add("hidden");
  });
}

themeCircles.forEach((circle) => {
  circle.addEventListener("click", () => {
    const theme = circle.getAttribute("data-theme") || "pink";

    applyWidgetClass(theme);
    localStorage.setItem("userTheme", theme);

    themeOptions?.classList.add("hidden");
  });
});

if (appearanceToggle && appearanceOptions) {
  appearanceToggle.addEventListener("click", (e) => {
    e.stopPropagation();

    appearanceOptions.classList.toggle("hidden");
    themeOptions?.classList.add("hidden");
    fontOptions?.classList.add("hidden");
  });
}

appearanceChoices.forEach((option) => {
  option.addEventListener("click", () => {
    const appearance = option.getAttribute("data-appearance") || "transparent";

    applyAppearance(appearance);
    appearanceOptions?.classList.add("hidden");
  });
});

if (fontToggle && fontOptions) {
  fontToggle.addEventListener("click", (e) => {
    e.stopPropagation();

    fontOptions.classList.toggle("hidden");
    themeOptions?.classList.add("hidden");
    appearanceOptions?.classList.add("hidden");
  });
}

fontChoices.forEach((option) => {
  option.addEventListener("click", () => {
    const font = option.getAttribute("data-font") || "default";

    localStorage.setItem("userFont", font);
    applyFont(font);

    fontOptions?.classList.add("hidden");
  });
});

document.addEventListener("click", (e) => {
  if (
    locationPopup &&
    locationBtn &&
    !locationPopup.contains(e.target) &&
    !locationBtn.contains(e.target)
  ) {
    locationPopup.classList.add("hidden");
  }

  if (
    themeOptions &&
    themeToggle &&
    !themeOptions.contains(e.target) &&
    !themeToggle.contains(e.target)
  ) {
    themeOptions.classList.add("hidden");
  }

  if (
    appearanceOptions &&
    appearanceToggle &&
    !appearanceOptions.contains(e.target) &&
    !appearanceToggle.contains(e.target)
  ) {
    appearanceOptions.classList.add("hidden");
  }

  if (
    fontOptions &&
    fontToggle &&
    !fontOptions.contains(e.target) &&
    !fontToggle.contains(e.target)
  ) {
    fontOptions.classList.add("hidden");
  }
});

