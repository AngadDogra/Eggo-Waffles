
let startValue = localStorage.getItem("timerValue") ? parseInt(localStorage.getItem("timerValue")) : 0;
document.getElementById("result").innerHTML = startValue;


document.getElementById("timerInc").addEventListener("click", function(){
    if (startValue < 120) {
        startValue += 5;
    }
    document.getElementById("result").innerHTML = startValue;
    localStorage.setItem("timerValue", startValue);
});

document.getElementById("timerDec").addEventListener("click", function(){
    if (startValue > 0) {
        startValue -= 5;
    }
    document.getElementById("result").innerHTML = startValue;
    localStorage.setItem("timerValue", startValue);
});

document.getElementById("startTimer").addEventListener("click", function(){
    let div = document.getElementById("result");
    let timeLeft = parseInt(div.textContent);
    localStorage.setItem("timerValue", timeLeft);  // Save the latest time before starting countdown
    let time = timeLeft * 60;

    let timer = setInterval(function(){
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        document.getElementById("result").innerHTML = minutes + ":" + seconds;
        time -= 1;

        if (time < 0){
            clearInterval(timer);
            document.getElementById("countdown").innerHTML = "Time is up!";
        }
    }, 1000);
});
