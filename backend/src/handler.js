const AWS = require('aws-sdk');

const { sqlMessager } = require('./sql-messager');

const clientMessager = (event) => {
    const APIGWClient = new AWS.ApiGatewayManagementApi({
        apiVersion: '2018-11-29',
        endpoint: `https://${event.requestContext.domainName}/${event.requestContext.stage}`
    });

    return async (message) => {
        return APIGWClient.postToConnection({
            ConnectionId: event.requestContext.connectionId,
            Data: message,
        })
        .promise();
    };
};

const handler = async (event, context) => {
    console.log(JSON.stringify({ event, context }));

    const client = clientMessager(event);

    const sql = sqlMessager(client);

    if (event.body) {
        try {
            const results = await Promise.all([
                sql(event.body),
                sql(event.body),
                sql(event.body),
                sql(event.body),
            ]);

            console.log(JSON.stringify({ results }));

            await client(JSON.stringify(results, null, 2));
        } catch (err) {
            console.error(err, err.stack);

            await client(err.stack.toString());
        }
    }

    return {
        statusCode: 200
    };
};

module.exports = { handler };