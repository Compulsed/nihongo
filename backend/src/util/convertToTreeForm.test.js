const fs = require('fs');

const { convertToTreeForm } = require('./convert-word-list-to-tree');

describe('#convertToTreeForm', () => {
    describe('successful path', () => {
        const wordList = [
            { japaneseWord: 'これ', englishWord: 'That' },
            { japaneseWord: 'それ', englishWord: 'That' },
            { japaneseWord: 'だれ', englishWord: 'Who' },
        ];

        let result;

        beforeEach(() => {
            result = convertToTreeForm(wordList);
        });

        it('should match the saved object', () => {
            expect(result).toMatchObject(resultLoader('regular'));
        });
    });
});

const resultLoader = (path) => {
    return JSON.parse(fs.readFileSync(`./test-results/${path}`));
};

const resultSaver = (path, obj) => {
    fs.writeFileSync(`./test-results/${path}`, JSON.stringify(obj, null, 2));
};