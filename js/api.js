// API配置
const API_CONFIG = {
    baseUrl: 'https://hxf8rythx2.coze.site/stream_run',
    // 请将此处的YOUR_API_TOKEN替换为你的实际API Token
    apiToken: '<YOUR_API_TOKEN>',
    projectId: '7612909369184960562'
};

// API状态
let currentSessionId = null;

/**
 * 发送消息到API
 * @param {string} message - 用户消息
 * @param {function} onMessage - 接收到消息时的回调
 * @param {function} onComplete - 完成时的回调
 * @param {function} onError - 错误时的回调
 */
async function sendMessageToAPI(message, onMessage, onComplete, onError) {
    try {
        // 生成或使用现有session ID
        if (!currentSessionId) {
            currentSessionId = generateSessionId();
        }

        const response = await fetch(API_CONFIG.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_CONFIG.apiToken}`
            },
            body: JSON.stringify({
                text: message,
                session_id: currentSessionId,
                project_id: API_CONFIG.projectId
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') {
                        if (onComplete) onComplete(fullResponse);
                        return;
                    }

                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.content) {
                            fullResponse += parsed.content;
                            if (onMessage) onMessage(parsed.content);
                        }
                    } catch (e) {
                        console.error('Error parsing JSON:', e);
                    }
                }
            }
        }

        if (onComplete) onComplete(fullResponse);
    } catch (error) {
        console.error('API Error:', error);
        if (onError) onError(error);
    }
}

/**
 * 生成session ID
 */
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * 重置session
 */
function resetSession() {
    currentSessionId = null;
}

/**
 * 设置API Token
 * @param {string} token - API Token
 */
function setApiToken(token) {
    API_CONFIG.apiToken = token;
    localStorage.setItem('api_token', token);
}

/**
 * 获取API Token
 */
function getApiToken() {
    return localStorage.getItem('api_token') || API_CONFIG.apiToken;
}

// 页面加载时从localStorage获取token
window.addEventListener('load', () => {
    const savedToken = localStorage.getItem('api_token');
    if (savedToken) {
        API_CONFIG.apiToken = savedToken;
    }
});
