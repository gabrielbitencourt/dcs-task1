const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./src/routes');

const app = express();
app.use(bodyParser.json());

app.use(routes);

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Listening at port ${port};`);
});