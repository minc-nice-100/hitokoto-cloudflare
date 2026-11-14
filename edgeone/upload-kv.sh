#!/bin/bash
# EdgeOne KV 批量上传脚本

echo "开始上传句子数据到 EdgeOne KV..."
echo ""

echo "上传 a.json (1331 条句子, 426 KB)..."
eo kv:key put sentences_a --path="D:\Users\xzccs\Downloads\新建文件夹\hitokoto-cloudflare\sentences\a.json" --namespace=HITOKOTO_KV

echo "上传 b.json (90 条句子, 29 KB)..."
eo kv:key put sentences_b --path="D:\Users\xzccs\Downloads\新建文件夹\hitokoto-cloudflare\sentences\b.json" --namespace=HITOKOTO_KV

echo "上传 c.json (612 条句子, 197 KB)..."
eo kv:key put sentences_c --path="D:\Users\xzccs\Downloads\新建文件夹\hitokoto-cloudflare\sentences\c.json" --namespace=HITOKOTO_KV

echo "上传 d.json (1438 条句子, 467 KB)..."
eo kv:key put sentences_d --path="D:\Users\xzccs\Downloads\新建文件夹\hitokoto-cloudflare\sentences\d.json" --namespace=HITOKOTO_KV

echo "上传 e.json (1052 条句子, 335 KB)..."
eo kv:key put sentences_e --path="D:\Users\xzccs\Downloads\新建文件夹\hitokoto-cloudflare\sentences\e.json" --namespace=HITOKOTO_KV

echo "上传 f.json (709 条句子, 225 KB)..."
eo kv:key put sentences_f --path="D:\Users\xzccs\Downloads\新建文件夹\hitokoto-cloudflare\sentences\f.json" --namespace=HITOKOTO_KV

echo "上传 g.json (603 条句子, 192 KB)..."
eo kv:key put sentences_g --path="D:\Users\xzccs\Downloads\新建文件夹\hitokoto-cloudflare\sentences\g.json" --namespace=HITOKOTO_KV

echo "上传 h.json (150 条句子, 49 KB)..."
eo kv:key put sentences_h --path="D:\Users\xzccs\Downloads\新建文件夹\hitokoto-cloudflare\sentences\h.json" --namespace=HITOKOTO_KV

echo "上传 i.json (691 条句子, 218 KB)..."
eo kv:key put sentences_i --path="D:\Users\xzccs\Downloads\新建文件夹\hitokoto-cloudflare\sentences\i.json" --namespace=HITOKOTO_KV

echo "上传 j.json (77 条句子, 25 KB)..."
eo kv:key put sentences_j --path="D:\Users\xzccs\Downloads\新建文件夹\hitokoto-cloudflare\sentences\j.json" --namespace=HITOKOTO_KV

echo "上传 k.json (200 条句子, 65 KB)..."
eo kv:key put sentences_k --path="D:\Users\xzccs\Downloads\新建文件夹\hitokoto-cloudflare\sentences\k.json" --namespace=HITOKOTO_KV

echo "上传 l.json (22 条句子, 7 KB)..."
eo kv:key put sentences_l --path="D:\Users\xzccs\Downloads\新建文件夹\hitokoto-cloudflare\sentences\l.json" --namespace=HITOKOTO_KV

echo ""
echo "✓ 上传完成！"
