const { sqlMessager } = require('../sql-messager');

const sql = sqlMessager();

const wordList = async () => {
    return (await sql(`select * from japaneseToEnglishWords;`))
        .map(row => Object.assign({}, row, { japaneseWord: decodeURI(row.japaneseWord) }));
}

const writeWord = async (args) => {
    const englishWord = args.englishWord;
    const japaneseWord = encodeURI(args.japaneseWord);
    
    await sql(`
        INSERT INTO japaneseToEnglishWords
            (japaneseWord, englishWord)
        VALUES ('${japaneseWord}', '${englishWord}')
    `);
}

module.exports = {
    wordList,
    writeWord,
};