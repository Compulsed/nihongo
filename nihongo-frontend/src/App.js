import React, { Component } from 'react';
import './App.css';
import { drawTreeData } from './DrawTree';

const fetchWordTree = () => {
  return fetch('http://localhost:3000/graphql', {
    method: 'POST',
    body: JSON.stringify({
      query: `
        query {
          wordTree
        }
      `,
      variables: null,
    })
  })
  .then(treeData => treeData.json())
  .then(result => JSON.parse(result.data.wordTree));
}

class App extends Component {
  componentDidMount() {
    fetchWordTree()
      .then(treeData => drawTreeData(treeData));
  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <div id="tree-container"></div>
        </header>
      </div>
    );
  }
}

export default App;
