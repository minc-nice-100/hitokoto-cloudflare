// EdgeOne 边缘函数版本
// 逐个导入 sentences 目录下的各个 JSON 文件
import a from "../sentences/a.json";
import b from "../sentences/b.json";
import c from "../sentences/c.json";
import d from "../sentences/d.json";
import e from "../sentences/e.json";
import f from "../sentences/f.json";
import g from "../sentences/g.json";
import h from "../sentences/h.json";
import i from "../sentences/i.json";
import j from "../sentences/j.json";
import k from "../sentences/k.json";
import l from "../sentences/l.json";

// 将一言类型映射到对应的 JSON 文件内容
const sentencesMap = {
    "a": a,
    "b": b,
    "c": c,
    "d": d,
    "e": e,
    "f": f,
    "g": g,
    "h": h,
    "i": i,
    "j": j,
    "k": k,
    "l": l,
};

// 通用响应标头
const responseHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "X-Content-Type-Options": "nosniff",
    "X-Source-Code": "https://github.com/jiandan2020/hitokoto-cloudflare",
};

// 统一返回函数
function createResponse(code, message, extraData = {}, extraHeaders = {}) {
    return new Response(JSON.stringify({
        code: code,
        message: message,
        timestamp: Date.now(),
        ...extraData,
    }), {
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            ...extraHeaders,
            ...responseHeaders,
        },
        status: code,
    });
}

// 通用错误处理函数
function handleError(code, error, devEnv, customMessage = "服务器内部错误") {
    if (devEnv === "true") {
        return createResponse(code, error.message);
    } else {
        return createResponse(code, customMessage);
    }
}

async function handleRequest(request) {
    try {
        // 处理 OPTIONS 请求
        if (request.method === "OPTIONS") {
            return new Response(null, {
                headers: {
                    ...responseHeaders,
                },
            });
        }

        const url = new URL(request.url); // 获取请求的 URL
        const categoryKey = url.searchParams.get("c"); // 从 URL 中获取 c 参数，一言类型
        const encodeType = url.searchParams.get("encode"); // 从 URL 中获取 encode 参数，返回编码
        const callback = url.searchParams.get("callback"); // 从 URL 中获取 callback 参数，调用的异步函数
        const select = url.searchParams.get("select"); // 从 URL 中获取 select 参数，选择器。配合 encode=js 使用

        const minLength = url.searchParams.has("min_length") // 从 URL 中获取 min_length 参数，返回一言的最小长度（包含）
            ? parseInt(url.searchParams.get("min_length"), 10) 
            : 0;

        const maxLength = url.searchParams.has("max_length") // 从 URL 中获取 max_length 参数，返回一言的最大长度（包含）
            ? parseInt(url.searchParams.get("max_length"), 10) 
            : 30;

        // 在 minLength 被传入时进行正整数检查
        if (url.searchParams.has("min_length") && (minLength <= 0 || !Number.isInteger(minLength))) {
            return createResponse(400, "min_length 必须是正整数");
        }

        // 在 maxLength 被传入时进行正整数检查
        if (url.searchParams.has("max_length") && (maxLength <= 0 || !Number.isInteger(maxLength))) {
            return createResponse(400, "max_length 必须是正整数");
        }

        // 确保 maxLength 不小于 minLength
        if (maxLength < minLength) {
            return createResponse(400, "max_length 不能小于 min_length");
        }

        let sentences = [];

        // 如果有 categoryKey 并且该类别存在，则使用对应类别的一言
        if (categoryKey) {
            sentences = sentencesMap[categoryKey] || sentencesMap["a"]; // 如果没有该类别，默认使用 a 类别
        } else {
            // 如果没有提供 categoryKey，则随机选择一个类别
            const keys = Object.keys(sentencesMap);
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            sentences = sentencesMap[randomKey];
        }

        // 如果有 minLength 或 maxLength 参数，进行长度筛选
        if (minLength || maxLength) {
            // 如果有 categoryKey，则仅筛选该类别的一言
            if (categoryKey) {
                sentences = sentencesMap[categoryKey] || [];
            } else {
                // 如果没有 categoryKey，则聚合所有一言的集合
                sentences = Object.values(sentencesMap).flat();
            }

            // 过滤不符合 min_length 和 max_length 条件的一言
            sentences = sentences.filter(sentence => {
                const isMinLengthValid = !minLength || sentence.length >= minLength;
                const isMaxLengthValid = !maxLength || sentence.length <= maxLength;
                return isMinLengthValid && isMaxLengthValid;
            });

            // 如果没有符合条件的一言，返回提示信息
            if (sentences.length === 0) {
                if (categoryKey) {
                    return createResponse(404, "没有在该类别找到符合长度条件的一言");
                }
                return createResponse(404, "没有找到符合长度条件的一言");
            }
        }

        // 从选中的分类中随机选择一条一言
        const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];

        // 构造响应数据
        const response = {
            id: randomSentence.id, // 一言的唯一标识符
            uuid: randomSentence.uuid, // 一言的 UUID
            hitokoto: randomSentence.hitokoto, // 一言内容
            type: randomSentence.type, // 一言类型
            from: randomSentence.from, // 一言的来源
            from_who: randomSentence.from_who, // 一言的作者
            creator: randomSentence.creator, // 一言的创建者
            creator_uid: randomSentence.creator_uid, // 一言的创建者的 UUID
            reviewer: randomSentence.reviewer, // 一言的审核者
            commit_from: randomSentence.commit_from, // 一言的提交来源
            created_at: randomSentence.created_at, // 一言的创建时间
            length: randomSentence.length, // 一言的长度
        };

        // 如果有 encodeType、callback、select 参数则处理并返回相应的内容
        if (encodeType === "text") {
            // 构建基本的响应内容
            const responseContent = callback 
                ? `;${callback}("${randomSentence.hitokoto.replace(/"/g, "\\\"")}");` 
                : randomSentence.hitokoto;

            // 返回响应
            const contentType = callback ? "application/javascript" : "text/plain";
            return new Response(responseContent, {
                headers: {
                    "Content-Type": `${contentType}; charset=UTF-8`,
                    ...responseHeaders,
                },
            });
        } else if (encodeType === "js") {
            // 构建基础的 JS 内容
            const jsContent = `(function hitokoto(){var hitokoto="${randomSentence.hitokoto.replace(/"/g, "\\\"")}";var dom=document.querySelector('${select || ".hitokoto"}');Array.isArray(dom)?dom[0].innerText=hitokoto:dom.innerText=hitokoto;})()`;

            // 如果有 callback 参数，则包裹为回调形式
            const finalContent = callback 
                ? `;${callback}("${jsContent}");` 
                : jsContent;

            // 返回最终的 JS 内容
            return new Response(finalContent, {
                headers: {
                    "Content-Type": "application/javascript; charset=UTF-8",
                    ...responseHeaders,
                },
            });
        } else if ((!encodeType || encodeType === "json") && callback) {
            // 将 response 对象转换为 JSON 字符串
            const jsonResponse = JSON.stringify(response);

            // 构建带调用异步函数的 JSON
            const jsonCallbackContent = `;${callback}("${jsonResponse.replace(/"/g, "\\\"")}");`;

            // 返回响应
            return new Response(jsonCallbackContent, {
                headers: {
                    "Content-Type": "application/javascript; charset=UTF-8",
                    ...responseHeaders,
                },
            });
        } else {
            // 默认返回 JSON 格式数据
            return new Response(JSON.stringify(response), {
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                    ...responseHeaders,
                },
            });
        }
    } catch (error) {
        console.error("Unexpected error:", error);
        return handleError(500, error, "false");
    }
}

// EdgeOne 边缘函数入口
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});
