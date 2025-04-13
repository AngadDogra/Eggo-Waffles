window.onload = function () {
    let count = localStorage.getItem("pomodoroCount") || 0;
    document.getElementById("ppomodoroCountDisplay").innerText = `Pomodoros Completed: ${count}`;
};

