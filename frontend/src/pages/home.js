import React, { Component } from 'react';
import { drawTreeData } from '../libs/DrawTree';

const style = {
    width: '100%',
    height: '600px',
};

export class Home extends Component {
    componentDidMount() {
        return fetch('http://localhost:3000/graphql', {
            method: 'POST',
            body: JSON.stringify({
                query: `
                    query {
                        wordTree(tagIds: [0, 1, 2])
                    }
            `,
                variables: null,
            })
        })
        .then(treeData => treeData.json())
        .then(result => JSON.parse(result.data.wordTree))
        .then(treeData => drawTreeData('#tree-container', treeData));
    }

    render() {
        return (
            <div>
                <h1 style={{ fontSize: 50 }}>Language Tree</h1>
                <div style={style} id="tree-container"></div>
            </div>
        );
    }
}