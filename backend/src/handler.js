const { ApolloServer, gql } = require('apollo-server-lambda');
const { wordList, writeWord, clearWordList } = require('./data/japanese-to-english-words-service');
const { convertToTreeForm } = require('./util/convert-word-list-to-tree');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
    type WordPair {
        japaneseWord: String
        englishWord: String
    }

    type Query {
        wordList: [WordPair]
        wordTree: String
    }

    type Mutation {
        writeWord(englishWord: String!, japaneseWord: String!): String
        clearWordList: String
    }
`;

const resolvers = {
  Query: {
    wordList: async () => {
        return wordList();
    },
    wordTree: async () => {
        return JSON.stringify(convertToTreeForm(await wordList()));
    }
  },

  Mutation: {
    writeWord: async (parent, args, context) => {
        await writeWord(args);

        return 'Success';
    },
    clearWordList: async () => {
        await clearWordList();

        return 'Success';
    },
  }
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