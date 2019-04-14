const fs = require('fs');
const SqlString = require('sqlstring');

const { sqlMessager } = require('../sql-messager');

const sql = sqlMessager();

// TODO: Note SQL Injection
const wordList = async (args) => {
    let queryString = `SELECT * from japaneseToEnglishWords`;

    if (args.tagIds && args.tagIds.length >= 1) {
        queryString = SqlString.format(`
            SELECT *
            from        tags
            INNER JOIN  japaneseToEnglishWords_tags
            ON          tags.id = japaneseToEnglishWords_tags.tagsId
            INNER JOIN  japaneseToEnglishWords
            ON          japaneseToEnglishWords_tags.japaneseToEnglishWordsId = japaneseToEnglishWords.id
            WHERE       tags.id = ?
        `, [args.tagIds[0]]);
    }

    return (await sql(queryString))
        .map(row => Object.assign({}, row, { japaneseWord: decodeURI(row.japaneseWord) }));
};

// TODO: Note SQL Injection
const writeWord = async (args) => {
    const englishWord = args.englishWord;
    const japaneseWord = encodeURI(args.japaneseWord);
    
    const writeString = SqlString.format(
        `INSERT INTO japaneseToEnglishWords (japaneseWord, englishWord) VALUES (?, ?)`,
        [japaneseWord, englishWord]
    );
    
    await sql(writeString);
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