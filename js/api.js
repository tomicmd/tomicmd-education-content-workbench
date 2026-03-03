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
        // 检查API Token
        const apiToken = getApiToken();
        if (!apiToken || apiToken === '<YOUR_API_TOKEN>') {
            const error = new Error('未配置API Token，请先访问 config.html 进行配置');
            error.needConfig = true;
            throw error;
        }

        // 生成或使用现有session ID
        if (!currentSessionId) {
            currentSessionId = generateSessionId();
        }

        const response = await fetch(API_CONFIG.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiToken}`
            },
            body: JSON.stringify({
                type: 'query',
                session_id: currentSessionId,
                project_id: API_CONFIG.projectId,
                content: {
                    query: {
                        prompt: [
                            {
                                type: 'text',
                                content: {
                                    text: message
                                }
                            }
                        ]
                    }
                }
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

                        // 支持 Coze 流式响应格式
                        // 格式1: { "data": { "type": "answer", "content": { "text": "..." } } }
                        // 格式2: { "event": "message", "data": { "type": "answer", "content": "..." } }
                        // 格式3: { "content": "..." }

                        let content = '';

                        if (parsed.data && parsed.data.type === 'answer') {
                            // Coze 格式: data.type === 'answer'
                            if (parsed.data.content) {
                                if (typeof parsed.data.content === 'string') {
                                    content = parsed.data.content;
                                } else if (parsed.data.content.text) {
                                    content = parsed.data.content.text;
                                }
                            }
                        } else if (parsed.content) {
                            // 通用格式
                            if (typeof parsed.content === 'string') {
                                content = parsed.content;
                            } else if (parsed.content.text) {
                                content = parsed.content.text;
                            }
                        }

                        if (content) {
                            fullResponse += content;
                            if (onMessage) onMessage(content);
                        }
                    } catch (e) {
                        console.error('Error parsing JSON:', e);
                        console.error('Raw data:', data);
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
