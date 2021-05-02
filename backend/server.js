//plugin http
const http = require('http');

//import de app.js
const app = require('./app');

app.set('port', process.env.PORT || 3000);

//création du server
const server = http.createServer(app);
   
server.listen(process.env.PORT || 3000);
