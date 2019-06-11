import React, { Component } from 'react';
import { drawTreeData } from '../libs/DrawTree';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import { Select, Radio } from 'antd';

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
    query ($tagIds: [Int], $format: String) {
        wordTree(tagIds: $tagIds, format: $format)
    }
`;

const formatOptions = [
    'NORMAL',
    'REVERSE',
];

export class Home extends Component {
    fetchDrawTree(tagIds, format) {
        if (document.getElementById('tree-container')) {
            document.getElementById('tree-container').innerHTML = ''
        }

        client.query({
            query: WORD_TREE,
            variables: { tagIds: tagIds, format: format },
        })
        .then(data => JSON.parse(data.data.wordTree))
        .then(treeData => drawTreeData('#tree-container', treeData));
    }

    componentDidMount() {
        this.fetchDrawTree();
    }

    onChange(tagValues) {       
        this.fetchDrawTree(
            tagValues.map(string => parseInt(string, 10)),
            'NORMAL'
        );
    }

    render() {
        return (
            <Query query={TAGS}>
                {({ data }) => {
                return (
                    <div>
                        <h1 style={{ fontSize: 50 }}>Language Tree</h1>
                        <Radio.RadioGroup onChange={() => {}} value={1}>
                            <Radio value={1}>A</Radio>
                            <Radio value={2}>B</Radio>
                            <Radio value={3}>C</Radio>
                            <Radio value={4}>D</Radio>
                        </Radio.RadioGroup>

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