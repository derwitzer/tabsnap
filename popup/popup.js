// popup/popup.js

export async function restoreTabs(tabs) {
    for (const tab of tabs) {
        try {
            await chrome.tabs.create({ url: tab.url, active: false});
        } catch (err) {
            console.warn("ERROR: Konnte den Tab nicht öffnen: ", tab.url, err);
        }
    }
}