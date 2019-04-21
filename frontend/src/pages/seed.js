import React from 'react';
import { gql } from 'apollo-boost';
import { Mutation } from 'react-apollo';
import { Form , Button } from 'antd';

const SEED_DATABASE = gql`
  mutation {
    seedDatabase
  }
`;

class SeedDatabase extends React.Component {
  render() {
    return (
      <div style={{ margin: 40 }}>
        <div style={{ marginTop: 20 }}>
          <h1 style={{ fontSize: 50 }}>Options</h1>
          <Mutation mutation={SEED_DATABASE}>
            {(seedDatabase, { loading }) => (
              <Button disabled={loading} type="primary" onClick={seedDatabase}>
                { loading ? 'Seeding...' : 'Seed Database' }
              </Button>
            )}
          </Mutation>
        </div>
      </div>
    );
  }
}

export const Seed = SeedDatabase;
