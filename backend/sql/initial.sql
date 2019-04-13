use RANDOMNAME;

DROP TABLE IF EXISTS japaneseToEnglishWords;

CREATE TABLE IF NOT EXISTS japaneseToEnglishWords (
    id INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id),
    japanese_word VARCHAR(256),
    english_word VARCHAR(256)
)
ENGINE=MyISAM;

INSERT INTO japaneseToEnglishWords (japanese_word, english_word) VALUES ('わたしわ', 'I');
INSERT INTO japaneseToEnglishWords (japanese_word, english_word) VALUES ('くも', 'Cloud');
INSERT INTO japaneseToEnglishWords (japanese_word, english_word) VALUES ('むらさき', 'Purple');
INSERT INTO japaneseToEnglishWords (japanese_word, english_word) VALUES ('ください', 'Please');
INSERT INTO japaneseToEnglishWords (japanese_word, english_word) VALUES ('あお', 'Blue');