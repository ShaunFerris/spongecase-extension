chrome.commands.onCommand.addListener((command) => {
  if (command === "convert_selection") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        function: convertAndCopy
      });
    });
  }
});

function convertAndCopy() {
  const selection = window.getSelection().toString();
  if (selection) {
    const converted = selection.toUpperCase();
    navigator.clipboard
      .writeText(converted)
      .then(() => {
        console.log("Spongecase converter: Selection copied!", converted);
      })
      .catch((error) => {
        console.log(
          "Spongecase converter: Error converting selection: ",
          error
        );
      });
  } else {
    console.log("Spongecase converter: No text selected.");
  }
}
