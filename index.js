const express = require('express');
const bodyParser = require('body-parser');
const Metrics = require('./src/metric');

const app = express();
app.use(bodyParser.json());

const metrics = new Metrics();
app.get('/metrics/:id', (req, res) => {
    const time = Date.now();
    try {
        res.status(200);
        return res.json({
            error: false,
            data: metrics.sum(req.params.id, time)
        });
    }
    catch (error) {
        switch (error.message) {
            case `Key ${req.params.id} not found`:
                res.status(404);
                return res.json({
                    error: true,
                    message: error.message
                });
            default:
                res.status(500);
                return res.json({
                    error: true,
                    message: error.message
                });
        }
    }
});

app.post('/metrics/:id', (req, res) => {
    const time = Date.now();
    const body = req.body;
    if (!body.value || parseInt(body.value) === NaN) {
        res.status(422);
        return res.json({
            error: true,
            message: "Value not sent or not a number."
        });
    }
    try {
        metrics.add(req.params.id, body.value, time);
        res.status(200);
        return res.json({
            error: false
        });
    }
    catch (error) {
        res.status(500);
        return res.json({
            error: true,
            message: error.message
        });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Listening at port ${port};`);
});