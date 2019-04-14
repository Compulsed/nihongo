const AWS = require('aws-sdk');
const _ = require('lodash');

const { transformSQLQuery } = require('./transform');

const sqlMessager = () => {
    return async (sqlString) => {
        const now = Date.now();

        const result = await (new AWS.RDSDataService()).executeSql({
            awsSecretStoreArn: process.env.SECRET_ARN,
            dbClusterOrInstanceArn: process.env.DB_ARN,
            database: process.env.DATABASE_NAME,
            sqlStatements: sqlString,
        })
        .promise();

        // Output
        console.log(`Result: ${JSON.stringify(result, null, 2)}`);

        // Performance
        console.log(`Time taken to run query: ${sqlString}`);
        console.log(`${Date.now() - now}ms.`)
        
        const mappedResult = _.map(
            result.sqlStatementResults,
            sqlStatementResult => transformSQLQuery(sqlStatementResult)
        );

        // Output
        console.log(`MappedResult: ${JSON.stringify(mappedResult, null, 2)}`);

        return mappedResult[mappedResult.length - 1];
    };
};

module.exports = { sqlMessager };