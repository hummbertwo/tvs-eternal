document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("video");
  const playButton = document.getElementById("playButton");

  // NO reproducimos el video automáticamente
  video.pause(); // por si acaso

  // Mostramos el botón
  playButton.style.display = "block";

  // Al hacer clic: desmutea, reproduce, oculta botón
  playButton.addEventListener("click", () => {
    video.muted = false;
    video.play().then(() => {
      playButton.style.display = "none";
      console.log("Video y audio iniciados");
    }).catch(err => {
      console.error("Error al reproducir video:", err);
    });
  });



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
