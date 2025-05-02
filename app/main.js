const {
    app,
    BrowserWindow,
    dialog,
    ipcMain
} = require("electron");
const fs = require("fs");
const path = require("path");

const window = new Set();
let filepath = null; // 添加全局变量来存储当前文件路径

app.on("ready", () => {
    createWindow();
});

app.on("window-all-closed", () => {
    // 如果是macos，则不关闭
    if (process.platform === "darwin") {
        return false;
    }
    //如果不是退出应用
    app.quit();
});

app.on("activate", (event, hasVisibleWindows) => {
    // 如果是macos没有可视窗口，就创建一个
    if (!hasVisibleWindows) {
        createWindow();
    }
});

app.on('will-finish-launching', () => {
    app.on('open-file', async (event, file) => {
        const win = createWindow();
        win.once('ready-to-show', () => {
            win.setRepresentedFilename(file);
            filepath = file; // 保存文件路径
            const content = fs.readFileSync(file).toString();

            // 通过 IPC 通信将数据发送给渲染进程
            win.webContents.on('did-finish-load', () => {
                win.webContents.send('file-opened', {
                    file,
                    content
                });
            });

            win.show();
        });
    });
});
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
            preload: path.join(__dirname, 'preload.js'),
            sandbox: false,
        },
    });

    win.loadFile(path.join(__dirname, 'index.html'));

    // 确保在窗口显示前设置好位置
    win.once("ready-to-show", () => {
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
};

// 打开文件
ipcMain.handle("open-file", async (event) => {
    const file = await getFileFromUser(event.sender);
    if (!file) return null;
    const currentWindow = BrowserWindow.fromWebContents(event.sender);
    if (process.platform === 'darwin') {
        currentWindow.setRepresentedFilename(file);
    }
    filepath = file; // 保存文件路径
    const content = fs.readFileSync(file).toString();
    return {
        file,
        content,
    };
});
//新文件
ipcMain.handle("new-file", async (event) => {
    createWindow();
});
//设置标题
ipcMain.handle("set-title", (event, filepath, isEdit) => {
    let title;
    if (isEdit) {
        title = filepath ? `${path.basename(filepath)}-FireSale(Edited)` : 'FireSale(Edited)';
    } else {
        title = filepath ? `${path.basename(filepath)}-FireSale` : 'FireSale';
    }
    const currentWindow = BrowserWindow.fromWebContents(event.sender);
    currentWindow.setTitle(title);
});
//保存HTML
ipcMain.handle("save-html", async (event, html) => {
    const currentWindow = BrowserWindow.fromWebContents(event.sender);
    const {
        filePath
    } = await dialog.showSaveDialog(currentWindow, {
        title: "保存HTML文件",
        defaultPath: app.getPath('documents'),
        filters: [{
            name: "HTML",
            extensions: ["html"]
        }]
    });
    if (!filePath) return null;
    fs.writeFileSync(filePath, html);
});
//保存markdown
ipcMain.handle("save-markdown", async (event, markdown) => {
    const currentWindow = BrowserWindow.fromWebContents(event.sender);
    const {
        filePath
    } = await dialog.showSaveDialog(currentWindow, {
        title: "保存Markdown文件",
        defaultPath: app.getPath('documents'),
        filters: [{
            name: "Markdown",
            extensions: ["md", "markdown"]
        }]
    })
    if (!filePath) return null;
    fs.writeFileSync(filePath, markdown);
});

module.exports = {
    getFileFromUser,
    createWindow,
};