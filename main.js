const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
    let win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: { nodeIntegration: true }
    });

    if (isDev) {
        win.loadURL('http://localhost:3000'); // Открывает React Dev Server
    } else {
        win.loadURL(`file://${path.join(__dirname, 'build', 'index.html')}`); // Загружает сборку React
    }
}

app.whenReady().then(createWindow);
