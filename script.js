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



let startValue = (localStorage.getItem("startValue"));
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
        startValue += 5;
    }
    updateTimerUI(startValue);
});

// Decrease Timer
document.getElementById("timerDec").addEventListener("click", function () {
    if (startValue > 5) {
        startValue -= 5;
    }
    updateTimerUI(startValue);
});

// Start Timer Function
function startCountdown(time) {
    let endTime = Date.now() + time * 1000;  // Store future end time
    localStorage.setItem("endTime", endTime);

    if (timer) clearInterval(timer); // Stop any existing timer

    timer = setInterval(function () {
        let remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
        let minutes = Math.floor(remainingTime / 60);
        let seconds = remainingTime % 60;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.getElementById("result").innerHTML = minutes + ":" + seconds;

        if (remainingTime <= 0) {
            clearInterval(timer);
            localStorage.removeItem("endTime");
            document.getElementById("countdown").innerHTML = "Time is up!";
        }
    }, 1000);
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
