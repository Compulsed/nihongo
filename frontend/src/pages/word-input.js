import React, { Component } from 'react';
import { Button } from 'antd'

export class WordInput extends Component {
    addWord(japaneseWord = 'わたしわ', englishWord = 'X') {
      return fetch('http://localhost:3000/graphql', {
          method: 'POST',
          body: JSON.stringify({
            query: `
              mutation($englishWord: String!, $japaneseWord: String!) {
                writeWord(englishWord: $englishWord, japaneseWord: $japaneseWord)
              }
            `,
            variables: {
              englishWord,
              japaneseWord
            },
          }),
        });
    }
  
    render() {
      return (
        <div>
          <h1 style={{fontSize: 50}}>Input Word</h1>
          <Button onClick={() => this.addWord()}>Post New Word</Button>
        </div>
      );
    }
};