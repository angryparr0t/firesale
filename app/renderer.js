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
const revertFileButton = document.querySelector('#revert-file');
const saveHtmlButton = document.querySelector('#save-html');

//监听markdown的变化
markdownView.addEventListener('keyup', () => {
    const currentContent = markdownView.value;
    rendererMarkdownToHTML(markdownView.value);
    updateUserInterface(currentContent !== originContent);
});

//新文件
newFileButton.addEventListener('click', async () => {
    const result = await window.electronAPI.newFile();
});

//打开文件
openFileButton.addEventListener('click', async () => {
    const isEdit = false;
    const result = await window.electronAPI.openFile();
    if (result) {
        markdownView.value = result.content;
        rendererMarkdownToHTML(result.content);
        filepath = result.file;
        originContent = result.content;
        updateUserInterface(isEdit);
    }
});
//重置文件内容
revertFileButton.addEventListener('click', () => {
    markdownView.value = originContent;
    rendererMarkdownToHTML(originContent);
    updateUserInterface(false);
});

// 监听文件打开事件
window.electronAPI.on('file-opened', (event, data) => {
    markdownView.value = data.content;
    rendererMarkdownToHTML(data.content);
    filepath = data.file;
    originContent = data.content;
    updateUserInterface(false);
});

//保存HTML
saveHtmlButton.addEventListener('click', () => {
    window.electronAPI.saveHtml(htmlView.innerHTML);
});
//保存markdown
saveFileButton.addEventListener('click', () => {
    window.electronAPI.saveMarkdown(markdownView.value);
});
//渲染markdown到HTML
const rendererMarkdownToHTML = (markdown) => {
    htmlView.innerHTML = window.electronAPI.parseMarkdown(markdown);
};

const updateUserInterface = async (isEdit) => {
    if (filepath) {
        await window.electronAPI.setTitle(filepath, isEdit);
        saveFileButton.disabled = !isEdit;
        revertFileButton.disabled = !isEdit;
    }
};