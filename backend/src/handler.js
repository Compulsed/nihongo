const AWS = require('aws-sdk');

const { sqlMessager } = require('./sql-messager');

const handler = async (event, context) => {
    console.log(JSON.stringify({ event, context }));


    const sql = sqlMessager(client);
};

module.exports = { handler };