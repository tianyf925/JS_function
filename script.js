// 1. 抓取 HTML 元素
// const 意思是“常量”，表示这个变量以后不会被重新赋值（比如按钮永远是那个按钮）
// const：这是 ES6（新版 JS）的写法。以前用 var，现在尽量别用了。const 代表这个引用是固定的。
const taskInput = document.getElementById('task-input'); // 输入框
const addBtn = document.getElementById('add-btn');     // 添加按钮
const taskList = document.getElementById('task-list'); // 列表容器

// 2. 定义添加任务的函数
function addTask() {
    // 2.1 获取输入框里的文字
    const taskText = taskInput.value; 

    // 2.2 简单的验证：如果是空的，什么都不做，直接结束
    if (taskText === '') {
        alert("写点东西再添加嘛！");
        return; 
    }

    // 2.3 创建一个新的 li 元素 (原本我们在 HTML 里写的那个 li 只是例子)
    const li = document.createElement('li');
    
    // 2.4 给它加上 class，让它拥有 CSS 里的样式
    li.className = 'task-item';

    // 2.5 【核心】往 li 里面塞内容
    // 这里的 `` (反引号，在键盘 Esc 下面) 是模板字符串，允许我们在里面直接写 HTML 和变量
    li.innerHTML = `
        <span>${taskText}</span>
        <button class="delete-btn">删除</button>
    `;

    // 2.6 把这个新做好的 li 放到 ul 列表里去
    taskList.appendChild(li);

    // 2.7 添加完了，把输入框清空，方便下次输入
    taskInput.value = '';
}

// 3. 给按钮添加点击事件监听
// 意思是：当 'addBtn' 被 'click' (点击) 时，执行 'addTask' 这个函数
addBtn.addEventListener('click', addTask);