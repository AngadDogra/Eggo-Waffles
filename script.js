
document.getElementById("startTimer").addEventListener("click", function(){
    var timeLeft = 10;
    let time = timeLeft*60;
    var timer = setInterval(function f1(){
        const minutes=Math.floor(time/60);
        let seconds=time%60;
        seconds=seconds<10?'0'+seconds:seconds;
        document.getElementById("countdown").innerHTML = minutes+":"+seconds;
        time -= 1;

        if (time <= 0){
            clearInterval(timer);
            document.getElementById("countdown").innerHTML = "Time is up!"
        }
    }, 1000);
})

let startValue = 0;

document.getElementById("timerInc").addEventListener("click", function(){
    startValue+= 5;
    document.getElementById("result").innerHTML = startValue;
})

document.getElementById("timerDec").addEventListener("click", function(){
    startValue-= 5;
    document.getElementById("result").innerHTML = startValue;
})

