const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../../swagger.output.json');
const Metrics = require('../metric');

const metrics = new Metrics();
router.get('/metrics/:id', (req, res) => {
    // #swagger.path = '/metrics/{id}'
    // #swagger.method = 'get'
    // #swagger.description = 'Get metrics sum for id.'

    const time = Date.now();
    try {
        /*
            #swagger.responses[200] = {
            schema: { $ref: "#/definitions/Success" },
            description: 'OK'
            }
        */
        return res.status(200).json({
            error: false,
            data: metrics.sum(req.params.id, time)
        });
    }
    catch (error) {
        switch (error.message) {
            case `Key ${req.params.id} not found`:
                /*
                    #swagger.responses[404] = {
                    schema: { $ref: "#/definitions/NotFound" },
                    description: 'Not found'
                    }
                */
                return res.status(404).json({
                    error: true,
                    message: error.message
                });
            default:
                /*
                    #swagger.responses[500] = {
                    schema: { $ref: "#/definitions/InternalServerError" },
                    description: 'Internal server error'
                    }
                */
                return res.status(500).json({
                    error: true,
                    message: error.message
                });
        }
    }
});
router.post('/metrics/:id', (req, res) => {
    // #swagger.path = '/metrics/{id}'
    // #swagger.method = 'post'
    // #swagger.description = 'Create new metric for id.'
    const time = Date.now();

    /*
    #swagger.parameters['metric'] = { 
           in: 'body',
           description: 'Metric value',
           type: 'object',
           schema: { $ref: "#/definitions/Metric" }
    }
    */
    const body = req.body;
    if (!body.value || parseInt(body.value) === NaN) {
        /*
        #swagger.responses[422] = { 
            schema: { $ref: "#/definitions/UnprocessableEntity" },
            description: 'Unprocessable entity' 
        }
        */
        return res.status(422).json({
            error: true,
            message: "Value not sent or not a number."
        });
    }
    try {
        metrics.add(req.params.id, Math.round(body.value), time);
        /*
        #swagger.responses[200] = { 
            schema: { $ref: "#/definitions/Success" },
            description: 'OK' 
        }
        */
        return res.status(200).json({
            error: false
        });
    }
    catch (error) {
        /*
        #swagger.responses[500] = { 
            schema: { $ref: "#/definitions/InternalServerError" },
            description: 'Internal server error' 
        }
        */
        return res.status(500).json({
            error: true,
            message: error.message
        });
    }
});

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
router.get('*', (req, res) => {
    // #swagger.ignore = true
    return res.redirect('/docs');
});

module.exports = router;