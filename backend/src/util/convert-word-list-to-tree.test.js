const fs = require('fs');
const crypto = require('crypto');

const { convertToTreeForm } = require('./convert-word-list-to-tree');

describe('#convertToTreeForm', () => {
    describe('normal successful path compressed', () => {
        const format = 'NORMAL';

        const japaneseWordArray = [
            { japaneseWord: 'これ', englishWord: 'That' },
            { japaneseWord: 'それ', englishWord: 'That' },
            { japaneseWord: 'それそれ', englishWord: 'ThatThat' },
            { japaneseWord: 'だれ', englishWord: 'Who' },
        ];

        const args = { japaneseWordArray, format };

        let result;

        beforeEach(() => {
            result = convertToTreeForm(args);
        });

        it('should match the saved object', () => {
            expect(result).toMatchObject(resultLoader(hash(args)));
        });
    });

    describe('reverse successful path compressed', () => {
        const format = 'REVERSE';

        const japaneseWordArray = [
            { japaneseWord: 'これ', englishWord: 'That' },
            { japaneseWord: 'それ', englishWord: 'That' },
            { japaneseWord: 'それそれ', englishWord: 'ThatThat' },
            { japaneseWord: 'だれ', englishWord: 'Who' },
        ];

        const args = { japaneseWordArray, format };

        let result;

        beforeEach(() => {
            result = convertToTreeForm(args);
        });

        it('should match the saved object', () => {
            expect(result).toMatchObject(resultLoader(hash(args)));
        });
    });

    describe('reverse successful path not compressed', () => {
        const format = 'REVERSE';
        const compressed = false;

        const japaneseWordArray = [
            { japaneseWord: 'これ', englishWord: 'That' },
            { japaneseWord: 'それ', englishWord: 'That' },
            { japaneseWord: 'それそれ', englishWord: 'ThatThat' },
            { japaneseWord: 'だれ', englishWord: 'Who' },
        ];

        const args = { japaneseWordArray, format, compressed };

        let result;

        beforeEach(() => {
            result = convertToTreeForm(args);
        });

        it('should match the saved object', () => {
            expect(result).toMatchObject(resultLoader(hash(args)));
        });
    });
});

const resultLoader = (path) => {
    return JSON.parse(fs.readFileSync(`./test-results/${path}`));
};

// resultSaver(format, result);
const resultSaver = (path, obj) => {
    fs.writeFileSync(`./test-results/${path}`, JSON.stringify(obj, null, 2));
};

const hash = json => crypto
    .createHash('md5')
    .update(JSON.stringify(json))
    .digest('hex');