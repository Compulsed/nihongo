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
  .then(result => JSON.parse(result.data.wordTree));
}

const style = {
  width: '1000px',
  height: '1000px',
};

class App extends Component {
  componentDidMount() {
    fetchWordTree()
      .then(treeData => drawTreeData('#tree-container', treeData));
  }


  render() {
    return (
      <div className="App">
        <Button type="primary">Button</Button>
        <div style={style} id="tree-container"></div>
      </div>
    );
  }
}

export default App;