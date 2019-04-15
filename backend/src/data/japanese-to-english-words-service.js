const fs = require('fs');
const SqlString = require('sqlstring');

const { sqlMessager } = require('../sql-messager');

const sql = sqlMessager();

const knex = require('knex')({client: 'mysql'})

// TODO: Note SQL Injection
const wordList = async (args) => {
    queryString = knex('japaneseToEnglishWords')
        .innerJoin('japaneseToEnglishWords_tags', 'japaneseToEnglishWords.id', 'japaneseToEnglishWords_tags.japaneseToEnglishWordsId')
        .innerJoin('tags','tags.id', 'japaneseToEnglishWords_tags.tagsId')
        .toString();

    if (args.tagIds && args.tagIds.length >= 1) {
        queryString = knex('tags')
            .innerJoin('japaneseToEnglishWords_tags', 'tags.id', 'japaneseToEnglishWords_tags.tagsId')
            .innerJoin('japaneseToEnglishWords', 'japaneseToEnglishWordsId', 'japaneseToEnglishWords.id')
            .whereIn('tags.id', args.tagIds)
            .toString();
    }

    return (await sql(queryString))
        .map(row => Object.assign({}, row, { japaneseWord: decodeURI(row.japaneseWord) }));
};

// TODO: Note SQL Injection
const writeWord = async (args) => {
    const englishWord = args.englishWord;
    const japaneseWord = encodeURI(args.japaneseWord);
    const tags = args.tags;
    
    const writeStringWords = SqlString.format(
        `
            START TRANSACTION;

            INSERT INTO japaneseToEnglishWords (japaneseWord, englishWord)
            VALUES (?, ?);
            
            INSERT INTO japaneseToEnglishWords_tags (japaneseToEnglishWordsId, tagsId)
            VALUES (LAST_INSERT_ID(), ?);

            COMMIT;
        `,
        [japaneseWord, englishWord, tags[0]]
    );
    
    await sql(writeStringWords);
};

const clearWordList = async () => {
    return await sql(`DELETE FROM japaneseToEnglishWords;`);
};

const seedDatabase = async () => {
    return await sql(fs.readFileSync('./sql/initial.sql').toString());
};

module.exports = {
    wordList,
    writeWord,
    clearWordList,
    seedDatabase,
};