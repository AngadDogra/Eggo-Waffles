// console.log("this is a popup!")
/*
const startingMinutes=10;
let time=startingMinutes*60;

const countdownel=document.getElementById('#countdown');

setInterval(updateCountDown,1000);

function updateCountDown(){
    const minutes=Math.floor(time/60);
    let seconds=time%60;
    seconds=seconds<10?'0'+seconds:seconds;

    countdownel.innerHTML=minutes+":"+seconds;
    time--;
}
*/
document.getElementById("startTimer").addEventListener("click", function(){
    var timeLeft = 0.1;
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
