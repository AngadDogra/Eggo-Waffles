// document.addEventListener("mouseup", () => {
//     setTimeout(async () => {
//         const selectedText = window.getSelection().toString().trim();
//         console.log("🧐 Selected text:", `"${selectedText}"`);

//         if (!selectedText) {
//             console.warn("⚠️ No text selected!");
//             return;
//         }

//         const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${selectedText}`;
//         console.log("🌍 Fetching from:", apiUrl);

//         try {
//             const response = await fetch(apiUrl);
//             if (!response.ok) throw new Error("No definition found.");

//             const data = await response.json();
//             console.log("📦 API Response:", data);

//             const meaning = data[0]?.meanings[0]?.definitions[0]?.definition || "No definition available.";
//             console.log("📖 Extracted Meaning:", meaning);

//             showPopup(selectedText, meaning);
//         } catch (error) {
//             console.error("⚠️ Dictionary API error:", error);
//         }
//     }, 50);
// });

// function showPopup(word, meaning) {
//     const existing = document.getElementById("popup");
//     if (existing) existing.remove();

//     const popup = document.createElement("div");
//     popup.id = "popup";
//     popup.innerHTML = `<strong>${word}</strong><br>${meaning}`;

//     Object.assign(popup.style, {
//         position: "fixed",
//         bottom: "20px",
//         right: "20px",
//         backgroundColor: "#222",
//         color: "#fff",
//         padding: "15px",
//         borderRadius: "8px",
//         zIndex: "1000000",
//         fontSize: "16px",
//         boxShadow: "0 0 12px rgba(0,0,0,0.5)"
//     });

//     document.body.appendChild(popup);

//     setTimeout(() => popup.remove(), 10000);
// }

document.addEventListener("mouseup", (event) => {
    setTimeout(async () => {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        
        // Only proceed if exactly one word is selected (no whitespace or multiple words)
        if (!selectedText || /\s/.test(selectedText)) return;

        const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${selectedText}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("No definition found.");

            const data = await response.json();
            const meaning = data[0]?.meanings[0]?.definitions[0]?.definition || "No definition available.";
            const phonetic = data[0]?.phonetic || data[0]?.phonetics[0]?.text || "";
            const synonyms = data[0]?.meanings[0]?.definitions[0]?.synonyms || [];
            const audio = data[0]?.phonetics.find(p => p.audio)?.audio || null;

            showPopup(selectedText, meaning, phonetic, synonyms, audio, event.clientX, event.clientY);
        } catch (error) {
            console.error("Dictionary API error:", error);
        }
    }, 150);
});

// (Keep the existing showPopup() function unchanged)

function showPopup(word, meaning, phonetic, synonyms, audio, mouseX, mouseY) {
    // Remove existing popup
    const existing = document.getElementById("popup");
    if (existing) existing.remove();

    const popup = document.createElement("div");
    popup.id = "popup";

    popup.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="font-size:18px;">${word}</strong>
            <span id="close-popup" style="cursor:pointer; font-size:16px;">❌</span>
        </div>
        ${phonetic ? `<div style="color:#aaa; font-size:14px;">/${phonetic}/</div>` : ""}
        <div style="margin-top:8px;">${meaning}</div>
        ${synonyms.length ? `<div style="margin-top:6px;"><strong>Synonyms:</strong> ${synonyms.slice(0, 5).join(', ')}</div>` : ""}
        ${audio ? `<button id="play-audio" style="margin-top:8px; padding:6px 10px; font-size:14px;">🔊</button>` : ""}
    `;

    Object.assign(popup.style, {
        position: "fixed",
        top: `${mouseY + 20}px`, // offset to avoid cursor interference
        left: `${mouseX + 20}px`,
        backgroundColor: "#222",
        color: "#fff",
        padding: "15px",
        borderRadius: "8px",
        zIndex: "999999",
        fontSize: "16px",
        boxShadow: "0 0 12px rgba(0,0,0,0.5)",
        maxWidth: "300px",
        maxHeight: "300px",
        overflow: "auto",
        pointerEvents: "none" // prevent accidental clicks at spawn
    });

    document.body.appendChild(popup);

    // Re-enable interaction after a short delay
    setTimeout(() => {
        popup.style.pointerEvents = "auto";
    }, 200);

    // Close manually
    popup.querySelector("#close-popup").addEventListener("click", () => {
        popup.remove();
    });

    // Play audio
    if (audio) {
        popup.querySelector("#play-audio").addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            new Audio(audio).play();
        });
    }

    // Auto-close after 10 seconds
    setTimeout(() => {
        popup.remove();
    }, 10000);
}