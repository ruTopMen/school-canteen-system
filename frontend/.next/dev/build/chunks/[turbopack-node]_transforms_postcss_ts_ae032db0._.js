module.exports = [
"[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/workspace/canteen-backend/frontend/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "chunks/e17b0_1056c3f2._.js",
  "chunks/[root-of-the-server]__fab5ff0f._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/workspace/canteen-backend/frontend/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript)");
    });
});
}),
];