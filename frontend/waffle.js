let currentStage = 1;

const waffleStages = [
  {
    src: "../assets/stage-1.png",
    status: "Step 1: Crack one egg into the bowl. Don't drop the shell!"
  },
  {
    src: "../assets/stage-2.png",
    status: "Step 2: Sweeten things up! Add sugar for that perfect sweetness."
  },
  {
    src: "../assets/stage-3.png",
    status: "Step 3: Mix in flour and milk. Stir until smooth — no lumps allowed!"
  },
  {
    src: "../assets/stage-4.png",
    status: "Step 4: Pour batter into the preheated waffle iron. Sizzle away!"
  },
  {
    src: "../assets/stage-5.png",
    status: "Step 5: Drizzle honey or syrup. Time to sweeten your success!"
  },
  {
    src: "../assets/stage-6.png",
    status: "Step 6: Your masterpiece is ready! Feast like a productivity ruler!"
  }
];

document.addEventListener('DOMContentLoaded', () => {
    // Load saved stage from chrome storage
    chrome.storage.local.get(['waffleStage'], (result) => {
      if (result.waffleStage === undefined) {
        currentStage = 1; // default stage
      } else {
        currentStage = result.waffleStage;
      }
      updateWaffle();
    });
  
    // Listen for Pomodoro complete message
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.type === "POMODORO_COMPLETE") {
        if (currentStage < waffleStages.length) {
          currentStage += 1;
          chrome.storage.local.set({ waffleStage: currentStage });
          updateWaffle();
        }
      }
    });

  });
  
  window.updateWaffle = updateWaffle;
  