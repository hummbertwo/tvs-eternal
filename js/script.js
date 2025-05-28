const API_KEY = '865eee93fe9fc60142d6b7b1b21ea4ea'; // Reemplaza si tienes otra clave

const elements = {
  weatherIcon: document.getElementById("weatherIcon"),
  temperature: document.getElementById("temperature"),
  date: document.getElementById("date"),
  day: document.getElementById("day"),
  time: document.getElementById("time"),
  footer: document.getElementById("footer")
};

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    videoId: 'FL-Fg0_xBco',
    playerVars: {
      autoplay: 0,
      controls: 0,
      rel: 0,
      modestbranding: 1,
      fs: 0,
      loop: 1,
      playlist: 'FL-Fg0_xBco',
      disablekb: 1,
    },
    events: {
      onReady: onPlayerReady,
    }
  });
}

function onPlayerReady(event) {
  const playButton = document.getElementById("playButton");

  playButton.addEventListener("click", function () {
    event.target.playVideo();
    playButton.style.display = "none";
  });
}

function toggleFooter() {
  elements.footer.classList.toggle("show");
}

async function getWeather() {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Monterrey,mx&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    if (data.weather && data.weather[0]) {
      const iconCode = data.weather[0].icon;
      elements.weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      elements.weatherIcon.alt = data.weather[0].description || "Clima";
      elements.temperature.textContent = `${Math.round(data.main.temp)}°`;
    }
  } catch (error) {
    console.error("Error obteniendo el clima:", error);
  }
}

function updateDateTime() {
  const now = new Date();
  const options = {
    timeZone: "America/Monterrey",
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const dateString = new Intl.DateTimeFormat("es-MX", options)
    .format(now)
    .replace(/de |,/g, "")
    .toUpperCase();

  const [weekday, day, month, year, time] = dateString.split(" ");
  elements.date.textContent = `${month} ${day}, ${year}`;
  elements.day.textContent = weekday;
  elements.time.textContent = time.toLowerCase();
}

function init() {
  getWeather();
  updateDateTime();

  setInterval(updateDateTime, 1000);
  setInterval(getWeather, 600000); // cada 10 min
  setTimeout(() => setInterval(toggleFooter, 20000), 5000); // cada 20s después de 5s
}

document.addEventListener("DOMContentLoaded", init);

