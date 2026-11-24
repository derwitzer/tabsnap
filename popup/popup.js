// popup/popup.js

import { loadSnapshots } from "../lib/storage.js";

const TITLE_LENGTH = 40;

export async function restoreTabs(tabs) {
    let opened = 0;
    for (const tab of tabs) {
        try {
            await chrome.tabs.create({ url: tab.url, active: false});
            opened++;
        } catch (err) {
            console.warn("ERROR: Konnte den Tab nicht öffnen: ", tab.url, err);
        }
    }
    return opened;
}

const RESTORE_WARNING =
    "Achtung es werden sämtliche offene Tabs geschlossen und die zum Zeitpunkt der Speicherung wiederhergestellt.";

// Zeigt eine Bestätigung direkt im Snapshot-Eintrag an.
// Liefert true bei OK, false bei Abbrechen.
function confirmInline(row, message) {
    return new Promise((resolve) => {
        const box = document.createElement("div");
        box.className = "confirm";

        const text = document.createElement("p");
        text.textContent = message;

        const buttons = document.createElement("div");
        buttons.className = "confirm-buttons";

        const cancel = document.createElement("button");
        cancel.textContent = "Abbrechen";

        const ok = document.createElement("button");
        ok.className = "danger";
        ok.textContent = "OK";

        const done = (result) => {
            box.remove();
            resolve(result);
        };
        cancel.addEventListener("click", () => done(false));
        ok.addEventListener("click", () => done(true));

        buttons.append(cancel, ok);
        box.append(text, buttons);
        row.append(box);
        cancel.focus();
    });
}

export async function restoreSession(tabs) {
    // IDs der aktuell offenen Tabs merken, bevor neue dazukommen
    const oldTabIds = (await chrome.tabs.query({})).map((t) => t.id);

    // Erst öffnen, dann schließen: sonst würde Chrome das Fenster
    // (und damit das Popup) beim Schließen des letzten Tabs beenden.
    const opened = await restoreTabs(tabs);
    if (opened === 0) {
        console.warn("ERROR: Kein Tab konnte geöffnet werden, offene Tabs bleiben erhalten.");
        return;
    }

    await chrome.tabs.remove(oldTabIds);
}

function formatTimestamp(ts) {
    return new Date(ts).toLocaleString("de-AT", {
        dateStyle: "short",
        timeStyle: "medium",
    });
}

function shorten(text, max) {
    return text.length > max ? text.slice(0, max) + "…" : text;
}

function renderSnapshot(snapshot) {
    const row = document.createElement("div");
    row.className = "snapshot";

    const header = document.createElement("div");
    header.className = "snapshot-header";

    const toggle = document.createElement("button");
    toggle.className = "toggle";
    toggle.textContent = "▶";
    toggle.title = "Tabs anzeigen";

    const time = document.createElement("span");
    time.className = "time";
    time.textContent = `${formatTimestamp(snapshot.ts)} (${snapshot.tabs.length})`;

    const restore = document.createElement("button");
    restore.className = "restore";
    restore.textContent = "Wiederherstellen";
    restore.addEventListener("click", async () => {
        if (row.querySelector(".confirm")) return; // Abfrage ist schon offen
        if (await confirmInline(row, RESTORE_WARNING)) {
            await restoreSession(snapshot.tabs);
        }
    });

    const list = document.createElement("ul");
    list.className = "tab-list";
    list.hidden = true;
    for (const tab of snapshot.tabs) {
        const item = document.createElement("li");
        const title = tab.title || tab.url || "(ohne Titel)";
        item.textContent = shorten(title, TITLE_LENGTH);
        item.title = tab.url ? `${title}\n${tab.url}` : title;
        item.addEventListener("click", () => restoreTabs([tab]));
        list.append(item);
    }

    toggle.addEventListener("click", () => {
        list.hidden = !list.hidden;
        toggle.textContent = list.hidden ? "▶" : "▼";
        toggle.title = list.hidden ? "Tabs anzeigen" : "Tabs ausblenden";
    });

    header.append(toggle, time, restore);
    row.append(header, list);
    return row;
}

async function render() {
    const container = document.getElementById("savedSnapshots");
    const snapshots = await loadSnapshots();

    if (snapshots.length === 0) {
        container.textContent = "Noch keine Snapshots gespeichert.";
        return;
    }

    const newestFirst = [...snapshots].sort((a, b) => b.ts - a.ts);
    container.replaceChildren(...newestFirst.map(renderSnapshot));
}

render();
