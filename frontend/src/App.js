import React, { Component } from 'react';
import Button from 'antd/lib/button';
import './App.css';

import { drawTreeData } from './libs/DrawTree';

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
  .then(result => JSON.parse(result.data.wordTree))
  .then(treeData => drawTreeData('#tree-container', treeData));
}

const style = {
  width: '500px',
  height: '500px',
};

class App extends Component {
  componentDidMount() {
    fetchWordTree();
  }

  refetchTree() {
    fetchWordTree();
  }

  render() {
    return (
      <div className="App">
        <div style={style} id="tree-container"></div>
        <Button type="primary" onClick={fetchWordTree}>
          Button
        </Button>
      </div>
    );
  }
}

export default App;