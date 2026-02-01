(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__2b2f5034._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/ [middleware-edge] (unsupported edge import 'stream', ecmascript)", ((__turbopack_context__, module, exports) => {

__turbopack_context__.n(__import_unsupported(`stream`));
}),
"[externals]/node:util [external] (node:util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:util", () => require("node:util"));

module.exports = mod;
}),
"[project]/ [middleware-edge] (unsupported edge import 'crypto', ecmascript)", ((__turbopack_context__, module, exports) => {

__turbopack_context__.n(__import_unsupported(`crypto`));
}),
"[project]/workspace/canteen-backend/src/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SECRET_KEY",
    ()=>SECRET_KEY,
    "checkRole",
    ()=>checkRole,
    "verifyToken",
    ()=>verifyToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$canteen$2d$backend$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/workspace/canteen-backend/node_modules/jsonwebtoken/index.js [middleware-edge] (ecmascript)");
;
const SECRET_KEY = 'super-secret-key-change-it'; // В реальном проекте храни в .env
const verifyToken = (req, res, next)=>{
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({
        message: 'No token provided'
    });
    try {
        const decoded = __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$canteen$2d$backend$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
};
const checkRole = (roles)=>{
    return (req, res, next)=>{
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Access denied'
            });
        }
        next();
    };
};
;
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__2b2f5034._.js.map