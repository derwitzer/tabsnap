// lib/storage.js
const maxSnapshots = 12;

export async function saveSnapshot(tabs) {
    const { snapshots = [] } = await chrome.storage.local.get("snapshots");
    snapshots.push({ ts: Date.now(), tabs });
    await chrome.storage.local.set({ snapshots: snapshots.slice(-maxSnapshots) });
}

export async function loadSnapshots() {
    const { snapshots = [] } = await chrome.storage.local.get("snapshots");
    return snapshots;
}