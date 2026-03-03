# 教育内容策略优化工作台 - 使用指南

## 📋 目录

1. [功能介绍](#功能介绍)
2. [快速开始](#快速开始)
3. [详细使用说明](#详细使用说明)
4. [API配置](#api配置)
5. [部署方式](#部署方式)

---

## ✨ 功能介绍

### 核心功能

#### 1. **对话创作** 💬
- 与AI助手实时对话
- 快捷操作按钮
- 对话历史记录
- 导出对话功能

#### 2. **选题管理** 💡
- 自动生成选题
- 选题卡片展示
- 选题筛选与选择
- 流量潜力评级（S/A/B/C级）

#### 3. **提纲编辑** 📋
- 可视化提纲编辑
- 多种提纲模板
- 导出提纲功能

#### 4. **文章管理** 📝
- 一键生成文章
- 文章预览
- 批量导出
- 文章历史记录

#### 5. **历史记录** 📚
- 查看所有历史操作
- 恢复历史记录
- 导出历史数据

---

## 🚀 快速开始

### 第1步：获取API Token

1. 访问你的部署页面
2. 点击「API Token」按钮
3. 复制生成的API Token

### 第2步：配置API Token

打开 `web/js/api.js` 文件，找到第5行：

```javascript
apiToken: '<YOUR_API_TOKEN>',
```

将 `<YOUR_API_TOKEN>` 替换为你实际的API Token：

```javascript
apiToken: 'your_actual_api_token_here',
```

### 第3步：打开工作台

直接用浏览器打开 `web/index.html` 文件即可！

**注意**：由于浏览器的CORS限制，建议使用本地服务器：

```bash
# 使用Python启动本地服务器
cd web
python -m http.server 8000

# 访问
http://localhost:8000
```

---

## 📖 详细使用说明

### 对话创作

#### 方式1：自由对话

1. 在输入框中输入你的需求
2. 点击发送按钮或按Enter键
3. AI助手会实时响应

#### 方式2：快捷操作

点击下方的快捷按钮：
- 📝 **生成选题**：快速生成择校选题
- 📋 **创建提纲**：为选题创建提纲
- 🔍 **查找资源**：查找权威参考资源
- ✍️ **生成文章**：生成完整文章

#### 常用对话示例

```
为浦东区生成5个择校选题
选择选题1并创建提纲
为这个选题查找参考资源
基于提纲生成完整文章
```

### 选题管理

#### 生成选题

1. 点击「选题管理」标签页
2. 点击「生成新选题」按钮
3. 输入区域（闵行/浦东/徐汇）
4. 输入选题数量（1-10）
5. 等待AI生成

#### 选择选题

- 点击选题卡片选择
- 选中的选题会高亮显示
- 点击「选择」按钮确认

#### 选题类型说明

| 类型 | 图标 | 说明 |
|------|------|------|
| 真实案例 | 🔴 | S级爆款潜力，情感共鸣强 |
| 学区房 | 🟢 | B级稳定流量，数据扎实 |
| 学校对比 | 🟡 | B级专业流量，对比分析 |
| 热点话题 | 🔵 | A级高流量，时效性强 |

#### 流量潜力评级

| 等级 | 预计阅读量 | 特点 |
|------|-----------|------|
| S级 | 10万+ | 爆款潜力，热点话题+强烈情感共鸣 |
| A级 | 5万+ | 高流量，真实案例+实用价值 |
| B级 | 1万+ | 稳定流量，深度分析+专业数据 |
| C级 | 5000+ | 基础流量，常规资讯+基础信息 |

### 提纲编辑

#### 创建提纲

1. 在「选题管理」中选择一个选题
2. 点击「创建提纲」按钮
3. AI会自动生成结构化提纲
4. 在「提纲编辑」标签页中查看

#### 提纲模板

- **Standard**：通用标准模板
- **Case Study**：真实案例模板
- **School Comparison**：学校对比模板
- **Data Driven**：数据驱动模板

#### 导出提纲

点击「导出提纲」按钮，下载为TXT文件。

### 文章管理

#### 生成文章

1. 确保已创建提纲
2. 点击「文章管理」标签页
3. 点击「生成文章」按钮
4. 等待AI生成完整文章

#### 查看文章

点击「查看」按钮，在新窗口中预览文章。

#### 导出文章

- 单篇导出：点击单篇文章的「下载」按钮
- 批量导出：点击「导出文章」按钮

### 历史记录

#### 查看历史

点击「历史记录」标签页，查看所有历史操作。

#### 恢复历史

点击历史记录项，可以恢复该对话。

#### 清空历史

点击「清空历史」按钮，清空所有历史记录。

---

## ⚙️ API配置

### API Token设置

#### 方法1：直接修改文件

编辑 `web/js/api.js`：

```javascript
const API_CONFIG = {
    baseUrl: 'https://hxf8rythx2.coze.site/stream_run',
    apiToken: 'your_actual_api_token_here',  // 替换这里
    projectId: '7612909369184960562'
};
```

#### 方法2：使用配置界面

在首次使用时，会自动提示输入API Token，保存后会存储在浏览器本地。

### API调用示例

#### cURL

```bash
curl -X POST https://hxf8rythx2.coze.site/stream_run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -d '{
    "text": "你好",
    "session_id": "session_123",
    "project_id": "7612909369184960562"
  }'
```

#### Python

```python
import requests

url = "https://hxf8rythx2.coze.site/stream_run"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_TOKEN"
}

data = {
    "text": "你好",
    "session_id": "session_123",
    "project_id": "7612909369184960562"
}

response = requests.post(url, json=data, headers=headers)
print(response.json())
```

---

## 🌐 部署方式

### 方式1：本地部署

#### 使用Python HTTP服务器

```bash
cd web
python -m http.server 8000
```

访问：http://localhost:8000

#### 使用Node.js HTTP服务器

```bash
cd web
npx http-server -p 8000
```

访问：http://localhost:8000

### 方式2：部署到云服务

#### 部署到GitHub Pages

1. 将 `web` 目录推送到GitHub
2. 在GitHub仓库设置中启用GitHub Pages
3. 选择 `web` 目录作为发布源

#### 部署到Vercel

```bash
# 安装Vercel CLI
npm i -g vercel

# 部署
cd web
vercel
```

#### 部署到Netlify

```bash
# 安装Netlify CLI
npm i -g netlify-cli

# 部署
cd web
netlify deploy --prod
```

### 方式3：Docker部署

创建 `Dockerfile`：

```dockerfile
FROM nginx:alpine
COPY web /usr/share/nginx/html
EXPOSE 80
```

构建和运行：

```bash
docker build -t content-workbench .
docker run -d -p 80:80 content-workbench
```

### 方式4：集成到现有系统

将以下文件复制到你的项目中：

```
your-project/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── app.js
    ├── api.js
    └── ui.js
```

---

## 🔧 常见问题

### Q1: 为什么无法连接API？

**A:** 检查以下几点：
1. API Token是否正确配置
2. 网络连接是否正常
3. API服务是否正常运行

### Q2: 如何更换API Token？

**A:**
1. 打开浏览器开发者工具
2. 在Console中输入：
   ```javascript
   localStorage.removeItem('api_token');
   ```
3. 刷新页面，重新输入Token

### Q3: 历史记录存储在哪里？

**A:** 历史记录存储在浏览器的localStorage中，不会上传到服务器。

### Q4: 如何清空所有数据？

**A:**
1. 打开「历史记录」标签页
2. 点击「清空历史」按钮

### Q5: 支持哪些浏览器？

**A:** 支持所有现代浏览器：
- Chrome (推荐)
- Firefox
- Safari
- Edge

---

## 📞 技术支持

如有问题，请：
1. 查看本文档的常见问题部分
2. 检查浏览器控制台的错误信息
3. 联系技术支持

---

## 📝 更新日志

### v1.0.0 (2024-03-03)
- ✅ 初始版本发布
- ✅ 对话创作功能
- ✅ 选题管理功能
- ✅ 提纲编辑功能
- ✅ 文章管理功能
- ✅ 历史记录功能

---

**祝你使用愉快！** 🎉
