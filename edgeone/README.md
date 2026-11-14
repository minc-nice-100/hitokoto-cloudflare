# Hitokoto EdgeOne 部署完整指南

本项目已成功适配腾讯云 EdgeOne 边缘函数。

## 📊 项目概况

- **原项目**: Cloudflare Pages 版本
- **数据大小**: 2.7MB (12个分类，共 6,975 条句子)
- **EdgeOne 适配**: 提供两种部署方案

## 🚀 部署方案

### 方案一：KV 存储版本（推荐）✅

**优势**:
- ✅ 代码体积小（约 5KB），符合 EdgeOne 限制
- ✅ 冷启动快
- ✅ 数据更新方便
- ✅ 性能优秀（边缘节点缓存）

**部署步骤**:

#### 1. 上传数据到 KV 存储

```bash
# 安装 EdgeOne CLI
npm install -g @tencent/edgeone-cli

# 登录
eo login

# 创建 KV 命名空间
eo kv:namespace create HITOKOTO_KV

# 批量上传数据
# Windows: 
upload-kv.bat

# Linux/Mac:
bash upload-kv.sh
```

或者手动上传，参考 `KV-UPLOAD-GUIDE.md`

#### 2. 部署边缘函数

1. 登录 [EdgeOne 控制台](https://console.cloud.tencent.com/edgeone)
2. 进入「边缘函数」> 「新建函数」
3. 函数名称：`hitokoto-api`
4. 代码：复制 `edgeone/index-kv.js` 的内容
5. **重要**：绑定 KV 命名空间
   - 变量名：`HITOKOTO_KV`
   - 命名空间：选择刚创建的 `HITOKOTO_KV`
6. 配置触发路由（例如：`/*` 或 `/api/hitokoto`）
7. 保存并发布

### 方案二：内联数据版本（备选）

**限制**: 构建后文件 2.8MB，**超过 EdgeOne 1MB 限制**，无法直接部署

**解决方法**:
1. 删减部分句子数据
2. 使用压缩算法
3. 改用 COS 对象存储托管 JSON

**构建命令**:
```bash
cd edgeone
node build.js
```

生成的 `index.bundle.js` 包含所有数据，但体积过大。

## 📖 API 使用说明

部署成功后，访问方式与原项目完全相同：

### 基础请求
```bash
# 获取随机一言
curl https://your-domain.com/

# 指定分类
curl https://your-domain.com/?c=a

# 纯文本格式
curl https://your-domain.com/?encode=text

# 长度筛选
curl https://your-domain.com/?min_length=10&max_length=20
```

### 参数说明

| 参数 | 说明 | 可选值 | 默认值 |
|------|------|--------|--------|
| c | 句子分类 | a-l | 随机 |
| encode | 返回格式 | json, text, js | json |
| callback | JSONP 回调 | 函数名 | - |
| select | JS 选择器 | CSS 选择器 | .hitokoto |
| min_length | 最小长度 | 正整数 | 0 |
| max_length | 最大长度 | 正整数 | 30 |

### 分类列表

- **a**: 动画 (1,331 条)
- **b**: 漫画 (90 条)
- **c**: 游戏 (612 条)
- **d**: 文学 (1,438 条)
- **e**: 原创 (1,052 条)
- **f**: 网络 (709 条)
- **g**: 其他 (603 条)
- **h**: 影视 (150 条)
- **i**: 诗词 (691 条)
- **j**: 网易云 (77 条)
- **k**: 哲学 (200 条)
- **l**: 抖机灵 (22 条)

## 📁 文件说明

```
edgeone/
├── index.js                  # 原始代码（带 import）
├── index-kv.js              # KV 存储版本（推荐使用）✅
├── index.bundle.js          # 构建后的完整文件（2.8MB，超限）
├── build.js                 # 构建脚本
├── prepare-kv-upload.js     # KV 上传准备脚本
├── upload-kv.sh            # Linux/Mac 批量上传脚本
├── upload-kv.bat           # Windows 批量上传脚本
├── KV-UPLOAD-GUIDE.md      # KV 上传详细指南
├── package.json            # 项目配置
└── README.md              # 本文件
```

## 🔧 EdgeOne 与 Cloudflare 差异

### 1. 入口函数
```javascript
// Cloudflare Pages
export async function onRequest(context) { ... }

// EdgeOne
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request, event.env));
});
```

### 2. 环境变量访问
```javascript
// Cloudflare Pages
const value = context.env.MY_VAR;

// EdgeOne
const value = env.MY_VAR; // 通过 event.env 传入
```

### 3. KV 存储
```javascript
// Cloudflare
const data = await env.MY_KV.get('key', { type: 'json' });

// EdgeOne（相同）
const data = await env.HITOKOTO_KV.get('key', { type: 'json' });
```

## ⚠️ 注意事项

1. **代码大小限制**: EdgeOne 边缘函数限制 1MB，使用 KV 存储方案避免超限
2. **KV 命名空间绑定**: 部署时必须绑定 `HITOKOTO_KV` 命名空间
3. **首次访问**: KV 数据首次读取后会缓存到边缘节点，后续访问极快
4. **CORS 配置**: 已在代码中配置允许跨域访问
5. **数据更新**: 修改句子后重新上传到 KV 即可，无需重新部署函数

## 🎯 快速开始

**推荐流程**（5 分钟完成部署）：

1. 运行 KV 上传准备脚本
   ```bash
   cd edgeone
   node prepare-kv-upload.js
   ```

2. 执行批量上传（Windows）
   ```cmd
   upload-kv.bat
   ```

3. 在 EdgeOne 控制台创建边缘函数，使用 `index-kv.js` 代码

4. 绑定 KV 命名空间 `HITOKOTO_KV`

5. 配置触发路由并发布

6. 测试访问
   ```bash
   curl https://your-domain.com/?c=a
   ```

## 📝 许可证

本项目采用 AGPL-3.0 许可证授权。

## 🙏 致谢

- 原项目：[jiandan2020/hitokoto-cloudflare](https://github.com/jiandan2020/hitokoto-cloudflare)
- 数据来源：[hitokoto-osc/sentences-bundle](https://github.com/hitokoto-osc/sentences-bundle)
