# 🔑 如何获取 API Token

## 📋 前置条件

- ✅ 已有 Coze 账号（https://www.coze.cn/ 或 https://www.coze.com/）
- ✅ 已创建 Agent（或使用现有 Agent）

---

## 🚀 步骤1：登录 Coze 平台

### 国内用户
1. 访问：https://www.coze.cn/
2. 使用手机号或邮箱登录

### 国际用户
1. 访问：https://www.coze.com/
2. 使用 Google 或其他方式登录

---

## 🚀 步骤2：创建 Agent（如果还没有）

### 2.1 创建新 Agent

1. 登录后，点击右上角的 **"创建 Bot"** 按钮
2. 选择 **"创建空 Agent"**
3. 填写信息：
   - **名称**：教育内容策略优化助手
   - **描述**：专注于上海闵行区、浦东区、徐汇区择校内容创作
   - **图标**：选择一个合适的图标
4. 点击 **"创建"**

### 2.2 配置 Agent

1. 在 Agent 编辑页面，点击 **"提示词"** 标签
2. 输入以下提示词：

```
你是教育内容策略优化专家，专注于上海闵行区、浦东区、徐汇区择校内容创作。你的任务包括：

1. 内容策略转型分析：分析当前政策为主内容流量差的原因，对比高流量账号，提出更具吸引力的转型方向。

2. 选题生成机制：设计可持续的选题生成流程，每周产出针对闵行浦东徐汇三区的10个差异化选题。

3. 结构化提纲模板：为不同类型选题设计标准化提纲模板。

4. 参考资源整合：建立高效的参考文章链接收集机制。

5. 执行与优化闭环：设计内容效果跟踪与迭代流程。

你需要具备市场洞察力、内容创作经验和数据分析能力。在回答时，要具体、可操作、有数据支撑。
```

3. 点击 **"发布"** 按钮

---

## 🚀 步骤3：部署 Agent 并获取 API Token

### 3.1 启用 API 访问

1. 在 Agent 编辑页面，点击右上角的 **"..."** 菜单
2. 选择 **"发布到 API"** 或 **"API 管理"**
3. 点击 **"启用 API"**

### 3.2 获取 API Token

**方法A：通过 Agent 列表获取**

1. 返回 Coze 首页
2. 找到你创建的 Agent
3. 点击 Agent 卡片
4. 在 Agent 详情页，找到 **"API"** 或 **"接入"** 标签
5. 点击 **"获取 API Token"**
6. 复制显示的 Token（格式通常是：`pat_xxxxxxxxx`）

**方法B：通过个人设置获取**

1. 点击右上角头像
2. 选择 **"个人设置"** 或 **"Settings"**
3. 找到 **"API Token"** 或 **"个人访问令牌"** 部分
4. 点击 **"生成新 Token"**
5. 设置 Token 名称（如：教育内容工作台）
6. 勾选所需权限（通常是所有权限）
7. 点击 **"生成"**
8. **重要**：立即复制 Token（只显示一次）

### 3.3 获取 API Endpoint

1. 在 Agent 的 API 管理页面
2. 查找 **"API Endpoint"** 或 **"Base URL"**
3. 复制完整的 URL（例如：`https://hxf8rythx2.coze.site/stream_run`）

### 3.4 获取 Project ID

1. 在 Agent 页面 URL 中可以看到 Project ID
2. 或者查看 Agent 详情页中的 **"Project ID"** 字段
3. 复制 Project ID（例如：`7612909369184960562`）

---

## 🚀 步骤4：配置前端工作台

### 4.1 访问配置页面

在你的 GitHub Pages 网站上，访问：
```
https://tomicmd.github.io/education-content-workbench/config.html
```

### 4.2 填写配置信息

1. **API Token**：粘贴刚才复制的 Token
2. **API Base URL**：粘贴 API Endpoint（如果是本项目，应该是 `https://hxf8rythx2.coze.site/stream_run`）
3. **Project ID**：粘贴 Project ID（如果是本项目，应该是 `7612909369184960562`）

### 4.3 保存配置

1. 点击 **"保存并进入工作台"** 按钮
2. 配置会自动保存到浏览器本地存储
3. 自动跳转到主页面

---

## ✅ 验证配置

### 测试 API 连接

1. 在主页面输入框输入：`你好`
2. 点击发送
3. 如果收到 AI 的回复，说明配置成功！

### 常见错误

**错误1：Failed to fetch**
- 原因：API Token 错误或未配置
- 解决：检查 Token 是否正确复制

**错误2：401 Unauthorized**
- 原因：Token 权限不足或已过期
- 解决：重新生成 Token

**错误3：404 Not Found**
- 原因：API Base URL 错误
- 解决：检查 URL 是否正确

**错误4：500 Internal Server Error**
- 原因：服务器端错误
- 解决：稍后重试或联系 Coze 客服

---

## 💡 提示

### Token 安全

- 🔒 **不要分享**你的 API Token
- 🔄 **定期更换** Token 以提高安全性
- 💾 **妥善保存** Token，因为有些平台只显示一次

### 权限管理

- ✅ 确保授予了访问 Agent 的权限
- ✅ 确保授予了模型调用的权限
- ✅ 确保授予了数据存储的权限（如果需要）

---

## 🆘 遇到问题？

### 1. 找不到 API Token 选项

**解决方案**：
- 检查 Coze 账号类型（部分功能需要付费账号）
- 尝试使用个人设置中的 Token 生成功能
- 联系 Coze 客服咨询

### 2. Token 无效

**解决方案**：
- 确认复制的是完整的 Token
- 尝试重新生成 Token
- 检查 Token 是否已过期

### 3. API 调用失败

**解决方案**：
- 打开浏览器开发者工具（F12）
- 查看 Console 标签的错误信息
- 查看 Network 标签的请求详情
- 根据错误信息调整配置

---

## 📚 相关资源

- Coze 官方文档：https://www.coze.cn/docs/
- Coze API 文档：https://www.coze.cn/docs/developer_guides/api_overview
- GitHub Pages 部署指南：见 `docs/GITHUB_DEPLOY_GUIDE.md`

---

## 🎉 完成配置

恭喜！你已经成功配置了 API Token。现在可以开始使用教育内容策略优化工作台了！

**下一步**：
- ✅ 生成选题
- ✅ 创建提纲
- ✅ 查找资源
- ✅ 生成文章

**开始创作吧！** 🚀
