// craco.config.js
// wasm を利用するためのカスタムヘッダーを設定

module.exports = {
  devServer: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
};
