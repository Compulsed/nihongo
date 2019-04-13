const Dataloader = require('dataloader');
const AWS = require('aws-sdk');
const _ = require('lodash');

const { transformSQLQuery } = require('./transform');

const sqlBatcher = new Dataloader(
    async (sqlStrings) => {
        const now = Date.now();

        const sqlStatements = sqlStrings
            .join(' ');

        const result = await (new AWS.RDSDataService()).executeSql({
            awsSecretStoreArn: process.env.SECRET_ARN,
            dbClusterOrInstanceArn: process.env.DB_ARN,
            database: process.env.DATABASE_NAME,
            sqlStatements: sqlStatements,
        })
        .promise();

        console.log(`Time taken to run query: ${sqlStatements}`);
        console.log(`${Date.now() - now}ms.`)

        return _.map(
            result.sqlStatementResults,
            sqlStatementResult => transformSQLQuery(sqlStatementResult)
        );
    },
    { cacheKeyFn: () => Math.random() } // Do not cache any queries / mutations
);

const sqlMessager = (client) => {
    return async (sqlString) => {
        const postMessage = client(`Excuting -> ${sqlString}`);

        const runSQL = sqlBatcher.load(sqlString);

        return Promise.all([ postMessage, runSQL ])
            .then(() => runSQL);
    };
};

module.exports = { sqlMessager };