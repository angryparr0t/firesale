//引入marked
const {
    marked
} = require('marked');

const {
    ipcRenderer
} = require('electron')
//获取DOM元素
const markdownView = document.querySelector('#markdown');
const htmlView = document.querySelector('#html');
const openFileButton = document.querySelector('#open-file');
const saveFileButton = document.querySelector('#save-file');

const rendererMarkdownToHTML = (markdown) => {
    htmlView.innerHTML = marked.parse(markdown);
}
//监听markdown的变化
markdownView.addEventListener('keyup', () => {
    rendererMarkdownToHTML(markdownView.value);
});

openFileButton.addEventListener('click', async () => {
    const result = await ipcRenderer.invoke('open-file');
    if (result) {
        markdownView.value = result.content;
        rendererMarkdownToHTML(result.content);
        // 你可以把 result.file 存起来，后续保存用
        window.currentFile = result.file;
    }
});