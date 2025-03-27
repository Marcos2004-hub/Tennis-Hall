document.addEventListener("DOMContentLoaded", function () {
    const video = document.getElementById("intro-video");
    video.onended = function () {
        window.location.href = "login.html"; 
    };
});
