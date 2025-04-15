function persist(){
    let div = document.getElementById("result");
    let timeLeft = parseInt(div.textContent);
    let time = timeLeft*60;
    let timer = setInterval(function f1(){
        const minutes=Math.floor(time/60);
        let seconds=time%60;
        seconds=seconds<10?'0'+seconds:seconds;
        document.getElementById("result").innerHTML = minutes+":"+seconds;
        time -= 1;
    
        if (time <= 0){
            clearInterval(timer);
            document.getElementById("countdown").innerHTML = "Time is up!"
        }
    }, 1000);
}


