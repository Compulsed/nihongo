import React, { Component } from 'react';
import { drawTreeData } from '../libs/DrawTree';

import { Select } from 'antd';

const Option = Select.Option;

const style = {
    width: '100%',
    height: '600px',
    marginTop: '20px'
};

export class Home extends Component {
    constructor(...args) {
        super(...args);

        this.state = {
            tagList: null
        };
    }

    fetchDrawTree(tagIds) {
        if (document.getElementById('tree-container')) {
            document.getElementById('tree-container').innerHTML = ''
        }

        return fetch('http://localhost:3000/graphql', {
            method: 'POST',
            body: JSON.stringify({
                query: `
                    query ($tagIds: [Int]) {
                        wordTree(tagIds: $tagIds)
                    }
                `,
                variables: { tagIds: tagIds },
            })
        })
        .then(treeData => treeData.json())
        .then(result => JSON.parse(result.data.wordTree))
        .then(treeData => drawTreeData('#tree-container', treeData));
    }

    fetchTags() {
        return fetch('http://localhost:3000/graphql', {
            method: 'POST',
            body: JSON.stringify({
                query: `
                    query {
                        tagList {
                            id
                            tagName
                        }
                    }
            `,
                variables: null,
            })
        })
        .then(treeData => treeData.json())
        .then(result => this.setState({ tagList: result.data.tagList }));
    }

    componentDidMount() {
        this.fetchDrawTree();
        this.fetchTags()
    }

    onChange(tagValues) {       
        this.fetchDrawTree(tagValues.map(string => parseInt(string, 10)));
    }

    render() {
        const { tagList } = this.state;

        return (
            <div>
                <h1 style={{ fontSize: 50 }}>Language Tree</h1>
                <Select
                    mode='multiple'
                    style={{ width: '100%' }}
                    placeholder="Please select"
                    onChange={(...args) => this.onChange(...args)}
                >
                    { (tagList || []).map(tagItem => 
                        <Option key={tagItem.id}>{tagItem.tagName}</Option>
                    )}                   
                </Select>
                <div style={style} id="tree-container"></div>
            </div>
        );
    }
}