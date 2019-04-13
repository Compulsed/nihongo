const _ = require('lodash');

const transformSQLQuery = (sqlStatementResult) => {
    if (_.get(sqlStatementResult, 'numberOfRecordsUpdated') !== -1) {
        return sqlStatementResult;
    }

    const resultFrame = sqlStatementResult.resultFrame;

    const resultSetMetadata = _.map(
        resultFrame.resultSetMetadata.columnMetadata,
        'label'
    );

    const records = _.map(
        resultFrame.records,
        record => _.reduce(record.values, (acc, value, index) => {
            acc[resultSetMetadata[index]] = (value.isNull === true)
                ? null
                : (value.stringValue || value.bigIntValue || value.doubleValue || value.intValue || value.realValue);
            return acc;
        }, {})
    );

    return records;
};

module.exports = { transformSQLQuery };