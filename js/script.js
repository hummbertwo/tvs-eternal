document.addEventListener("DOMContentLoaded", function () {
    const API_KEY = '865eee93fe9fc60142d6b7b1b21ea4ea'; // Clave API del clima

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
            elements.video.play().catch(err => console.warn("Error al reproducir el video:", err));
            elements.unmuteBtn.style.display = "none";
            localStorage.setItem('userInteracted', 'true');
        });

        elements.video.pause();

        // Mostrar botón si no ha interactuado
        if (!state.userInteracted) {
            elements.unmuteBtn.style.display = "block";
        } else {
            elements.unmuteBtn.style.display = "none";
        }
    }

    // Alterna el tamaño del video y muestra el info-box juntos
    function toggleVideoSizeAndShowInfoBox() {
        state.isMinimized = !state.isMinimized;
        elements.videoContainer.classList.toggle("minimized", state.isMinimized);

        if (state.isMinimized) {
            const event = state.events[state.currentEventIndex];
            elements.infoTitle.textContent = event.title;
            elements.infoDate.textContent = event.date;
            elements.infoBox.classList.add("show");

            setTimeout(() => {
                elements.infoBox.classList.remove("show");
                state.currentEventIndex = (state.currentEventIndex + 1) % state.events.length;
            }, 4500);
        }
    }

    // Alterna la visibilidad del footer cada 20 segundos
    function toggleFooter() {
        elements.footer.classList.toggle("show");
    }

    // Datos en tiempo real del clima
    async function getWeather() {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Monterrey,mx&appid=${API_KEY}&units=metric`);
            const data = await response.json();

            if (elements.weatherIcon && data.weather[0]) {
                elements.weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            }
        } catch (error) {
            console.error("Error obteniendo el clima:", error);
        }
    }

    function updateDateTime() {
        const now = new Date();
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
            .format(now)
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

        // Efecto visual inicial en el contenedor de video
        elements.videoContainer.classList.add('minimized');
        setTimeout(() => elements.videoContainer.classList.remove('minimized'), 100);

        getWeather();
        updateDateTime();

        setInterval(updateDateTime, 1000);           // Actualizar hora cada segundo
        setInterval(getWeather, 600000);             // Actualizar clima cada 10 min
        setInterval(toggleVideoSizeAndShowInfoBox, 12000); // Evento+info cada 12 s

        // Footer cada 20 s, iniciando después de 5 s
        setTimeout(() => {
            setInterval(toggleFooter, 20000);
        }, 5000);
    }

    init();
});
