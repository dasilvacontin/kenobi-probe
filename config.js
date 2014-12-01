
if (process.env.NODE_ENV == 'dev') {
  exports.PORT = 8080;
  exports.FRONTEND_URL = 'http://415a13ef.ngrok.com';
} else {
  exports.PORT = 80;
  exports.FRONTEND_URL = 'http://415a13ef.ngrok.com';
}

exports.BACKEND_URL = 'http://1edf617f.ngrok.com';
exports.POCKET_CKEY = '35187-614ac5a0e609695f73399b7b';

