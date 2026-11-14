// 上传句子数据到 EdgeOne KV 的脚本
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('准备上传数据到 EdgeOne KV...\n');

// 读取所有 sentences JSON 文件
const sentencesDir = path.join(__dirname, '../sentences');
const categories = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'];

const uploadCommands = [];

for (const cat of categories) {
    const filePath = path.join(sentencesDir, `${cat}.json`);
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    const size = Math.round(content.length / 1024);
    
    console.log(`${cat}.json: ${data.length} 条句子, ${size} KB`);
    
    // 生成 EdgeOne CLI 命令
    const key = `sentences_${cat}`;
    uploadCommands.push({
        key: key,
        file: filePath,
        category: cat,
        count: data.length,
        size: size
    });
}

console.log('\n=== 上传命令 ===\n');
console.log('请按以下步骤操作：\n');
console.log('1. 安装 EdgeOne CLI（如果还没安装）:');
console.log('   npm install -g @tencent/edgeone-cli\n');
console.log('2. 登录并配置:');
console.log('   eo login\n');
console.log('3. 创建 KV 命名空间:');
console.log('   eo kv:namespace create HITOKOTO_KV\n');
console.log('4. 上传数据（逐个执行以下命令）:\n');

uploadCommands.forEach(cmd => {
    console.log(`   # 上传 ${cmd.category} 类别 (${cmd.count} 条)`);
    console.log(`   eo kv:key put ${cmd.key} --path="${cmd.file}" --namespace=HITOKOTO_KV\n`);
});

console.log('5. 在边缘函数中绑定 KV 命名空间:');
console.log('   变量名: HITOKOTO_KV');
console.log('   命名空间: 选择刚创建的 HITOKOTO_KV\n');

// 生成批量上传脚本
const batchScriptPath = path.join(__dirname, 'upload-kv.sh');
const batchScript = `#!/bin/bash
# EdgeOne KV 批量上传脚本

echo "开始上传句子数据到 EdgeOne KV..."
echo ""

${uploadCommands.map(cmd => 
    `echo "上传 ${cmd.category}.json (${cmd.count} 条句子, ${cmd.size} KB)..."
eo kv:key put ${cmd.key} --path="${cmd.file}" --namespace=HITOKOTO_KV`
).join('\n\n')}

echo ""
echo "✓ 上传完成！"
`;

fs.writeFileSync(batchScriptPath, batchScript, 'utf-8');
console.log(`✓ 批量上传脚本已生成: ${batchScriptPath}`);
console.log('  在 Linux/Mac 上执行: bash upload-kv.sh');
console.log('  在 Windows 上需要使用 Git Bash 或 WSL\n');

// 生成 Windows 批处理脚本
const batScriptPath = path.join(__dirname, 'upload-kv.bat');
const batScript = `@echo off
chcp 65001 >nul
echo 开始上传句子数据到 EdgeOne KV...
echo.

${uploadCommands.map(cmd => 
    `echo 上传 ${cmd.category}.json (${cmd.count} 条句子, ${cmd.size} KB)...
eo kv:key put ${cmd.key} --path="${cmd.file.replace(/\//g, '\\')}" --namespace=HITOKOTO_KV`
).join('\n\n')}

echo.
echo 上传完成！
pause
`;

fs.writeFileSync(batScriptPath, batScript, 'utf-8');
console.log(`✓ Windows 批处理脚本已生成: ${batScriptPath}\n`);

// 生成手动上传说明
const manualPath = path.join(__dirname, 'KV-UPLOAD-GUIDE.md');
const manualContent = `# EdgeOne KV 上传指南

## 数据概览

${uploadCommands.map(cmd => 
    `- **${cmd.category}**: ${cmd.count} 条句子, ${cmd.size} KB`
).join('\n')}

## 自动上传（推荐）

### Linux/Mac
\`\`\`bash
bash upload-kv.sh
\`\`\`

### Windows
\`\`\`cmd
upload-kv.bat
\`\`\`

## 手动上传

如果 CLI 不可用，可以通过 EdgeOne 控制台手动上传：

1. 进入 EdgeOne 控制台 > 边缘函数 > KV 存储
2. 创建命名空间：HITOKOTO_KV
3. 逐个上传以下键值对：

${uploadCommands.map(cmd => 
    `### ${cmd.key}
- **键名**: \`${cmd.key}\`
- **文件**: \`${cmd.file}\`
- **类型**: JSON
- **大小**: ${cmd.size} KB
`
).join('\n')}

## 验证上传

上传完成后，在边缘函数代码中测试：

\`\`\`javascript
// 测试读取
const sentences = await env.HITOKOTO_KV.get('sentences_a', { type: 'json' });
console.log('句子数量:', sentences.length);
\`\`\`

## 注意事项

1. **KV 存储限制**: 每个值最大 25MB，所有分类数据都在限制内
2. **命名空间绑定**: 部署边缘函数时，务必绑定 HITOKOTO_KV 命名空间
3. **数据更新**: 修改句子数据后，重新运行上传脚本即可覆盖
4. **性能**: KV 读取会缓存在边缘节点，首次访问后性能极佳
`;

fs.writeFileSync(manualPath, manualContent, 'utf-8');
console.log(`✓ 上传指南已生成: ${manualPath}\n`);

console.log('=== 下一步 ===');
console.log('1. 执行批量上传脚本，或按照指南手动上传');
console.log('2. 使用 edgeone/index-kv.js 作为边缘函数代码');
console.log('3. 在 EdgeOne 控制台绑定 KV 命名空间\n');
