import React, { Component } from 'react';
import { drawTreeData } from '../libs/DrawTree';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import { Select } from 'antd';

import { client } from '../services/apollo-client';

const Option = Select.Option;

const style = {
    width: '100%',
    height: '600px',
    marginTop: '20px'
};

const TAGS = gql`
    query {
        tagList {
            id
            tagName
        }
    }
`;

const WORD_TREE = gql`
    query ($tagIds: [Int]) {
        wordTree(tagIds: $tagIds)
    }
`;

export class Home extends Component {
    fetchDrawTree(tagIds) {
        if (document.getElementById('tree-container')) {
            document.getElementById('tree-container').innerHTML = ''
        }

        client.query({
            query: WORD_TREE,
            variables: { tagIds: tagIds }
        })
        .then(data => JSON.parse(data.data.wordTree))
        .then(treeData => drawTreeData('#tree-container', treeData));
    }

    componentDidMount() {
        this.fetchDrawTree();
    }

    onChange(tagValues) {       
        this.fetchDrawTree(tagValues.map(string => parseInt(string, 10)));
    }

    render() {
        return (
            <Query query={TAGS}>
                {({ data }) => {
                return (
                    <div>
                        <h1 style={{ fontSize: 50 }}>Language Tree</h1>
                        <Select
                            mode='multiple'
                            style={{ width: '100%' }}
                            placeholder="Please select"
                            onChange={(...args) => this.onChange(...args)}
                        >
                            { (data.tagList || []).map(tagItem => 
                                <Option key={tagItem.id}>{tagItem.tagName}</Option>
                            )}                   
                        </Select>
                        <div style={style} id="tree-container"></div>
                    </div>
                );
            }}
            </Query>
        );
    }
}