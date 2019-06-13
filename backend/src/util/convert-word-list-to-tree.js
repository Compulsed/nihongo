const wordIterator = (format, word, cb) => {
  const normal = () => {
    for(let i = 0; i < word.length; ++i) {
      cb(word[i]);
    }
  }

  const reverse = () => {
    for(let i = word.length - 1; i >= 0; --i) {
      cb(word[i]);
    }
  }

  switch (format) {
    case 'NORMAL': {
      return normal();
    }
    case 'REVERSE': {
      return reverse();
    }
    default:
      return normal();
  }
}

const mergeNodes = (format, node) => {
  if (node.edge || node.children.length === 0) {
    return node;
  }

  if (node.name !== 'root' && node.children.length === 1 && !node.children[0].edge) {
    if (format === 'NORMAL') {
      node.name = node.name + node.children[0].name;
    }
    
    if (format === 'REVERSE') {
      node.name = node.children[0].name + node.name;
    }

    node.children = node.children[0].children;
  }

  node.children = node.children.map(node => mergeNodes(format, node));

  return node;
}

const convertToTreeForm = ({ japaneseWordArray, format, compressed }) => {
    format = format || 'NORMAL';
    compressed = compressed || true;

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
        edge: true,
      }
    });
  
    const recursiveArray = (node) => Object.assign(
      node,
      { children: Object.values(node.children)
        .sort()
        .map(recursiveArray) }
    );

    return compressed
      ? mergeNodes(format, recursiveArray(dict))
      : recursiveArray(dict)
};

module.exports = {
    convertToTreeForm,
};