// 全局状态
let chatHistory = [];
let selectedTopic = null;
let currentOutline = null;
let generatedArticles = [];

/**
 * 初始化应用
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeChat();
    loadFromLocalStorage();
});

/**
 * 初始化导航
 */
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            // 移除所有active类
            navItems.forEach(nav => nav.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));

            // 添加active类到当前项
            item.classList.add('active');
            const tabId = item.getAttribute('data-tab') + '-tab';
            document.getElementById(tabId).classList.add('active');
        });
    });
}

/**
 * 初始化聊天功能
 */
function initializeChat() {
    const userInput = document.getElementById('userInput');

    // 支持Enter键发送
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
}

/**
 * 发送消息
 */
async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();

    if (!message) return;

    // 清空输入框
    userInput.value = '';

    // 添加用户消息到聊天历史
    addMessageToChat(message, 'user');

    // 显示加载遮罩
    showLoading();

    // 创建AI消息容器
    const aiMessageDiv = createMessageContainer('ai');
    const contentDiv = aiMessageDiv.querySelector('.message-content');
    document.getElementById('chatMessages').appendChild(aiMessageDiv);

    // 滚动到底部
    scrollToBottom();

    try {
        await sendMessageToAPI(
            message,
            (chunk) => {
                // 流式更新消息
                contentDiv.innerHTML += formatMessage(chunk);
                scrollToBottom();
            },
            (fullResponse) => {
                // 完成后
                hideLoading();
                chatHistory.push({ role: 'user', content: message });
                chatHistory.push({ role: 'ai', content: fullResponse });
                saveToLocalStorage();
            },
            (error) => {
                hideLoading();
                contentDiv.innerHTML = `<p style="color: var(--danger-color);">错误: ${error.message}</p>`;
            }
        );
    } catch (error) {
        hideLoading();
        contentDiv.innerHTML = `<p style="color: var(--danger-color);">错误: ${error.message}</p>`;
    }
}

/**
 * 添加消息到聊天
 */
function addMessageToChat(message, type) {
    const messageDiv = createMessageContainer(type);
    const contentDiv = messageDiv.querySelector('.message-content');
    contentDiv.innerHTML = formatMessage(message);
    document.getElementById('chatMessages').appendChild(messageDiv);
    scrollToBottom();
}

/**
 * 创建消息容器
 */
function createMessageContainer(type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = `<i class="fas fa-${type === 'user' ? 'user' : 'robot'}"></i>`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);

    return messageDiv;
}

/**
 * 格式化消息
 */
function formatMessage(message) {
    // 简单的Markdown格式化
    let formatted = message
        // 代码块
        .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
        // 行内代码
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // 粗体
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        // 斜体
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        // 链接
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
        // 换行
        .replace(/\n/g, '<br>');

    return formatted;
}

/**
 * 滚动到底部
 */
function scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * 快捷操作
 */
function quickAction(action) {
    const userInput = document.getElementById('userInput');
    userInput.value = action;
    sendMessage();
}

/**
 * 清空对话
 */
function clearChat() {
    if (confirm('确定要清空所有对话吗？')) {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = '';
        chatHistory = [];
        resetSession();
        localStorage.removeItem('chatHistory');

        // 添加欢迎消息
        addMessageToChat('对话已清空。请告诉我你需要什么帮助？', 'ai');
    }
}

/**
 * 导出对话
 */
function exportChat() {
    if (chatHistory.length === 0) {
        alert('没有可导出的对话记录');
        return;
    }

    let content = '对话记录\n' + '='.repeat(50) + '\n\n';
    chatHistory.forEach((msg, index) => {
        content += `${msg.role === 'user' ? '用户' : 'AI'}: ${msg.content}\n\n`;
    });

    downloadFile(content, 'chat_history.txt', 'text/plain');
}

/**
 * 生成选题
 */
async function generateTopics() {
    const region = prompt('请输入区域（闵行/浦东/徐汇）：', '浦东');
    if (!region) return;

    const count = prompt('请输入选题数量（1-10）：', '5');
    if (!count) return;

    showLoading();

    try {
        await sendMessageToAPI(
            `为${region}区生成${count}个择校内容选题，要求包含真实案例、学区房、学校对比等类型，每个选题要标注流量潜力评级（S/A/B/C级）`,
            (chunk) => {},
            (response) => {
                hideLoading();
                parseAndDisplayTopics(response);
            },
            (error) => {
                hideLoading();
                alert('生成选题失败: ' + error.message);
            }
        );
    } catch (error) {
        hideLoading();
        alert('生成选题失败: ' + error.message);
    }
}

/**
 * 解析并显示选题
 */
function parseAndDisplayTopics(response) {
    const topicsGrid = document.getElementById('topicsGrid');
    topicsGrid.innerHTML = '';

    // 这里简化处理，实际需要解析AI返回的格式化选题
    // 示例数据
    const sampleTopics = [
        {
            type: 'case',
            typeName: '真实案例',
            title: '从公办到民办再回公办：浦东一位家长3次择校的真实思考',
            target: '焦虑型家长（需要明确的择校路径指导）',
            value: '5个避坑案例总结+往届建平实验小学家长真实访谈',
            traffic: 'S',
            trafficDesc: '爆款潜力（10万+阅读）- 热点话题+强烈情感共鸣'
        },
        {
            type: 'house',
            typeName: '学区房',
            title: '浦东400万以内学区房选购指南：建平实验小学对口小区全解析',
            target: '35-40岁高净值家庭（重视名校与资源圈层）',
            value: '教育专家深度解析+2024最新政策解读',
            traffic: 'B',
            trafficDesc: '稳定流量（1万+阅读）- 深度分析+专业数据'
        }
    ];

    sampleTopics.forEach((topic, index) => {
        const card = createTopicCard(topic, index);
        topicsGrid.appendChild(card);
    });
}

/**
 * 创建选题卡片
 */
function createTopicCard(topic, index) {
    const card = document.createElement('div');
    card.className = 'topic-card';
    card.dataset.index = index;

    card.innerHTML = `
        <div class="topic-card-header">
            <span class="topic-type ${topic.type}">${topic.typeName}</span>
            <span class="traffic-level ${topic.traffic}">${topic.traffic}级</span>
        </div>
        <h3 class="topic-title">${topic.title}</h3>
        <div class="topic-meta">
            <span><i class="fas fa-users"></i> ${topic.target}</span>
        </div>
        <div class="topic-value">
            <i class="fas fa-star"></i> ${topic.value}
        </div>
        <div class="topic-meta">
            <span><i class="fas fa-chart-line"></i> ${topic.trafficDesc}</span>
        </div>
        <div class="topic-actions">
            <button class="btn btn-primary" onclick="selectTopic(${index})">
                <i class="fas fa-check"></i> 选择
            </button>
            <button class="btn btn-secondary" onclick="createOutlineForTopic(${index})">
                <i class="fas fa-list-ol"></i> 创建提纲
            </button>
        </div>
    `;

    card.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
            selectTopic(index);
        }
    });

    return card;
}

/**
 * 选择选题
 */
function selectTopic(index) {
    const cards = document.querySelectorAll('.topic-card');
    cards.forEach(card => card.classList.remove('selected'));
    cards[index].classList.add('selected');
    selectedTopic = index;
}

/**
 * 为选题创建提纲
 */
async function createOutlineForTopic(index) {
    showLoading();

    try {
        await sendMessageToAPI(
            '为这个选题创建详细的结构化提纲，使用真实案例模板',
            (chunk) => {},
            (response) => {
                hideLoading();
                displayOutline(response);
            },
            (error) => {
                hideLoading();
                alert('创建提纲失败: ' + error.message);
            }
        );
    } catch (error) {
        hideLoading();
        alert('创建提纲失败: ' + error.message);
    }
}

/**
 * 显示提纲
 */
function displayOutline(outline) {
    const outlineEditor = document.getElementById('outlineEditor');
    currentOutline = outline;

    outlineEditor.innerHTML = `
        <div class="outline-content">
            <h3><i class="fas fa-list-ol"></i> 结构化提纲</h3>
            ${formatMessage(outline)}
        </div>
    `;
}

/**
 * 创建新提纲
 */
function createOutline() {
    if (selectedTopic === null) {
        alert('请先选择一个选题');
        return;
    }

    createOutlineForTopic(selectedTopic);
}

/**
 * 导出提纲
 */
function exportOutline() {
    if (!currentOutline) {
        alert('没有可导出的提纲');
        return;
    }

    downloadFile(currentOutline, 'outline.txt', 'text/plain');
}

/**
 * 生成文章
 */
async function generateArticle() {
    showLoading();

    try {
        await sendMessageToAPI(
            '基于当前的提纲，帮我生成一篇完整的文章，要求内容详实、数据准确、语言流畅',
            (chunk) => {},
            (response) => {
                hideLoading();
                displayArticle(response);
            },
            (error) => {
                hideLoading();
                alert('生成文章失败: ' + error.message);
            }
        );
    } catch (error) {
        hideLoading();
        alert('生成文章失败: ' + error.message);
    }
}

/**
 * 显示文章
 */
function displayArticle(article) {
    const articleList = document.getElementById('articleList');
    const articleItem = document.createElement('div');
    articleItem.className = 'article-item';

    const now = new Date();
    const dateStr = now.toLocaleString('zh-CN');

    articleItem.innerHTML = `
        <div class="article-header">
            <h3 class="article-title">文章 ${generatedArticles.length + 1}</h3>
            <span class="article-date">${dateStr}</span>
        </div>
        <div class="article-meta">字数: ${article.length}</div>
        <div class="article-preview">${article.substring(0, 200)}...</div>
        <div class="article-actions">
            <button class="btn btn-primary" onclick="viewArticle(${generatedArticles.length})">
                <i class="fas fa-eye"></i> 查看
            </button>
            <button class="btn btn-success" onclick="downloadSingleArticle(${generatedArticles.length})">
                <i class="fas fa-download"></i> 下载
            </button>
        </div>
    `;

    articleList.insertBefore(articleItem, articleList.firstChild);
    generatedArticles.push({ content: article, date: dateStr });
}

/**
 * 查看文章
 */
function viewArticle(index) {
    const article = generatedArticles[index];
    // 在新窗口中打开文章预览
    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>文章预览</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    max-width: 800px;
                    margin: 40px auto;
                    padding: 20px;
                    line-height: 1.6;
                }
            </style>
        </head>
        <body>
            ${formatMessage(article.content)}
        </body>
        </html>
    `);
}

/**
 * 下载单篇文章
 */
function downloadSingleArticle(index) {
    const article = generatedArticles[index];
    downloadFile(article.content, `article_${index + 1}.txt`, 'text/plain');
}

/**
 * 导出文章
 */
function exportArticle() {
    if (generatedArticles.length === 0) {
        alert('没有可导出的文章');
        return;
    }

    generatedArticles.forEach((article, index) => {
        downloadFile(article.content, `article_${index + 1}.txt`, 'text/plain');
    });
}

/**
 * 显示历史记录
 */
function displayHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';

    // 从localStorage加载历史记录
    const savedHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');

    savedHistory.forEach((item, index) => {
        if (item.role === 'user') {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';

            const now = new Date(item.timestamp || Date.now());
            const dateStr = now.toLocaleString('zh-CN');

            historyItem.innerHTML = `
                <div class="history-item-header">
                    <span class="history-item-title">${item.content.substring(0, 50)}...</span>
                    <span class="history-item-date">${dateStr}</span>
                </div>
                <div class="history-item-preview">${item.content}</div>
            `;

            historyItem.addEventListener('click', () => {
                // 恢复历史记录
                addMessageToChat(item.content, 'user');
            });

            historyList.appendChild(historyItem);
        }
    });
}

/**
 * 清空历史
 */
function clearHistory() {
    if (confirm('确定要清空所有历史记录吗？')) {
        localStorage.removeItem('chatHistory');
        localStorage.removeItem('topics');
        localStorage.removeItem('articles');
        displayHistory();
        alert('历史记录已清空');
    }
}

/**
 * 导出历史
 */
function exportHistory() {
    const savedHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');

    if (savedHistory.length === 0) {
        alert('没有可导出的历史记录');
        return;
    }

    let content = '历史记录\n' + '='.repeat(50) + '\n\n';
    savedHistory.forEach((item, index) => {
        const date = new Date(item.timestamp || Date.now()).toLocaleString('zh-CN');
        content += `[${date}] ${item.role === 'user' ? '用户' : 'AI'}: ${item.content}\n\n`;
    });

    downloadFile(content, 'history.txt', 'text/plain');
}

/**
 * 显示加载遮罩
 */
function showLoading() {
    document.getElementById('loadingOverlay').classList.add('active');
}

/**
 * 隐藏加载遮罩
 */
function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

/**
 * 下载文件
 */
function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type: type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * 保存到localStorage
 */
function saveToLocalStorage() {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

/**
 * 从localStorage加载
 */
function loadFromLocalStorage() {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
        chatHistory = JSON.parse(savedHistory);

        // 恢复聊天记录
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = '';

        chatHistory.forEach(msg => {
            addMessageToChat(msg.content, msg.role);
        });
    }

    displayHistory();
}

/**
 * 关闭模态框
 */
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// 页面加载时显示历史记录
window.addEventListener('load', displayHistory);
