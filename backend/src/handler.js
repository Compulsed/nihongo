const { sqlMessager } = require('./sql-messager');
const { ApolloServer, gql } = require('apollo-server-lambda');

const sql = sqlMessager();

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
    type wordPair {
        japaneseWord: String
        englishWord: String
    }

    type Query {
        wordList: [wordPair]
    }

    type Mutation {
        writeWord(englishWord: String!, japaneseWord: String!): String
    }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    wordList: async () => {
        (await sql(`select * from japaneseToEnglishWords;`))
            .map(row => Object.assign({}, row, { japaneseWord: decodeURI(row.japaneseWord) }));
    }
  },

  Mutation: {
    writeWord: async (parent, args, context) => {
        const englishWord = args.englishWord;
        const japaneseWord = encodeURI(args.japaneseWord);
        
        await sql(`
            INSERT INTO japaneseToEnglishWords
                (japaneseWord, englishWord)
            VALUES ('${japaneseWord}', '${englishWord}')
        `);

        return 'Success';
    }
        
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