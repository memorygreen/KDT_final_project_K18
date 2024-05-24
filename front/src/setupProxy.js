const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080', // Spring Boot 애플리케이션의 주소와 포트로 수정
      changeOrigin: true,
    })
  );
};
