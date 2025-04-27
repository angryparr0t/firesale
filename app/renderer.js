//引入marked
const {
    marked
} = require('marked');

//获取DOM元素
const markdownView = document.querySelector('#markdown');
const htmlView = document.querySelector('#html');

const rendererMarkdownToHTML = (markdown) => {
    htmlView.innerHTML = marked(markdown, {
        sanitize: true
    });
}
//监听markdown的变化
markdownView.addEventListener('keyup', () => {
    rendererMarkdownToHTML(markdownView.value);
});