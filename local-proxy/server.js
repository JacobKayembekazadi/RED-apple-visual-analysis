const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Proxy middleware options
const options = {
  target: 'https://openrouter.ai', // target host
  changeOrigin: true, // needed for virtual hosted sites
  pathRewrite: {
    '^/api': '/api', // rewrite path
  },
  onProxyRes: function (proxyRes, req, res) {
    // Add CORS headers to the proxied response
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization';
    
    console.log(`Proxied request: ${req.method} ${req.path} -> ${proxyRes.statusCode}`);
  },
  onError: function (err, req, res) {
    console.error('Proxy error:', err);
    res.status(500).json({
      error: 'Proxy error',
      message: err.message
    });
  }
};

// Create the proxy middleware
const openRouterProxy = createProxyMiddleware(options);

// Apply the proxy middleware
app.use('/api', openRouterProxy);

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('Proxy server is running');
});

// Start the server
app.listen(port, () => {
  console.log(`Local proxy server running at http://localhost:${port}`);
  console.log(`To use the proxy, direct API requests to http://localhost:${port}/api/... instead of https://openrouter.ai/api/...`);
});
