const Ajv = require("ajv");
const fetch = require("node-fetch");
const ajv = new Ajv();
const schema = require("./schema.json"); 

const URL2 = 'https://restcountries.com/v3.1/all';

async function validateData() {
    try {
        const response = await fetch(URL2);
        const data = await response.json();

        const validate = ajv.compile(schema);
        const valid = validate({ data });

        if (valid) {
            console.log("JSON data is valid");
        } else {
            console.log("JSON data is invalid:", validate.errors);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

validateData();