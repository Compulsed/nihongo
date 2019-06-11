const wordIterator = (format, word, cb) => {
  switch (format) {
    case 'NORMAL': {
      for(let i = 0; i < word.length; ++i) {
        cb(word[i]);
      }
    }
    case 'REVERSE': {
      for(let i = word.length - 1; i > 0; --i) {
        cb(word[i]);
      }
    }
  }
}

const convertToTreeForm = (japaneseWordArray, { format }) => {
    const dict = {
      name: 'root',
      children: {},
    };
  
    japaneseWordArray.forEach(({ japaneseWord, englishWord }) => {
      let currentNode = dict;
      
      wordIterator(format, japaneseWord, char => {
        if (!currentNode.children[char]) {
          currentNode.children[char] = {
            name: char,
            children: {},
          };
        }
  
        currentNode = currentNode.children[char];

      });

      currentNode.children[englishWord] = {
        name: `(${japaneseWord}, ${englishWord})`,
        children: {},
      }
    });
  
    const recursiveArray = (node) => Object.assign(
      node,
      { children: Object.values(node.children)
        .sort()
        .map(recursiveArray) }
    );
  
    return recursiveArray(dict);
};

module.exports = {
    convertToTreeForm,
};