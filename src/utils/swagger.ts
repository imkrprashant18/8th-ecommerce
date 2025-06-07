import swaggerJsdoc from "swagger-jsdoc";

const options = {
        definition: {
                openapi: "3.0.0",
                info: {
                        title: "8th Ecommerce API",
                        version: "1.0.0",
                        description: "API documentation for 8th Ecommerce backend",
                },
                servers: [
                        {
                                url: "http://localhost:8000/api/v1",
                        },
                ],
        },
        apis: ["./src/routes/**/*.ts", "./src/controllers/**/*.ts"], // adjust as needed
};

export const swaggerSpec = swaggerJsdoc(options);
