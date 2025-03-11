// console.log("this is a popup!")

const startingMinutes=10;
let time=startingMinutes*60;

const countdownel=document.getElementById('countdown');

setInterval(updateCountDown,1000);

function updateCountDown(){
    const minutes=Math.floor(time/60);
    let seconds=time%60;
    seconds=seconds<10?'0'+seconds:seconds;

    countdownel.innerHTML=minutes+":"+seconds;
    time--;
}