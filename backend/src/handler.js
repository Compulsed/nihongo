const { sqlMessager } = require('./sql-messager');
const { ApolloServer, gql } = require('apollo-server-lambda');

const sql = sqlMessager();

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
    type wordPair {
        japanese_word: String
        english_word: String
    }

    type Query {
        wordList: [wordPair]
    }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    wordList: async () =>
        sql(`select * from japaneseToEnglishWords;`)
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = (event, context, callback) => {
    console.log(JSON.stringify({ event, context }));

    const handler = server.createHandler();
    
    handler(event, context, callback);
};

module.exports = { handler };