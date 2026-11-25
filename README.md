# TabSnap - a browser extension

As I often recognized, that the crash recovery of tabs won’t work perfectly in modern browsers, I had the idea to code a small extension for Chromium based Browsers as a helper.

This Extension is creating every five minutes a snapshot of the opened tabs and you can easly recover them after a crash with none working out of the box recovery. You can choose if you would like to recover all the tabs or just some of them.

Primary it’s coded for Google Chrome (tested there), but it should work with every other Chromium based Browser too. Firefox is not supported for the moment, but will be in future. Safari will not be supported.

### How to install

Download or clone the repo to your computer in a directory of your choice. If you’ve downloaded the zip, don’t forget to unpack it

Open Chrome (or other Chromium based one) and open chrome://extensions

Activate Developer Mode (if not already done)

Click on „Load upacked“ to choose the folder with the extension files.

Done! The extension should create a snapshot every 5 minutes. With a click on the icon in the extension bar you’ll see and have the possibility to recover them.