const {
    app,
    BrowserWindow,
    dialog,
    ipcMain
} = require("electron");
const fs = require("fs");

const window = new Set()

app.on("ready", () => {
    createWindow()
})

// 打开文件
const getFileFromUser = async (targetWindow) => {
    const {
        canceled,
        filePaths
    } = await dialog.showOpenDialog(targetWindow, {
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

const createWindow = () => {
    let x, y;
    const currentWindow = BrowserWindow.getAllWindows()[0];
    if (currentWindow) {
        //position=[x,y] currentWindow.getPosition()返回的是一个数组
        const position = currentWindow.getPosition();
        x = position[0] + 30;
        y = position[1] + 30;
    }

    const win = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
            nodeIntegration: true, // 启用 Node.js 集成
            contextIsolation: false, // 禁用上下文隔离（否则仍无法访问）
        },
    });

    win.loadFile("app/index.html");

    // 确保在窗口显示前设置好位置
    win.once('ready-to-show', () => {
        if (x && y) {
            win.setPosition(x, y);
        }
        win.show();
    });

    win.on("closed", () => {
        window.delete(win);
    });

    window.add(win);
    return win;
}


// 打开文件
ipcMain.handle('open-file', async (event) => {
    // ...你的 getFileFromUser 逻辑...
    console.log(event)
    const file = await getFileFromUser(event.sender);
    if (!file) return null;
    const content = fs.readFileSync(file).toString();
    return {
        file,
        content
    }
});
//新文件
ipcMain.handle('new-file', async (event) => {
    createWindow()
})

module.exports = {
    getFileFromUser,
    createWindow
}