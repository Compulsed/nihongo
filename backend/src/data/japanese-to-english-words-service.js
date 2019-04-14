const fs = require('fs');
const SqlString = require('sqlstring');

const { sqlMessager } = require('../sql-messager');

const sql = sqlMessager();

// TODO: Note SQL Injection
const wordList = async () => {
    const queryString = SqlString.format(`
        SELECT *
        from
            japaneseToEnglishWords
        INNER JOIN
            japaneseToEnglishWords_tags
        ON
            japaneseToEnglishWords.id = japaneseToEnglishWords_tags.japaneseToEnglishWordsId
        INNER JOIN tags
        ON
            japaneseToEnglishWords_tags.tagsId = tags.id
        WHERE tags.id = ?
    `, [1]);

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