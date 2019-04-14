const convertToTreeForm = (japaneseWordArray) => {
    const dict = {
      name: 'root',
      children: {},
    };
  
    japaneseWordArray.forEach(({ japaneseWord, englishWord }) => {
      let currentNode = dict;
      
      for(let i = 0; i < japaneseWord.length; ++i) {
        const char = japaneseWord[i];
        
        if (!currentNode.children[char]) {
          currentNode.children[char] = {
            name: char,
            children: {},
          };
        }
  
        currentNode = currentNode.children[char];
      }
  
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