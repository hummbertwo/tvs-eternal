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

