const ws = require("ws");
const express = require("express");

const axios = require('axios');

const expressServer = express()

expressServer.use(express.static('public'));

expressServer.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


const wsServer = new ws.Server({
  port: 1000,
  host: "localhost",
  path : "/"
})

expressServer.get('/', (req, res) => {
  res.send('Hello World!');
});


wsServer.on("connection", (ws, req) => {
  var symbol = req.url.split('=')[1]

  var config = {
    method: 'get',
    url: `https://suncrypto.in/socket/coindata?symbol=${symbol}`,
    headers: {}
  };
  

   axios(config)
    .then(function (response) {
        ws.send(JSON.stringify(response.data))
    })
    .catch(function (error) {
        console.log(error.message);
    });

  setInterval(function getmarket() {
    axios(config)
    .then(function (response) {
        ws.send(JSON.stringify(response.data))
    })
    .catch(function (error) {
        console.log(error.message);
    });
  }, 10000);

})
