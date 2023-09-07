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

chrome.commands.onCommand.addListener(async (command) => {
  if (command === "convert_selection") {
    const activeTab = await getTab();
    const out = await chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      func: convertAndCopy
    });
    await chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      func: (msg) => console.log(msg),
      args: [out]
    });
  }
});

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
    await navigator.clipboard.writeText(converted);
    return "success";
  }
}
