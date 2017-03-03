var express = require('express');
var app = express();
app.use(express.static('public'));
// app.listen(process.env.PORT || 8080);

let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl, port=8080) {
  return new Promise((resolve, reject) => {
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        reject(err);
      });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
 return new Promise((resolve, reject) => {
   console.log('Closing server');
   server.close(err => {
       if (err) {
           return reject(err);
       }
       resolve();
   });
 });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {runServer, app, closeServer};
