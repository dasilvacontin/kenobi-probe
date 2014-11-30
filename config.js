
if (process.env.NODE_ENV == 'dev') {
  exports.PORT = 8080;
  exports.FRONTEND_URL = 'http://5c2b109c.ngrok.com';
} else {
  exports.PORT = 80;
  exports.FRONTEND_URL = 'http://localhost:8080';
}

exports.BACKEND_URL = 'http://cbc1ae8.ngrok.com';
exports.POCKET_CKEY = '35187-614ac5a0e609695f73399b7b';

