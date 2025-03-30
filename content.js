
document.addEventListener("mouseup", async function () {

    let selectedText = window.getSelection().toString().trim();

    if (!selectedText) {
        console.log("⚠️ No text selected!"); // DEBUGGING LINE
        return;
    }

    let apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${selectedText}`;
    console.log("🌍 Fetching from:", apiUrl); // DEBUGGING LINE

    try {
        let response = await fetch(apiUrl);
        if (!response.ok) throw new Error("No definition found.");

        let data = await response.json();

        let meaning = data[0]?.meanings[0]?.definitions[0]?.definition || "No definition available.";

        showPopup(selectedText, meaning);
    } catch (error) {
        console.error("⚠️ Dictionary API error:", error);
    }
});

function showPopup(word, meaning) {
    let existingPopup = document.getElementById("dictionary-popup");
    if (existingPopup) existingPopup.remove();

    let popup = document.createElement("div");
    popup.id = "dictionary-popup";
    popup.innerHTML = `<strong>${word}:</strong> ${meaning}`;
    popup.style.position = "absolute";
    popup.style.backgroundColor = "#fd7777";
    popup.style.border = "1px solid #000";
    popup.style.padding = "5px";
    popup.style.boxShadow = "2px 2px 10px rgba(0,0,0,0.2)";
    popup.style.borderRadius = "5px";
    popup.style.fontSize = "14px";
    popup.style.maxWidth = "250px";
    popup.style.zIndex = "9999";

    document.body.appendChild(popup);

    let selection = window.getSelection();
    if (selection.rangeCount) {
        let range = selection.getRangeAt(0);
        let rect = range.getBoundingClientRect();
        popup.style.left = `${rect.left + window.scrollX + 10}px`;
        popup.style.top = `${rect.bottom + window.scrollY + 10}px`;
    }

    setTimeout(() => popup.remove(), 5000);
}

