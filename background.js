const successNotif = {
  title: "Successful spOnGEcAsE conversion!",
  type: "basic",
  message:
    "The text you highlighted has been converted and copied to the clipboard, go ahead and paste it somewhere",
  iconUrl: "icon.png"
};

chrome.commands.onCommand.addListener((command) => {
  if (command === "convert_selection") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      try {
        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          function: convertAndCopy
        });
        chrome.notifications.create(successNotif);
      } catch (error) {
        chrome.notifications.create();
      }
    });
  }
});

function convertAndCopy() {
  function spongeCase(text) {
    return text
      .split("")
      .map((char) => {
        return Math.random() < 0.5 ? char.toLowerCase() : char.toUpperCase();
      })
      .join("");
  }

  const selection = window.getSelection().toString();
  if (selection) {
    const converted = spongeCase(selection);
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
        throw error;
      });
  } else {
    console.log("Spongecase converter: No text selected.");
  }
}
