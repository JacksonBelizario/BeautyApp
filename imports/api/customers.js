import { Meteor } from 'meteor/meteor';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { UsersCollection, usersRoles } from './users';

export const CustomerTypeDefs = `
type Query {
  customers: [User]
}

type Mutation {
  createCustomer(email: String, password: String, profile: UserProfile): ID
  editCustomer(id: ID, customer: CustomerInput): Boolean
  removeCustomer(id: ID): Boolean
}

input CustomerInput {
    email: String
    password: String
    profile: UserProfile
}

type Profile {
  name: String
  phoneNumber: String
  socialNumber: String
  birthday: String
  gender: String
}

type Email {
  address: String
  verified: String
}

type Address {
  zipcode: String
  street: String
  complement: String
  number: String
  neighborhood: String
  city: String
  state: String
}

`;

export const CustomerResolver = {
  Query: {
    async customers() {
        return UsersCollection.find({ roles : { [Roles.GLOBAL_GROUP]: [usersRoles.CUSTOMER] }}).fetch();
    },
  },

  Mutation: {
    async createCustomer(root, { email, password, profile }) {
        const customerId = Accounts.createUser(
            {
                email,
                password,
                profile,
            }
        );
        Roles.addUsersToRoles(customerId, usersRoles.CUSTOMER, Roles.GLOBAL_GROUP);
        return customerId;
    },
    async editCustomer(root, {id, customer: { profile }}) {
        return UsersCollection.update({ _id: id }, { $set: { profile } });
    },
    async removeCustomer(root, { id }) {
        // retorna a quantidade removida
        return UsersCollection.remove({ _id: id, roles : { [Roles.GLOBAL_GROUP]: [usersRoles.CUSTOMER] } });
    },

  },
};

const EMPLOYEES_QUERY = gql`
  query Customers {
      customers {
          _id
          profile {
            name
            phoneNumber
            socialNumber
            birthday
            gender
          }
          emails {
            address
            verified
          }
      }
  }
`;

export const customersQuery = graphql(EMPLOYEES_QUERY, {
  name: 'customersData',
  options: {
      fetchPolicy: 'cache-and-network',
  }
});

const refetchQueries = [{ query: EMPLOYEES_QUERY }];

export const createCustomerMutation = graphql(
    gql`
    mutation createCustomer($email: String $password: String $profile: UserProfile) {
      createCustomer(email: $email, password: $password, profile: $profile)
    }
  `,
    {
        name: 'createCustomer',
        options: { refetchQueries },
    }
);


export const editCustomerMutation = graphql(
    gql`
      mutation editCustomer($id: ID! $customer: CustomerInput!) {
        editCustomer(id: $id, customer: $customer)
      }
    `,
    {
        name: 'editCustomer',
        options: { refetchQueries },
    }
);


export const removeCustomerMutation = graphql(
    gql`
      mutation removeCustomer($id: ID!) {
        removeCustomer(id: $id)
      }
    `,
    {
        name: 'removeCustomer',
        options: { refetchQueries },
    }
);