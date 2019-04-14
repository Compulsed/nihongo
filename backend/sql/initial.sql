use RANDOMNAME;

-- japaneseToEnglishWords
DROP TABLE IF EXISTS japaneseToEnglishWords_tags;
DROP TABLE IF EXISTS japaneseToEnglishWords;
DROP TABLE IF EXISTS tags;

CREATE TABLE IF NOT EXISTS japaneseToEnglishWords (
    id INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id),
    japaneseWord VARCHAR(256),
    englishWord VARCHAR(256)
)
ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO japaneseToEnglishWords (japaneseWord, englishWord) VALUES ('%E3%82%8F%E3%81%9F%E3%81%97%E3%82%8F', 'I');
INSERT INTO japaneseToEnglishWords (japaneseWord, englishWord) VALUES ('%E3%81%8F%E3%82%82', 'Cloud');
INSERT INTO japaneseToEnglishWords (japaneseWord, englishWord) VALUES ('%E3%82%80%E3%82%89%E3%81%95%E3%81%8D', 'Purple');
INSERT INTO japaneseToEnglishWords (japaneseWord, englishWord) VALUES ('%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84', 'Please');
INSERT INTO japaneseToEnglishWords (japaneseWord, englishWord) VALUES ('%E3%81%82%E3%81%8A', 'Blue');

-- tags
CREATE TABLE IF NOT EXISTS tags (
    id INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id),
    tagName VARCHAR(256)
)
ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO tags (tagName) VALUES ('Lesson 1');
INSERT INTO tags (tagName) VALUES ('Lesson 2');
INSERT INTO tags (tagName) VALUES ('Lesson 3');

-- japaneseToEnglishWords_tags
CREATE TABLE IF NOT EXISTS japaneseToEnglishWords_tags (
    japaneseToEnglishWordsId    INT NOT NULL,
    tagsId                      INT NOT NULL,

    CONSTRAINT fk_japaneseToEnglishWordsId
    FOREIGN KEY (japaneseToEnglishWordsId) REFERENCES japaneseToEnglishWords(id),

    CONSTRAINT fk_tagsId
    FOREIGN KEY (tagsId) REFERENCES tags(id)
)
ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO japaneseToEnglishWords_tags (japaneseToEnglishWordsId, tagsId) VALUES (1, 1);
INSERT INTO japaneseToEnglishWords_tags (japaneseToEnglishWordsId, tagsId) VALUES (2, 1);
INSERT INTO japaneseToEnglishWords_tags (japaneseToEnglishWordsId, tagsId) VALUES (3, 2);
INSERT INTO japaneseToEnglishWords_tags (japaneseToEnglishWordsId, tagsId) VALUES (4, 3);
INSERT INTO japaneseToEnglishWords_tags (japaneseToEnglishWordsId, tagsId) VALUES (5, 3);

-- SELECT * from japaneseToEnglishWords;
SELECT
    *
from
	japaneseToEnglishWords
INNER JOIN
	japaneseToEnglishWords_tags
ON japaneseToEnglishWords.id = japaneseToEnglishWords_tags.japaneseToEnglishWordsId
INNER JOIN
	tags
ON japaneseToEnglishWords_tags.tagsId = tags.id
WHERE tags.id = 1