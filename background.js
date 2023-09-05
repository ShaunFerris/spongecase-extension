chrome.commands.onCommand.addListener((command) => {
  console.log("Command fired");
  if (command === "execute_browser_action") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        function: () => {
          const selectedText = window.getSelection().toString();
          if (selectedText) {
            const convertedText = selectedText.toUpperCase();
            navigator.clipboard
              .writeText(convertedText)
              .then(() => {
                console.log("Text copied to clipboard:", convertedText);
              })
              .catch((error) => {
                console.error("Error copying text to clipboard:", error);
              });
          } else {
            console.log("No text selected.");
          }
        }
      });
    });
  }
});
