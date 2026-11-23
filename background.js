// background.js

import { saveSnapshot } from "./lib/storage.js";

chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.create("tabSnap_Snapshot", { periodInMinutes: 5});
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name !== "tabSnap_Snapshot") return;
    const tabs = await chrome.tabs.query({});
    await saveSnapshot(tabs.map((t) => ({ url: t.url, title: t.title})));
});