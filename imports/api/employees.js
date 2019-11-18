import { Meteor } from 'meteor/meteor';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { UsersCollection, usersRoles } from './users';

export const EmployeeTypeDefs = `
type Query {
  employees: [User]
}

type Mutation {
  createEmployee(email: String, password: String, profile: UserProfile): ID
  editEmployee(id: ID, employee: EmployeeInput): Boolean
  removeEmployee(id: ID): Boolean
}

input EmployeeInput {
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

export const EmployeeResolver = {
  Query: {
    async employees() {
        return UsersCollection.find({ roles : { [Roles.GLOBAL_GROUP]: [usersRoles.EMPLOYEE] }}).fetch();
    },
  },

  Mutation: {
    async createEmployee(root, { email, password, profile }) {
        const employeeId = Accounts.createUser(
            {
                email,
                password,
                profile,
            }
        );
        Roles.addUsersToRoles(employeeId, usersRoles.EMPLOYEE, Roles.GLOBAL_GROUP);
        return employeeId;
    },
    async editEmployee(root, {id, employee: { profile }}) {
        return UsersCollection.update({ _id: id }, { $set: { profile } });
    },
    async removeEmployee(root, { id }) {
        // retorna a quantidade removida
        return UsersCollection.remove({ _id: id, roles : { [Roles.GLOBAL_GROUP]: [usersRoles.EMPLOYEE] } });
    },

  },
};

const EMPLOYEES_QUERY = gql`
  query Employees {
      employees {
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

export const employeesQuery = graphql(EMPLOYEES_QUERY, {
  name: 'employeesData',
  options: {
      fetchPolicy: 'cache-and-network',
  }
});

const refetchQueries = [{ query: EMPLOYEES_QUERY }];

export const createEmployeeMutation = graphql(
    gql`
    mutation createEmployee($email: String $password: String $profile: UserProfile) {
      createEmployee(email: $email, password: $password, profile: $profile)
    }
  `,
    {
        name: 'createEmployee',
        options: { refetchQueries },
    }
);


export const editEmployeeMutation = graphql(
    gql`
      mutation editEmployee($id: ID! $employee: EmployeeInput!) {
        editEmployee(id: $id, employee: $employee)
      }
    `,
    {
        name: 'editEmployee',
        options: { refetchQueries },
    }
);


export const removeEmployeeMutation = graphql(
    gql`
      mutation removeEmployee($id: ID!) {
        removeEmployee(id: $id)
      }
    `,
    {
        name: 'removeEmployee',
        options: { refetchQueries },
    }
);