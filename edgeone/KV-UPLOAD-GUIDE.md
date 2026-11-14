# EdgeOne KV 上传指南

## 数据概览

- **a**: 1331 条句子, 426 KB
- **b**: 90 条句子, 29 KB
- **c**: 612 条句子, 197 KB
- **d**: 1438 条句子, 467 KB
- **e**: 1052 条句子, 335 KB
- **f**: 709 条句子, 225 KB
- **g**: 603 条句子, 192 KB
- **h**: 150 条句子, 49 KB
- **i**: 691 条句子, 218 KB
- **j**: 77 条句子, 25 KB
- **k**: 200 条句子, 65 KB
- **l**: 22 条句子, 7 KB

## 自动上传（推荐）

### Linux/Mac
```bash
bash upload-kv.sh
```

### Windows
```cmd
upload-kv.bat
```

## 手动上传

如果 CLI 不可用，可以通过 EdgeOne 控制台手动上传：

1. 进入 EdgeOne 控制台 > 边缘函数 > KV 存储
2. 创建命名空间：HITOKOTO_KV
3. 逐个上传以下键值对：

### sentences_a
- **键名**: `sentences_a`
- **文件**: `D:\Users\xzccs\Downloads\新建文件夹\hitokoto-cloudflare\sentences\a.json`
- **类型**: JSON
- **大小**: 426 KB

### sentences_b
- **键名**: `sentences_b`
- **文件**: `D:\Users\xzccs\Downloads\新建文件夹\hitokoto-cloudflare\sentences\b.json`
- **类型**: JSON
- **大小**: 29 KB

### sentences_c
- **键名**: `sentences_c`
- **文件**: `D:\Users\xzccs\Downloads\新建文件夹\hitokoto-cloudflare\sentences\c.json`
- **类型**: JSON
- **大小**: 197 KB

### sentences_d
- **键名**: `sentences_d`
- **文件**: `D:\Users\xzccs\Downloads\新建文件夹\hitokoto-cloudflare\sentences\d.json`
- **类型**: JSON
- **大小**: 467 KB

### sentences_e
- **键名**: `sentences_e`
- **文件**: `D:\Users\xzccs\Downloads\新建文件夹\hitokoto-cloudflare\sentences\e.json`
- **类型**: JSON
- **大小**: 335 KB

### sentences_f
- **键名**: `sentences_f`
- **文件**: `D:\Users\xzccs\Downloads\新建文件夹\hitokoto-cloudflare\sentences\f.json`
- **类型**: JSON
- **大小**: 225 KB

### sentences_g
- **键名**: `sentences_g`
- **文件**: `D:\Users\xzccs\Downloads\新建文件夹\hitokoto-cloudflare\sentences\g.json`
- **类型**: JSON
- **大小**: 192 KB

### sentences_h
- **键名**: `sentences_h`
- **文件**: `D:\Users\xzccs\Downloads\新建文件夹\hitokoto-cloudflare\sentences\h.json`
- **类型**: JSON
- **大小**: 49 KB

### sentences_i
- **键名**: `sentences_i`
- **文件**: `D:\Users\xzccs\Downloads\新建文件夹\hitokoto-cloudflare\sentences\i.json`
- **类型**: JSON
- **大小**: 218 KB

### sentences_j
- **键名**: `sentences_j`
- **文件**: `D:\Users\xzccs\Downloads\新建文件夹\hitokoto-cloudflare\sentences\j.json`
- **类型**: JSON
- **大小**: 25 KB

### sentences_k
- **键名**: `sentences_k`
- **文件**: `D:\Users\xzccs\Downloads\新建文件夹\hitokoto-cloudflare\sentences\k.json`
- **类型**: JSON
- **大小**: 65 KB

### sentences_l
- **键名**: `sentences_l`
- **文件**: `D:\Users\xzccs\Downloads\新建文件夹\hitokoto-cloudflare\sentences\l.json`
- **类型**: JSON
- **大小**: 7 KB


## 验证上传

上传完成后，在边缘函数代码中测试：

```javascript
// 测试读取
const sentences = await env.HITOKOTO_KV.get('sentences_a', { type: 'json' });
console.log('句子数量:', sentences.length);
```

## 注意事项

1. **KV 存储限制**: 每个值最大 25MB，所有分类数据都在限制内
2. **命名空间绑定**: 部署边缘函数时，务必绑定 HITOKOTO_KV 命名空间
3. **数据更新**: 修改句子数据后，重新运行上传脚本即可覆盖
4. **性能**: KV 读取会缓存在边缘节点，首次访问后性能极佳
