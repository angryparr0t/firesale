// 使用预加载的 marked
// const {
//     marked
// } = window.electronAPI;

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
    const result = await window.electronAPI.newFile();
});
//打开文件
openFileButton.addEventListener('click', async () => {
    const result = await window.electronAPI.openFile();
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
    htmlView.innerHTML = window.electronAPI.parseMarkdown(markdown);
}
const updateUserInterface = async () => {
    if (filepath) {
        await window.electronAPI.setTitle();
    }

}