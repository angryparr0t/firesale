const {
    contextBridge,
    ipcRenderer
} = require("electron/renderer");

// 创建一个安全的 marked 函数
const marked = require("marked");

contextBridge.exposeInMainWorld("electronAPI", {
    openFile: () => ipcRenderer.invoke("open-file"),
    newFile: () => ipcRenderer.invoke("new-file"),
    setTitle: () => ipcRenderer.invoke("set-title"),
    parseMarkdown: (markdown) => marked.parse(markdown)
});