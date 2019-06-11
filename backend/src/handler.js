const { ApolloServer, gql } = require('apollo-server-lambda');

const { wordList, writeWord, clearWordList, seedDatabase } = require('./data/japanese-to-english-words-service');
const { convertToTreeForm } = require('./util/convert-word-list-to-tree');
const { sqlMessager } = require('./sql-messager');

const sql = sqlMessager();

const knex = require('knex')({client: 'mysql'})

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
        wordList(tagIds: [Int]): [WordPair]
        wordListJSON(tagIds: [Int]): String
        wordTree(tagIds: [Int], format: String): String
        tagList: [TagList]
    }

    type Mutation {
        writeWord(englishWord: String!, japaneseWord: String!, tags: [Int]): String
        createTag(tagName: String!): String
        clearWordList: String
        seedDatabase: String
    }
`;

const resolvers = {
    Query: {
        wordList: async (parent, args) => {
            return wordList(args);
        },
        wordListJSON: async (parent, args) => {
            return JSON.stringify(await wordList(args), null, 2);
        },
        wordTree: async (parent, args) => {
            const opts = {
                format: args.format || 'NORMAL',
            };

            return JSON.stringify(convertToTreeForm(await wordList(args), opts));
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
        createTag: async (parent, { tagName }, context) => {
            const insertString = knex('tags')
                .insert({ tagName })
                .toString();

            await sql(insertString);

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
    engine: {
        apiKey: process.env.APOLLO_ENGINE_KEY,
    }
});

const handler = (event, context, callback) => {
    console.log(JSON.stringify({ event, context }));

    const handler = server.createHandler({
        cors: {
            origin: '*'
        },
    });

    handler(event, context, callback);
};

module.exports = { handler };