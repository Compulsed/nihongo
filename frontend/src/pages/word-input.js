import React from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
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

class WordInputForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      postingWord: false,
      postingClearWordList: false,
      postingSeedDatabase: false,
      postingTag: false,
      wordListJSON: null,
    };
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
    this.getWordListJSON();
  }

  addTag(tagName) {
    this.setState({ postingTag: true });

    return fetch('http://localhost:3000/graphql', {
        method: 'POST',
        body: JSON.stringify({
          query: `
            mutation ($tagName: String!) {
              createTag(tagName: $tagName)
            }
          `,
          variables: { tagName },
        }),
      })
      .catch(() => {})
      .then(() => {
        this.setState({ postingTag: false });
      });
  }

  addWord(japaneseWord, englishWord, selectedTags) {
    this.setState({ postingWord: true });

    return fetch('http://localhost:3000/graphql', {
        method: 'POST',
        body: JSON.stringify({
          query: `
            mutation($englishWord: String!, $japaneseWord: String!, $tags: [Int]) {
              writeWord(englishWord: $englishWord, japaneseWord: $japaneseWord, tags: $tags)
            }
          `,
          variables: {
            englishWord,
            japaneseWord,
            tags: selectedTags,
          },
        }),
      })
      .catch(() => {})
      .then(() => {
        this.setState({ postingWord: false });
      });
  }

  clearWordList() {
    this.setState({ postingClearWordList: true });

    return fetch('http://localhost:3000/graphql', {
        method: 'POST',
        body: JSON.stringify({
          query: `
            mutation {
              clearWordList
            }
          `,
          variables: null,
        }),
      })
      .catch(() => {})
      .then(() => {
        this.setState({ postingClearWordList: false });
      });
  }

  getWordListJSON() {
    fetch('http://localhost:3000/graphql', {
        method: 'POST',
        body: JSON.stringify({
          query: `
            query {
              wordListJSON
            }
          `,
          variables: null,
        }),
      })
      .then(wordList => wordList.json())
      .then(result => this.setState({ wordListJSON: result.data.wordListJSON }))
      .catch(() => {});
  }


  seedDatabase() {
    this.setState({ postingSeedDatabase: true });

    return fetch('http://localhost:3000/graphql', {
        method: 'POST',
        body: JSON.stringify({
          query: `
            mutation {
              seedDatabase
            }
          `,
          variables: null,
        }),
      })
      .catch(() => {})
      .then(() => {
        this.setState({ postingSeedDatabase: false });
      });
  }



  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.addWord(
          values.japaneseWord,
          values.englishWord,
          this.state.selectedTags.map(a => parseInt(a))
        );
      }
    });
  }

  render() {
    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
    } = this.props.form;

    const { postingWord, postingClearWordList, postingSeedDatabase, postingTag, wordListJSON } = this.state;

    // Only show error after a field is touched.
    const userNameError = isFieldTouched('userName') && getFieldError('userName');
    const passwordError = isFieldTouched('password') && getFieldError('password');
    const tagError = isFieldTouched('tagError') && getFieldError('tagError');

    return (
      <div style={{ margin: 40 }}>
        
        {/* Input New Words */}
        <div>
          <h1 style={{ fontSize: 50 }}>Input New Word</h1>
          <Form layout="inline" onSubmit={this.handleSubmit}>
            <Form.Item
              validateStatus={userNameError ? 'error' : ''}
              help={userNameError || ''}
            >
              {getFieldDecorator('japaneseWord', {
                rules: [{ required: true, message: 'Please input a Japanese Word' }],
              })(
                <Input placeholder="Japanese" />
              )}
            </Form.Item>
            <Form.Item
              validateStatus={passwordError ? 'error' : ''}
              help={passwordError || ''}
            >
              {getFieldDecorator('englishWord', {
                rules: [{ required: true, message: 'Please input an English Word' }],
              })(
                <Input placeholder="English" />
              )}
            </Form.Item>
            <Form.Item>
              <Query query={TAGS}>
                  {({ data }) => {
                    return (
                      <Select
                        mode='multiple'
                        placeholder="Please select tags that match these words"
                        style={{ minWidth: '200px' }}
                        onChange={(selectedTags) => { this.setState({ selectedTags })}}
                      >
                        { (data.tagList || []).map(tagItem => 
                          <Option key={tagItem.id}>{tagItem.tagName}</Option>
                        )}                   
                      </Select>
                    );
                  }}
              </Query>
            </Form.Item>
            <div>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={postingWord || hasErrors(getFieldsError())}
                >
                  { postingWord ? 'Posting...' : 'Post New Word' }
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>

        {/* Input New Words */}
        <div>
          <h1 style={{ fontSize: 50 }}>Input New Tag</h1>
          <Input placeholder="New Tag" onChange={e => this.setState({ tagName: e.target.value}) } />
          <Button type="primary" onClick={() => this.addTag(this.state.tagName)}>Create Tag</Button>
        </div>

        { /* Button Actions */ }
        <div style={{ marginTop: 20 }}>
          <h1 style={{ fontSize: 50 }}>Options</h1>
          <Button type="primary" onClick={() => this.clearWordList()}>
            { postingClearWordList ? 'Deleting...' : 'Delete Word List' }
          </Button>
          <Button style={{marginLeft: 20}} type="primary" onClick={() => this.seedDatabase()}>
            { postingSeedDatabase ? 'Seeding...' : 'Seed Database' }
          </Button>
        </div>

        <div style={{ marginTop: 20 }}>
          <pre>{ wordListJSON }</pre>
        </div>        
      </div>

    );
  }
}

export const WordInput = Form.create({ name: 'horizontal_login' })(WordInputForm);
