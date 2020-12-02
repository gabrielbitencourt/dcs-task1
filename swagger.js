const swaggerAutogen = require('swagger-autogen')();

const docs = {
    info: {
        title: "Deep Consulting Solutions - Task 1",
        description: "Task one from Deep Consulting Solutions hiring process."
    },
    host: "task1.bitencourt.ga",
    schemes: ['http'],
    definitions: {
        Metric: {
            $value: 5
        },
        Success: {
            $error: false,
            $data: 5
        },
        NotFound: {
            $error: true,
            $message: "Key example not found"
        },
        UnprocessableEntity: {
            $error: true,
            $message: "Value not sent or not a number"
        },
        InternalServerError: {
            $error: true,
            $message: "Unexpected error"
        }
    }
};

const outputFile = './swagger.output.json';
const endpointsFiles = ['./src/routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, docs);