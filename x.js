
let startValue = localStorage.getItem("startValue") || 5;
let timer = null;
let remainingTime = localStorage.getItem("remainingTime") ? parseInt(localStorage.getItem("remainingTime")) : startValue * 60;
let isPaused = localStorage.getItem("isPaused") === "true";

document.getElementById("result").innerHTML = formatTime(remainingTime);
document.getElementById("startTimer").innerHTML = isPaused ? "Resume" : "Start";

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let sec = seconds % 60;
    return `${minutes}:${sec < 10 ? "0" + sec : sec}`;
}

// Timer Function
function startCountdown() {
    let endTime = Date.now() + remainingTime * 1000;
    localStorage.setItem("endTime", endTime);
    localStorage.setItem("isPaused", false);
    document.getElementById("startTimer").innerHTML = "Pause";

    if (timer) clearInterval(timer);

    timer = setInterval(function () {
        remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
        localStorage.setItem("remainingTime", remainingTime);
        document.getElementById("result").innerHTML = formatTime(remainingTime);

        if (remainingTime <= 0) {
            clearInterval(timer);
            localStorage.removeItem("endTime");
            localStorage.removeItem("remainingTime");
            document.getElementById("startTimer").innerHTML = "Start";
        }
    }, 1000);
}

// Pause/Resume Function
document.getElementById("startTimer").addEventListener("click", function () {
    if (isPaused) {
        isPaused = false;
        startCountdown();
    } else {
        isPaused = true;
        clearInterval(timer);
        localStorage.setItem("remainingTime", remainingTime);
        localStorage.setItem("isPaused", true);
        document.getElementById("startTimer").innerHTML = "Resume";
    }
});

// Resume on Reload
window.onload = function () {
    let endTime = localStorage.getItem("endTime");
    if (endTime && !isPaused) {
        let remainingTimeOnLoad = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
        if (remainingTimeOnLoad > 0) {
            remainingTime = remainingTimeOnLoad;
            startCountdown();
        } else {
            localStorage.removeItem("endTime");
            localStorage.removeItem("remainingTime");
        }
    }
};
