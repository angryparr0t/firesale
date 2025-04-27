const {
    app,
    BrowserWindow,
    dialog,
    ipcMain
} = require("electron");
const fs = require("fs");


let mainWindow = null;

app.on("ready", () => {
    mainWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegration: true, // 启用 Node.js 集成
            contextIsolation: false, // 禁用上下文隔离（否则仍无法访问）
        },
    });

    mainWindow.loadFile("app/index.html");

    // show the window when ready
    mainWindow.once("ready-to-show", () => {
        mainWindow.show();
    });

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
});

const getFileFromUser = async () => {
    const {
        canceled,
        filePaths
    } = await dialog.showOpenDialog(mainWindow, {
        properties: ["openFile"],
        filters: [{
                name: "Markdown",
                extensions: ["md", "markdown"],
            },
            {
                name: "Text",
                extensions: ["txt"],
            },
        ],
    });
    if (canceled || filePaths.length === 0) {
        return;
    }
    const file = filePaths[0];
    return file;
};


// 打开文件
ipcMain.handle('open-file', async (event) => {
    // ...你的 getFileFromUser 逻辑...
    const file = await getFileFromUser();
    const content = fs.readFileSync(file).toString();
    // 返回内容
    return {
        file,
        content
    }
});


module.exports = {
    getFileFromUser
}