// 构建脚本：将所有 JSON 数据内联到单个 JS 文件中
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('开始构建 EdgeOne 边缘函数...');

// 读取所有 sentences JSON 文件
const sentencesDir = path.join(__dirname, '../sentences');
const categories = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'];

const sentencesData = {};
let totalSize = 0;

for (const cat of categories) {
    const filePath = path.join(sentencesDir, `${cat}.json`);
    const content = fs.readFileSync(filePath, 'utf-8');
    sentencesData[cat] = JSON.parse(content);
    totalSize += content.length;
    console.log(`✓ 已加载 ${cat}.json (${Math.round(content.length / 1024)} KB)`);
}

console.log(`\n总数据大小: ${Math.round(totalSize / 1024)} KB`);

// 读取核心逻辑模板
const templatePath = path.join(__dirname, 'index.js');
let template = fs.readFileSync(templatePath, 'utf-8');

// 替换 import 语句为内联数据
const importPattern = /\/\/ 逐个导入[\s\S]*?\/\/ 将一言类型映射到对应的 JSON 文件内容\nconst sentencesMap = \{[\s\S]*?\};/;
const replacement = `// 内联的句子数据（构建时间: ${new Date().toISOString()}）
const sentencesMap = ${JSON.stringify(sentencesData, null, 2)};`;

const bundled = template.replace(importPattern, replacement);

// 写入构建后的文件
const outputPath = path.join(__dirname, 'index.bundle.js');
fs.writeFileSync(outputPath, bundled, 'utf-8');

const outputSize = fs.statSync(outputPath).size;
console.log(`\n✓ 构建完成！`);
console.log(`  输出文件: ${outputPath}`);
console.log(`  文件大小: ${Math.round(outputSize / 1024)} KB`);

if (outputSize > 1024 * 1024) {
    console.warn(`\n⚠️  警告: 文件大小超过 1MB，可能超出 EdgeOne 限制`);
    console.warn(`  建议: 使用 EdgeOne KV 存储或 COS 对象存储来托管 JSON 数据`);
} else {
    console.log(`\n✅ 文件大小符合要求，可以直接部署到 EdgeOne`);
}
