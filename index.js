import express from 'express';
import jsonParser from 'body-parser';

const app = express();
app.use(jsonParser);

const port = 3000;
app.listen(port, () => {
    console.log(`Listening at port ${port};`);
});