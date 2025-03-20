// let startValue = 5;


// function update(value){
//     document.getElementById("result".innerHTML=value+":00");
//         localStorage.setItem("startValue", value);
// }

// document.getElementById("timerInc").addEventListener("click", function(){
//      if (startValue<120) {
//         startValue+= 5;
//       }
//     update(startValue);
// })

// document.getElementById("timerDec").addEventListener("click", function(){
//     if (startValue>5) {
//         startValue-= 5;
//       }
//       update(startValue);
// })

// document.getElementById("startTimer").addEventListener("click", function(){
//     let div = document.getElementById("result");
//     let timeLeft = parseInt(div.textContent);
//     let time = timeLeft*60;
//     let timer = setInterval(function f1(){
//         const minutes=Math.floor(time/60);
//         let seconds=time%60;
//         seconds=seconds<10?'0'+seconds:seconds;
//         document.getElementById("result").innerHTML = minutes+":"+seconds;
//         time -= 1;

//         if (time <= 0){
//             clearInterval(timer);
//             document.getElementById("countdown").innerHTML = "Time is up!"
//         }
//     }, 1000);
// })
// function countdown(time){
//     let endTime=Date.now() + time * 1000; 
//     localStorage.setItem("endTime", endTime);
//     if (timer) clearInterval(timer);

//     timer = setInterval(function () {
//                 let remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
//                 let minutes = Math.floor(remainingTime / 60);
//                 let seconds = remainingTime % 60;
//                 seconds = seconds < 10 ? "0" + seconds : seconds;
        
//                 document.getElementById("result").innerHTML = minutes + ":" + seconds;
        
//                 if (remainingTime <= 0) {
//                     clearInterval(timer);
//                     localStorage.removeItem("endTime");
//                     document.getElementById("countdown").innerHTML = "Time is up!";
//                 }
//             }, 1000);
// }


// document.getElementById("startTimer").addEventListener("click", function(){
//     let timeLeft=startValue*60;
//     countdown(timeLeft);
// });

// window.onload = function () {
//     let endTime = localStorage.getItem("endTime");
//     if (endTime) {
//         let remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
//         if (remainingTime > 0) {
//             startCountdown(remainingTime);
//         } else {
//             localStorage.removeItem("endTime");
//         }
//     }
// };


const fac_quotes=[
    "Good Start! Make this session a success!",
    "In the Chinese creation myth, the universe began as a vast, formless egg containing chaos, a mix of yin and yang",
    "Pangu, a giant, emerged from this cosmic egg, symbolizing the separation of chaos into order.",
    "Pangu separated the sky (yang) from the earth (yin), creating the world as we know it.",
    "After Pangu's death, his body parts became various parts of the world, such as mountains, rivers, stars, and the sun and moon",
    "You are so close! Keep Going!",
    "You are 70% done! ",
    "You are done! We are so proud!"
]

const imgs=[
    "assets/egg.png",
    "assets/cracked.png"
]

let startValue = (localStorage.getItem("startValue")) || 5;
let timer = null;

document.getElementById("result").innerHTML = startValue + ":00";

// Update UI and store startValue
function updateTimerUI(value) {
    document.getElementById("result").innerHTML = value + ":00";
    localStorage.setItem("startValue", value);
}

// Increase Timer
document.getElementById("timerInc").addEventListener("click", function () {
    if (startValue < 120) {
        startValue += 1;
    }
    updateTimerUI(startValue);
});

// Decrease Timer
document.getElementById("timerDec").addEventListener("click", function () {
    if (startValue > 5) {
        startValue -= 1;
    }
    updateTimerUI(startValue);
});

// Start Timer Function
function startCountdown(time) {
    let endTime = Date.now() + time * 1000;  
    localStorage.setItem("endTime", endTime);

    document.getElementById("timerInc").style.display="none";
    document.getElementById("timerDec").style.display="none";
    document.getElementById("startTimer").innerHTML="Pause";

    if (timer) clearInterval(timer); 

    timer = setInterval(function () {
        let remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
        let minutes = Math.floor(remainingTime / 60);
        let seconds = remainingTime % 60;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.getElementById("result").innerHTML = minutes + ":" + seconds;

        if (remainingTime > startValue * 60* 0.90) {
            document.getElementById("quotes").innerHTML = fac_quotes[0];
            document.getElementById("eggz").src = imgs[0];
        }else if (remainingTime > startValue * 60* 0.80) {
            document.getElementById("quotes").innerHTML = fac_quotes[1];
        } else if (remainingTime > startValue * 60 * 0.70) {
            document.getElementById("quotes").innerHTML = fac_quotes[2];
        } else if (remainingTime > startValue * 60 * 0.60) {
            document.getElementById("quotes").innerHTML = fac_quotes[3];
        } else if (remainingTime > startValue * 60 * 0.50) {
            document.getElementById("quotes").innerHTML = fac_quotes[4];
        } else if (remainingTime > startValue * 60 * 0.40) {
            document.getElementById("quotes").innerHTML = fac_quotes[5];
        } else if (remainingTime > startValue * 60* 0.30) {
            document.getElementById("quotes").innerHTML = fac_quotes[6];
        } else if (remainingTime > 0) {
            document.getElementById("quotes").innerHTML = fac_quotes[7];
        }

        if (remainingTime <= 0) {
            clearInterval(timer);
            localStorage.removeItem("endTime");
            document.getElementById("startTimer").style.display="none";
            document.getElementById("quotes").style.display = "none";
            document.getElementById("result").style.display = "none";
            document.getElementById("eggz").src = imgs[1]; // Cracked Egg
            document.getElementById("startTimer").innerHTML = "Start";
     
            // Show the buttons back after time is up
            setTimeout(() => {
                document.getElementById("timerInc").style.display = "inline-block";
                document.getElementById("timerDec").style.display = "inline-block";
                document.getElementById("startTimer").innerHTML = "inline-block";
                document.getElementById("quotes").style.display = "block";
                document.getElementById("result").style.display = "block";
                document.getElementById("quotes").innerHTML = "Increase your <br> Productivity!";
                document.getElementById("eggz").src = imgs[0]; // Reset to whole egg
            }, 3000);
        }
    }, 100000000000000000000000);
}

// Start Timer
document.getElementById("startTimer").addEventListener("click", function () {
    let timeLeft = startValue * 60;
    startCountdown(timeLeft);
});

// Resume Timer After Page Reload
window.onload = function () {
    let endTime = localStorage.getItem("endTime");
    if (endTime) {
        let remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
        if (remainingTime > 0) {
            startCountdown(remainingTime);
        } else {
            localStorage.removeItem("endTime");
        }
    }
};
