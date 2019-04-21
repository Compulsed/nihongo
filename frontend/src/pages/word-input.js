import React from 'react';
import { gql } from 'apollo-boost';
import { Query, Mutation } from 'react-apollo';
import { Form, Input, Button } from 'antd';
import { Select } from 'antd';

const Option = Select.Option;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const TAGS = gql`
  query {
    tagList {
        id
        tagName
    }
  }
`;

const SEED_DATABASE = gql`
  mutation {
    seedDatabase
  }
`;

const CLEAR_WORDLIST = gql`
  mutation {
    clearWordList
  }
`;

const WRITE_WORD = gql`
  mutation($englishWord: String!, $japaneseWord: String!, $tags: [Int]) {
    writeWord(englishWord: $englishWord, japaneseWord: $japaneseWord, tags: $tags)
}`;

const WORDLIST = gql`
  query {
    wordListJSON
  }
`;

const CREATE_TAG = gql`
  mutation ($tagName: String!) {
    createTag(tagName: $tagName)
  }
`;

class WordInputForm extends React.Component {
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  handleSubmit = (e, addWord, selectedTags) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const data = new FormData(e.target);

        addWord({
          variables: {
            englishWord: data.get('englishWord'),
            japaneseWord: data.get('japaneseWord'),
            tags: (selectedTags || []).map(a => parseInt(a)),
          },
        });
      }
    });
  }

  render() {
    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
    } = this.props.form;

    // Only show error after a field is touched.
    const japaneseWordError = isFieldTouched('japaneseWord') && getFieldError('japaneseWord');
    const englishWordError = isFieldTouched('englishWord') && getFieldError('englishWord');
    const tagError = isFieldTouched('tagError') && getFieldError('tagError');

    return (
      <div style={{ margin: 40 }}>
        
        {/* Input New Words */}
        <div>
          <h1 style={{ fontSize: 50 }}>Input New Word</h1>
          <Mutation mutation={WRITE_WORD}> 
            { (addWord, { loading }) => (
              <Form layout="inline" onSubmit={e => this.handleSubmit(e, addWord, this.state.selectedTags)}>
                <Form.Item
                  validateStatus={japaneseWordError ? 'error' : ''}
                  help={japaneseWordError || ''}
                >
                  {getFieldDecorator('japaneseWord', {
                    rules: [{ required: true, message: 'Please input a Japanese Word' }],
                  })(
                    <Input name="japaneseWord" placeholder="Japanese" />
                  )}
                </Form.Item>
                <Form.Item
                  validateStatus={englishWordError ? 'error' : ''}
                  help={englishWordError || ''}
                >
                  {getFieldDecorator('englishWord', {
                    rules: [{ required: true, message: 'Please input an English Word' }],
                  })(
                    <Input name="englishWord" placeholder="English" />
                  )}
                </Form.Item>
                <Form.Item>
                  <Query query={TAGS}>
                      {({ data }) => (
                        <Select
                          mode='multiple'
                          name='tags'
                          placeholder="Please select tags that match these words"
                          style={{ minWidth: '200px' }}
                          onChange={selectedTags => this.setState({ selectedTags: selectedTags })}
                        >
                          { (data.tagList || []).map(tagItem => 
                            <Option key={tagItem.id}>{tagItem.tagName}</Option>
                          )}                   
                        </Select>
                      )}
                  </Query>
                </Form.Item>
                <div>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={loading || hasErrors(getFieldsError())}
                    >
                      { loading ? 'Posting...' : 'Post New Word' }
                    </Button>
                  </Form.Item>
                </div>
              </Form>
              )
            }
          </Mutation>
        </div>

        {/* Input New Words */}
        <div>
          <h1 style={{ fontSize: 50 }}>Create Tag</h1>
          <Mutation mutation={CREATE_TAG}>
            {(createTag, { loading }) => (
              <>
                <Input placeholder="New Tag" onChange={e => this.setState({ tagName: e.target.value}) } />
                <Button disabled={loading} type="primary" onClick={() => createTag({ variables: { tagName: this.state.tagName } })}>
                  { loading ? 'Creating Tag...' : 'Create Tag' }
                </Button>
              </>
            )}
          </Mutation>
        </div>

        { /* Button Actions */ }
        <div style={{ marginTop: 20 }}>
          <h1 style={{ fontSize: 50 }}>Options</h1>
          <Mutation mutation={SEED_DATABASE}>
            {(seedDatabase, { loading }) => (
              <Button disabled={loading} type="primary" onClick={seedDatabase}>
                { loading ? 'Seeding...' : 'Seed Database' }
              </Button>
            )}
          </Mutation>
          <Mutation mutation={CLEAR_WORDLIST}>
            {(clearWordList, { loading }) => (
                <Button disabled={loading} style={{ marginLeft: '20px' }} type="primary" onClick={clearWordList}>
                { loading ? 'Deleting...' : 'Delete Word List' }
              </Button>
            )}
          </Mutation>
        </div>

        <div style={{ marginTop: 20 }}>
          <Query query={WORDLIST}>
            {({ data }) => (
              <pre>{ data.wordListJSON }</pre>
            )}
          </Query>
        </div>
      </div>
    );
  }
}

export const WordInput = Form.create({ name: 'horizontal_login' })(WordInputForm);
