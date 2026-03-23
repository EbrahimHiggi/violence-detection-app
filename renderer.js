const { ipcRenderer } = require("electron");

window.onload = () => {
  const mainVideo = document.getElementById("mainVideo");
  const alertBox = document.getElementById("alertBox");
  const alertSound = new Audio("alert.mp3"); 

  const smallCams = [
    document.getElementById("cam1"),
    document.getElementById("cam2"),
    document.getElementById("cam3"),
    document.getElementById("cam4"),
  ];

  smallCams.forEach((cam) => {
    cam.onclick = () => {
      mainVideo.src = cam.src;
      mainVideo.play();
    };
  });

  // Fullscreen
  document.getElementById("fullscreen").onclick = () => {
    if (mainVideo.requestFullscreen) mainVideo.requestFullscreen();
  };

  // Refresh
  document.getElementById("refresh").onclick = () => {
    smallCams.forEach((cam) => {
      cam.load();
      cam.play();
    });
    mainVideo.load();
    mainVideo.play();
  };

  
  ipcRenderer.on("violence-detected", (event, { camId, imagePath }) => {
    alertBox.textContent = `🚨Violence detected on camera${camId}`;
    alertBox.classList.remove("hidden");

    alertSound.play();

    setTimeout(() => {
      alertBox.classList.add("hidden");
    }, 5000);
  });

  setTimeout(() => {
    ipcRenderer.send("start-detection", { videoPath: "cam1.mp4", cameraId: 1 });
    ipcRenderer.send("start-detection", { videoPath: "cam2.mp4", cameraId: 2 });
    ipcRenderer.send("start-detection", { videoPath: "cam3.mp4", cameraId: 3 });
    ipcRenderer.send("start-detection", { videoPath: "cam4.mp4", cameraId: 4 });
  }, 2000);
};
