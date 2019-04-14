use RANDOMNAME;

DROP TABLE IF EXISTS japaneseToEnglishWords;

CREATE TABLE IF NOT EXISTS japaneseToEnglishWords (
    id INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id),
    japaneseWord VARCHAR(256),
    englishWord VARCHAR(256)
)
ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO japaneseToEnglishWords (japaneseWord, englishWord) VALUES ('わたしわ', 'I');
INSERT INTO japaneseToEnglishWords (japaneseWord, englishWord) VALUES ('くも', 'Cloud');
INSERT INTO japaneseToEnglishWords (japaneseWord, englishWord) VALUES ('むらさき', 'Purple');
INSERT INTO japaneseToEnglishWords (japaneseWord, englishWord) VALUES ('ください', 'Please');
INSERT INTO japaneseToEnglishWords (japaneseWord, englishWord) VALUES ('あお', 'Blue');

SELECT * from japaneseToEnglishWords;