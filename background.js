/**
 * Main code for the service worker.
 * Sets an event listener for the hotkey defined in manifest.json and runs the
 * text conversion function when it fires. Also throws the user a notification
 * based on the response from the conversion function.
 */
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "convert_selection") {
    const activeTab = await getTab();
    const response = await chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      func: convertAndCopy
    });
    const notifMsg = responseNotifications[response[0].result];
    chrome.notifications.create(notifMsg);
  }
});

/**
 * Functions for getting the current browser tab, string conversion/copying
 * and object storing the options for outcome notifications.
 */
async function getTab() {
  const queryOptions = { active: true, currentWindow: true };
  const [activeTab] = await chrome.tabs.query(queryOptions);
  return activeTab;
}

async function convertAndCopy() {
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
    try {
      await navigator.clipboard.writeText(converted);
      return "success";
    } catch (error) {
      console.log(error);
      return "fail";
    }
  } else return "noInput";
}

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
