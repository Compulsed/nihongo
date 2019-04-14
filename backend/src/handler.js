const { ApolloServer, gql } = require('apollo-server-lambda');

const { wordList, writeWord, clearWordList, seedDatabase } = require('./data/japanese-to-english-words-service');
const { convertToTreeForm } = require('./util/convert-word-list-to-tree');
const { sqlMessager } = require('./sql-messager');

const sql = sqlMessager();

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
    type WordPair {
        japaneseWord: String
        englishWord: String
    }

    type TagList {
      id: String
      tagName: String
    }

    type Query {
        wordList(tagIds: [String]): [WordPair]
        wordTree(tagIds: [String]): String
        tagList: [TagList]
    }

    type Mutation {
        writeWord(englishWord: String!, japaneseWord: String!): String
        clearWordList: String
        seedDatabase: String
    }
`;

const resolvers = {
    Query: {
        wordList: async (parent, args) => {
            return wordList(args);
        },
        wordTree: async (parent, args) => {
            return JSON.stringify(convertToTreeForm(await wordList(args)));
        },
        tagList: async () => {
            return sql('SELECT * FROM tags');
        },
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
        seedDatabase: async () => {
            await seedDatabase();

            return 'Success';
        },
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