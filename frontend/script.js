const fac_quotes = [
    "Good Start! Make this session a success!",
    "In the Chinese creation myth, the universe began as a vast, formless egg containing chaos, a mix of yin and yang",
    "Pangu, a giant, emerged from this cosmic egg, symbolizing the separation of chaos into order.",
    "Pangu separated the sky (yang) from the earth (yin), creating the world as we know it.",
    "After Pangu's death, his body parts became various parts of the world, such as mountains, rivers, stars, and the sun and moon",
    "You are so close! Keep Going!",
    "You are 70% done!",
    "You are almost done! We are so proud!"
];

const imgs = ["assets/egg.png", "assets/cracked.png"];

let startValue = Number(localStorage.getItem("startValue")) || 5; // Default 5 minutes
let isPaused = localStorage.getItem("isPaused") === "true"; // Retrieve pause state
let remainingTime = parseInt(localStorage.getItem("remainingTime"), 10) || startValue * 60;
let timer = null;
let token = localStorage.getItem('jwt_token');

function updateTimerUI(time) {
    let minutes = Math.floor(time / 60); //converts seconds to minutes
    let seconds = time % 60; //converts to seconds
    seconds = seconds < 10 ? "0" + seconds : seconds; // displays seconds in a single double digit manner
    document.getElementById("result").innerHTML = minutes + ":" + seconds;
}

// Increase Timer
document.getElementById("timerInc").addEventListener("click", function () {
    if (startValue < 120) {
        startValue += 5;
        remainingTime = startValue * 60;
        updateTimerUI(remainingTime);
        localStorage.setItem("startValue", startValue);
        localStorage.setItem("remainingTime", remainingTime);
    }
});

// Decrease Timer
document.getElementById("timerDec").addEventListener("click", function () {
    if (startValue > 5) {
        startValue -= 5;
        remainingTime = startValue * 60;
        updateTimerUI(remainingTime);
        localStorage.setItem("startValue", startValue);
        localStorage.setItem("remainingTime", remainingTime);
    }
});

// Start Timer Function
function startCountdown(time) { 
    let endTime = Date.now() + time * 1000;
    localStorage.setItem("endTime", endTime);

    document.getElementById("timerInc").style.display = "none";
    document.getElementById("timerDec").style.display = "none";
    document.getElementById("startTimer").innerHTML = "Pause";

    if (timer) clearInterval(timer);

    timer = setInterval(function () {
        if (isPaused) {
            localStorage.setItem("remainingTime", remainingTime);
            return;
        }

        remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
        updateTimerUI(remainingTime);
        localStorage.setItem("remainingTime", remainingTime);

        // Update motivational quotes
        if (remainingTime > startValue * 60 * 0.90) {
            document.getElementById("quotes").innerHTML = fac_quotes[0];
        } else if (remainingTime > startValue * 60 * 0.80) {
            document.getElementById("quotes").innerHTML = fac_quotes[1];
        } else if (remainingTime > startValue * 60 * 0.70) {
            document.getElementById("quotes").innerHTML = fac_quotes[2];
        } else if (remainingTime > startValue * 60 * 0.60) {
            document.getElementById("quotes").innerHTML = fac_quotes[3];
        } else if (remainingTime > startValue * 60 * 0.50) {
            document.getElementById("quotes").innerHTML = fac_quotes[4];
        } else if (remainingTime > startValue * 60 * 0.40) {
            document.getElementById("quotes").innerHTML = fac_quotes[5];
        } else if (remainingTime > startValue * 60 * 0.30) {
            document.getElementById("quotes").innerHTML = fac_quotes[6];
        } else if (remainingTime > 0) {
            document.getElementById("quotes").innerHTML = fac_quotes[7];
        }

        // **Egg shaking and sound effect at 7 seconds left**
        if (remainingTime === 7) {
            const eggElement = document.getElementById("eggz");
            eggElement.classList.add("shake"); // Apply shaking animation

            // Play hatching sound
            const hatchAudio = new Audio("assets/egg_hatch_audio.mp3");
            hatchAudio.play();
        }

        // Timer reaches 0
        if (remainingTime <= 0) {
            clearInterval(timer);
            localStorage.removeItem("endTime");
            localStorage.removeItem("remainingTime");

            let completedCount = parseInt(localStorage.getItem("pomodoroCount") || "0", 10);
            localStorage.setItem("pomodoroCount", completedCount + 1);
        

            document.getElementById("startTimer").style.display = "none";
            document.getElementById("quotes").style.display = "none";
            document.getElementById("result").style.display = "none";

            // **Egg cracks**
            document.getElementById("eggz").src = imgs[1];

            // **Stop shaking**
            document.getElementById("eggz").classList.remove("shake");

            document.getElementById("startTimer").innerHTML = "Start";

            chrome.tabs.create({ url: chrome.runtime.getURL("main_page.html") });

            setTimeout(() => {
                document.getElementById("timerInc").style.display = "inline-block";
                document.getElementById("timerDec").style.display = "inline-block";
                document.getElementById("startTimer").style.display = "inline-block";
                document.getElementById("quotes").style.display = "block";
                document.getElementById("result").style.display = "block";
                document.getElementById("quotes").innerHTML = "Increase your <br> Productivity!";

                // **Reset egg to whole**
                document.getElementById("eggz").src = imgs[0];
            }, 3000);
        }
    }, 1000);
}


// Start/Pause Timer
document.getElementById("startTimer").addEventListener("click", function () {
    isPaused = !isPaused;
    localStorage.setItem("isPaused", isPaused);
    localStorage.setItem("remainingTime", remainingTime);
    
    this.innerHTML = isPaused ? "Resume" : "Pause";

    if (!isPaused) {
        clearInterval(timer); // Clear any existing interval
        startCountdown(remainingTime); // Restart timer immediately
    }

    // Ensure arrows remain hidden when resuming
    if (!isPaused) {
        document.getElementById("timerInc").style.display = "none";
        document.getElementById("timerDec").style.display = "none";
    }
});



// Resume Timer After Page Reload
window.onload = function () {
    let endTime = localStorage.getItem("endTime");
    let storedTime = localStorage.getItem("remainingTime");
    let storedPaused = localStorage.getItem("isPaused") === "true";

    if (storedTime) {
        remainingTime = parseInt(storedTime, 10);
        updateTimerUI(remainingTime);
    } else {
        updateTimerUI(startValue * 60);
    }

    if (storedPaused) {
        isPaused = true;
        document.getElementById("startTimer").innerHTML = "Resume";
    }

    if (endTime) {
        let timeLeft = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
        if (timeLeft > 0) {
            remainingTime = timeLeft;
            updateTimerUI(timeLeft);
            if (!isPaused) {
                startCountdown(timeLeft);
            }
        } else {
            localStorage.removeItem("endTime");
        }
    }
};

// Toggle Background Music
document.getElementById("toggleMusic").addEventListener("click", function () {
    let bgMusic = document.getElementById("bgMusic");

    if (bgMusic.paused) {
        bgMusic.play();
        this.textContent = "Pause Music";
    } else {
        bgMusic.pause();
        this.textContent = "Play Music";
    }
});


// ----for updating pomos and send to backend-------------

function updatePomodoroCount(count) {
    let token = localStorage.getItem('jwt_token');  // Get the stored token
  
    if (token) {
      fetch('http://localhost:5000/update_pomodoros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // Send the token in Authorization header
        },
        body: JSON.stringify({
          completed_count: count
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Pomodoro count updated:', data);
      })
      .catch(error => {
        console.error('Error updating Pomodoro count:', error);
      });
    }
  }
  


  