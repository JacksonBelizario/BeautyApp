import { Meteor } from 'meteor/meteor';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

export const UsersCollection = Meteor.users;

Object.assign(UsersCollection, {
  save({ userId, user }) {
    if (!userId) {
      return this.insert({ ...user });
    }
    this.update(userId, { $set: { ...user } });
    return this.findOne(userId);
  },
});

export const UserTypeDefs = `
type Query {
  user : User
  employees: [User]
}

type Mutation {
  editUser(user: UserInput!): Boolean
}

input UserInput {
  profile: UserProfile
  address: AddressInput
}

input UserProfile {
  name: String
  phoneNumber: String
  socialNumber: String
  birthday: String
  gender: String
}

type User {
  _id: ID
  profile: Profile
  emails: [Email]
  address: Address
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

input AddressInput {
  zipcode: String
  street: String
  complement: String
  number: String
  neighborhood: String
  city: String
  state: String
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

export const usersRoles = {
  EMPLOYEE: 'employee',
  CUSTOMER: 'customer',
};

export const UserResolver = {
  Query: {
    async user(root, args, { userId }) {
      return UsersCollection.findOne(userId);
    },
  },

  Mutation: {
    async editUser(root, { user }, { userId }) {
      return UsersCollection.update({ _id: userId }, { $set: { ...user } });
    },
  },

  User: {
    // async address({ _id }) {
    //   return AddressesCollection.findOne({ userId: _id });
    // },
  },
};

export const editUser = graphql(
    gql`
      mutation editUser($user: UserInput!) {
        editUser(user: $user)
      }
    `,
    { name: 'editUser' }
  );

  const USER_QUERY = gql`
    query User {
      user {
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
        address {
          zipcode
          street
          complement
          number
          neighborhood
          city
          state
        }
      }
    }
  `;

  export const userQuery = graphql(USER_QUERY, {
    name: 'userData',
    options: {
      fetchPolicy: 'cache-and-network',
    },
    props: data => {
      return data;
    },
  });
