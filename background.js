const responseNotifications = {
  success: {
    title: "Successful spOnGEcAsE conversion!",
    type: "basic",
    message:
      "The text you highlighted has been converted and copied to the clipboard, go ahead and paste it somewhere",
    iconUrl: "icon.png"
  },
  fail: {
    title: "Failed spOnGEcAsE conversion.",
    type: "basic",
    message:
      "There was an error converting selected text, try reloading the extension, or check the developer console for more information.",
    iconUrl: "icon.png"
  },
  noInput: {
    title: "No text selected",
    type: "basic",
    message:
      "You pushed the hotkey for the spongecase extension but had no text selected to convert",
    iconUrl: "icon.png"
  }
};

chrome.commands.onCommand.addListener((command) => {
  if (command === "convert_selection") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.scripting
        .executeScript({
          target: { tabId: activeTab.id },
          func: convertAndCopy
        })
        .then(() => {
          chrome.notifications.create(responseNotifications.success);
        })
        .catch(() => {
          chrome.notifications.create(responseNotifications.fail);
        });
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
      });
  } else {
    console.log("Spongecase converter: No text selected");
  }
}
