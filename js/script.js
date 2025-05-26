document.addEventListener("DOMContentLoaded", function () {
  const API_KEY = '865eee93fe9fc60142d6b7b1b21ea4ea';

  const elements = {
    video: document.getElementById("video"),
    unmuteBtn: document.getElementById("playButton"),
    footer: document.getElementById("footer"),
    videoContainer: document.querySelector(".video-container"),
    weatherIcon: document.getElementById("weatherIcon"),
    temperature: document.getElementById("temperature"),
    date: document.getElementById("date"),
    day: document.getElementById("day"),
    time: document.getElementById("time"),
  };

  const state = {
    userInteracted: localStorage.getItem("userInteracted") === "true",
  };

  function handleAudio() {
    elements.unmuteBtn.addEventListener("click", () => {
      elements.video.muted = false;
      elements.video.play().catch((err) => console.warn("Error:", err));
      elements.unmuteBtn.style.display = "none";
      localStorage.setItem("userInteracted", "true");
    });

    elements.video.pause();

    if (!state.userInteracted) {
      elements.unmuteBtn.style.display = "block";
    } else {
      elements.video.play().catch(() => {});
      elements.unmuteBtn.style.display = "none";
    }
  }

  function toggleFooter() {
    elements.footer.classList.toggle("show");
  }

  async function getWeather() {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Monterrey,mx&appid=${API_KEY}&units=metric`);
      const data = await response.json();
      if (data.weather && data.weather[0]) {
        elements.weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
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

    const dateString = new Intl.DateTimeFormat("es-MX", options).format(now).replace(/de |,/g, "").toUpperCase();
    const [weekday, day, month, year, time] = dateString.split(" ");
    elements.date.textContent = `${month} ${day}, ${year}`;
    elements.day.textContent = weekday;
    elements.time.textContent = time.toLowerCase();
  }

  function init() {
    handleAudio();
    elements.videoContainer.classList.add("minimized");
    setTimeout(() => elements.videoContainer.classList.remove("minimized"), 100);

    getWeather();
    updateDateTime();
    setInterval(updateDateTime, 1000);
    setInterval(getWeather, 600000);
    setTimeout(() => setInterval(toggleFooter, 20000), 5000);
  }

  init();
});
