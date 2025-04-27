const {
    app,
    BrowserWindow
} = require('electron');

let mainWindow = null;

app.on('ready', () => {

    mainWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegration: true, // 启用 Node.js 集成
            contextIsolation: false, // 禁用上下文隔离（否则仍无法访问）

        }
    });

    mainWindow.loadFile('app/index.html');

    // show the window when ready
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});