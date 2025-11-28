// 1. 获取 DOM 元素
const taskInput = document.getElementById('task-input');
const prioritySelect = document.getElementById('priority-select');
const searchInput = document.getElementById('search-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const taskCountSpan = document.getElementById('task-count');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

// 2. 初始化数据
// 我们的数据结构升级了：包含 id, text, priority, completed, date
let tasks = JSON.parse(localStorage.getItem('bizTasks')) || [];
let currentFilter = 'all'; // 当前选中的筛选模式

// 初始化运行
renderTasks();

// 3. 渲染函数 (逻辑最复杂的部分)
function renderTasks() {
    taskList.innerHTML = '';
    
    // 第一步：根据搜索框过滤
    const searchText = searchInput.value.toLowerCase();
    
    // 第二步：根据 Tab 标签过滤 (全部/待办/已完成)
    const filteredTasks = tasks.filter(task => {
        // 搜索匹配
        const matchesSearch = task.text.toLowerCase().includes(searchText);
        // 状态匹配
        let matchesFilter = true;
        if (currentFilter === 'active') matchesFilter = !task.completed;
        if (currentFilter === 'completed') matchesFilter = task.completed;
        
        return matchesSearch && matchesFilter;
    });

    // 第三步：生成 HTML
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        // 翻译优先级文本
        const priorityMap = {
            'high': '紧急',
            'medium': '重要',
            'low': '普通'
        };

        li.innerHTML = `
            <div class="task-left">
                <input type="checkbox" 
                       ${task.completed ? 'checked' : ''} 
                       onchange="toggleTask(${task.id})">
                
                <div class="task-text-col">
                    <span class="task-text">
                        <span class="priority-tag p-${task.priority}">${priorityMap[task.priority]}</span>
                        ${task.text}
                    </span>
                    <span class="task-time">创建于: ${task.date}</span>
                </div>
            </div>
            
            <button class="delete-btn" onclick="deleteTask(${task.id})">×</button>
        `;
        taskList.appendChild(li);
    });

    // 更新数量统计
    taskCountSpan.innerText = filteredTasks.length;
}

// 4. 添加任务
function addTask() {
    const text = taskInput.value.trim();
    if (!text) return alert("任务内容不能为空！");

    const newTask = {
        id: Date.now(), // 用时间戳做唯一的 ID
        text: text,
        priority: prioritySelect.value, // 获取选中的优先级
        completed: false,
        date: new Date().toLocaleString() // 生成当前时间字符串
    };

    tasks.unshift(newTask); // 加到最前面
    saveData();
    renderTasks();
    taskInput.value = ''; // 清空输入框
}

// 5. 切换完成状态
window.toggleTask = function(id) {
    // 找到对应 ID 的任务
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveData();
        renderTasks();
    }
}

// 6. 删除任务
window.deleteTask = function(id) {
    if(confirm('确定删除这条任务吗？')) {
        tasks = tasks.filter(t => t.id !== id);
        saveData();
        renderTasks();
    }
}

// 7. 清理所有已完成
clearCompletedBtn.addEventListener('click', () => {
    if(confirm('确定要清空所有已完成的任务吗？')) {
        tasks = tasks.filter(t => !t.completed); // 只保留未完成的
        saveData();
        renderTasks();
    }
});

// 8. 筛选按钮点击事件
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // 移除所有按钮的 active 样式
        filterBtns.forEach(b => b.classList.remove('active'));
        // 给当前点击的按钮加 active
        btn.classList.add('active');
        
        // 更新当前过滤模式
        currentFilter = btn.getAttribute('data-filter');
        renderTasks();
    });
});

// 9. 搜索框监听 (实时搜索)
searchInput.addEventListener('input', () => {
    renderTasks();
});

// 10. 数据保存
function saveData() {
    localStorage.setItem('bizTasks', JSON.stringify(tasks));
}

// 按钮监听
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask();
});