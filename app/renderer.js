//引入marked，用来把markdown转换为html
const {
    marked
} = require('marked');

const {
    ipcRenderer,
    remote
} = require('electron')

const path = require('path');
//追踪当前打开的文件
let filepath = null;
//追踪当前打开的文件内容
let originContent = '';
//获取DOM元素
const markdownView = document.querySelector('#markdown');
const htmlView = document.querySelector('#html');
const newFileButton = document.querySelector('#new-file');
const openFileButton = document.querySelector('#open-file');
const saveFileButton = document.querySelector('#save-file');


//监听markdown的变化
markdownView.addEventListener('keyup', () => {
    rendererMarkdownToHTML(markdownView.value);
});
//新文件
newFileButton.addEventListener('click', async () => {
    const result = await ipcRenderer.invoke('new-file');
});
//打开文件
openFileButton.addEventListener('click', async () => {
    const result = await ipcRenderer.invoke('open-file');
    if (result) {
        markdownView.value = result.content;
        rendererMarkdownToHTML(result.content);
        // 你可以把 result.file 存起来，后续保存用
        filepath = result.file;
        originContent = result.content;
        updateUserInterface();
    }
});
const rendererMarkdownToHTML = (markdown) => {
    htmlView.innerHTML = marked.parse(markdown);
}
const updateUserInterface = async () => {
    if (filepath) {
        const title = `${path.basename(filepath)}-FireSale`;
        await ipcRenderer.invoke('set-title', title);
    }

}