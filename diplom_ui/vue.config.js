const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = {};

// vue.config.js
const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
    devServer: {
        port: 8000,
        proxy: {
            "/api": {
                target: "http://localhost:8080/api",
                changeOrigin: true,
                pathRewrite: {
                    "^/api": "",
                },
            },
        },
    },
    server: {
        port: 3000,
        proxy: {
            "/api": {
                target: "http://localhost:8080/api",
                changeOrigin: true,
                pathRewrite: {
                    "^/api": "",
                },
            },
        },
    },
});
