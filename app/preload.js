const {
    contextBridge,
    ipcRenderer
} = require("electron/renderer");

// 创建一个安全的 marked 函数
const marked = require("marked");

contextBridge.exposeInMainWorld("electronAPI", {
    openFile: () => ipcRenderer.invoke("open-file"),
    newFile: () => ipcRenderer.invoke("new-file"),
    setTitle: (filepath, isEdit) => ipcRenderer.invoke("set-title", filepath, isEdit),
    parseMarkdown: (markdown) => marked.parse(markdown)
});