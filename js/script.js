document.addEventListener("DOMContentLoaded", function () {
    const elements = {
        video: document.getElementById("video"),
        unmuteBtn: document.getElementById("playButton"),
        footer: document.getElementById("footer"),
        infoBox: document.getElementById("infoBox"),
        infoTitle: document.getElementById("info-title"),
        infoDate: document.getElementById("info-date"),
        videoContainer: document.querySelector('.video-container'),
        weatherIcon: document.getElementById("weatherIcon"),
        temperature: document.getElementById("temperature"),
        date: document.getElementById("date"),
        day: document.getElementById("day"),
        time: document.getElementById("time")
    };
  
    const state = {
        isMinimized: false,
        currentEventIndex: 0,
        events: [
            { title: "JAPAN TEAM PRESENTATION", date: "Mar 10, 2025 - 14:30 PM" },
            { title: "STROLL BRIDGE LAUNCH", date: "Mar 11, 2025 - 7 PM" },
            { title: "BART SYSTEM UP!", date: "Mar 12, 2025 - 8 PM" }
        ],
        userInteracted: localStorage.getItem('userInteracted') === 'true'
    };
  
    // Control de audio y autoplay
    function handleAudio() {
        elements.unmuteBtn.addEventListener("click", () => {
            elements.video.muted = false;
            elements.video.play();
            elements.unmuteBtn.style.display = "none"; // Ocultar el botón al reproducir
        });
  
        // Asegurar que el video no se reproduzca automáticamente
        elements.video.pause();
    }
  
    // Alterna el tamaño del video y muestra el info-box juntos
    function toggleVideoSizeAndShowInfoBox() {
        state.isMinimized = !state.isMinimized;
        elements.videoContainer.classList.toggle("minimized", state.isMinimized);
  
        if (state.isMinimized) {
            // Mostrar info-box al mismo tiempo que el video se minimiza
            const event = state.events[state.currentEventIndex];
            elements.infoTitle.textContent = event.title;
            elements.infoDate.textContent = event.date;
            elements.infoBox.classList.add("show");
  
            setTimeout(() => {
                elements.infoBox.classList.remove("show");
                state.currentEventIndex = (state.currentEventIndex + 1) % state.events.length;
            }, 4500); // El info-box desaparece después de 4.5 segundos
        }
    }
  
    // Alterna la visibilidad del footer cada 10 segundos
    function toggleFooter() {
        elements.footer.classList.toggle("show");
    }
  
    // Datos en tiempo real
    async function getWeather() {
        try {
            const weatherClass = {
                "01d": "wi-day-sunny",
                "01n": "wi-night-clear",
                "02d": "wi-day-cloudy",
                "02n": "wi-night-alt-cloudy",
                "03d": "wi-cloud",
                "03n": "wi-cloud",
                "04d": "wi-cloudy",
                "04n": "wi-cloudy",
                "09d": "wi-showers",
                "09n": "wi-showers",
                "10d": "wi-day-rain",
                "10n": "wi-night-rain",
                "11d": "wi-thunderstorm",
                "11n": "wi-thunderstorm",
                "13d": "wi-snow",
                "13n": "wi-snow",
                "50d": "wi-fog",
                "50n": "wi-fog"
            };
            
            // Función para actualizar el icono del clima
            function updateWeatherIcon(iconCode) {
                const weatherIconElement = document.getElementById("weatherIcon");
            
                if (weatherIconElement) {
                    weatherIconElement.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // Usa el icono oficial
                }
            }
            
            // Obtener datos de OpenWeatherMap
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=Monterrey,mx&appid=865eee93fe9fc60142d6b7b1b21ea4ea&units=metric`)
                .then(response => response.json())
                .then(data => {
                    updateWeatherIcon(data.weather[0].icon);
                })
                .catch(error => console.error("Error obteniendo el clima:", error));
  
        } catch (error) {
            console.error("Error obteniendo el clima:", error);
        }
    }
  
    function updateDateTime() {
        const options = { 
            timeZone: "America/Monterrey",
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        
        const dateString = new Intl.DateTimeFormat('es-MX', options)
            .format(new Date())
            .replace(/de |,/g, '')
            .toUpperCase();
        
        const [weekday, day, month, year, time] = dateString.split(' ');
        elements.date.textContent = `${month} ${day}, ${year}`;
        elements.day.textContent = weekday;
        elements.time.textContent = time.toLowerCase();
    }
  
    // Inicialización
    function init() {
        handleAudio();
        elements.videoContainer.classList.add('minimized');
        setTimeout(() => elements.videoContainer.classList.remove('minimized'), 100);
        
        getWeather();
        updateDateTime();
        
        setInterval(updateDateTime, 1000);
        setInterval(getWeather, 600000);
  
        // Video + Info-box cada 12 segundos
        setInterval(toggleVideoSizeAndShowInfoBox, 12000);
  
        // Footer cada 10 segundos con un retraso de 5 segundos para que no coincida con el InfoBox
        setTimeout(() => {
            setInterval(toggleFooter, 20000);
        }, 5000);
    }
  
    init();
  });
  