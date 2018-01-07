const path = require('path');

const publicPath = path.join(__dirname,'../public')
const express = require('express');
const port = process.env.PORT || 4000;
//const bodyParser = require('body-parser');

var app = express();

app.use(express.static(publicPath));

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
