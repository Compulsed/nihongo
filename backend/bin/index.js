const _ = require('lodash');


const data = {
    "sqlStatementResults": [
      {
        "numberOfRecordsUpdated": -1,
        "resultFrame": {
          "records": [
            {
              "values": [
                {
                  "bigIntValue": null,
                  "bitValue": null,
                  "blobValue": null,
                  "doubleValue": null,
                  "intValue": null,
                  "isNull": null,
                  "realValue": null,
                  "stringValue": "a"
                }
              ]
            },
            {
              "values": [
                {
                  "bigIntValue": null,
                  "bitValue": null,
                  "blobValue": null,
                  "doubleValue": null,
                  "intValue": null,
                  "isNull": null,
                  "realValue": null,
                  "stringValue": "k"
                }
              ]
            },
            {
              "values": [
                {
                  "bigIntValue": null,
                  "bitValue": null,
                  "blobValue": null,
                  "doubleValue": null,
                  "intValue": null,
                  "isNull": null,
                  "realValue": null,
                  "stringValue": "dd"
                }
              ]
            },
            {
              "values": [
                {
                  "bigIntValue": null,
                  "bitValue": null,
                  "blobValue": null,
                  "doubleValue": null,
                  "intValue": null,
                  "isNull": null,
                  "realValue": null,
                  "stringValue": "dd"
                }
              ]
            },
            {
              "values": [
                {
                  "bigIntValue": null,
                  "bitValue": null,
                  "blobValue": null,
                  "doubleValue": null,
                  "intValue": null,
                  "isNull": null,
                  "realValue": null,
                  "stringValue": "dd"
                }
              ]
            }
          ],
          "resultSetMetadata": {
            "columnCount": 1,
            "columnMetadata": [
              {
                "arrayBaseColumnType": 0,
                "isAutoIncrement": false,
                "isCaseSensitive": false,
                "isCurrency": false,
                "isSigned": false,
                "label": "c1",
                "name": "c1",
                "nullable": 1,
                "precision": 10,
                "scale": 0,
                "schemaName": "",
                "tableName": "t1",
                "type": 1,
                "typeName": "CHAR"
              }
            ]
          }
        }
      }
    ]
};
  
const resultFrame = data.sqlStatementResults[0].resultFrame;

const resultSetMetadata = _.map(
    resultFrame.resultSetMetadata.columnMetadata,
    'label'
);

const records = _.map(
    resultFrame.records,
    record => _.reduce(record.values, (acc, value, index) => {
        acc[resultSetMetadata[index]] = value.stringValue;
        return acc;
    }, {})
);


console.log('Here');