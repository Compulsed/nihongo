import React from 'react';

import { Form, Input, Button, Divider } from 'antd';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class WordInputForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      postingWord: false,
    };
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  addWord(japaneseWord, englishWord) {
    this.setState({ postingWord: true });

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
      })
      .catch(() => {})
      .then(() => {
        this.setState({ postingWord: false });
      });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.addWord(values.japaneseWord, values.englishWord);
      }
    });
  }

  render() {
    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
    } = this.props.form;

    const { postingWord } = this.state;

    // Only show error after a field is touched.
    const userNameError = isFieldTouched('userName') && getFieldError('userName');
    const passwordError = isFieldTouched('password') && getFieldError('password');
    return (
      <div style={{ margin: 40 }}>
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
            <Button
              type="primary"
              htmlType="submit"
              disabled={postingWord || hasErrors(getFieldsError())}
            >
              { postingWord ? 'Posting...' : 'Post New Word' }
            </Button>
          </Form.Item>
        </Form>
      </div>

    );
  }
}

export const WordInput = Form.create({ name: 'horizontal_login' })(WordInputForm);
