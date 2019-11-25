import { Mongo } from 'meteor/mongo';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

export const ServicesCollection = new Mongo.Collection('services');

//TODO: adicionar company_id

export const ServicesTypeDefs = `
type Query {
    services: [Service]
    service(id: String): Service
    searchServices(filter: String): [Service]
}

type Mutation {
    createService(service: ServiceInput): ID
    editService(id: ID, service: ServiceInput): Boolean
    removeService(id: ID): Boolean
}

input ServiceInput {
    name: String
    amount: Float
    duration: Float
}

type Service {
    _id: ID
    name: String
    amount: Float
    duration: Float
}

`;

export const ServicesResolver = {
    Query: {
        async services() {
            return ServicesCollection.find().fetch();
        },
        async service(root, { id }) {
            return ServicesCollection.findOne({ _id: id });
        },
        async searchServices(root, {filter}) {
            let filterRegex = new RegExp(filter, "i");
            
            return ServicesCollection.find({ 'name': filterRegex });
        },
    },

    Mutation: {
        async createService(root, {service}) {
            // retorna o id
            return ServicesCollection.insert(service);
        },

        async editService(root, {id, service}) {
            return ServicesCollection.update({ _id: id }, { $set: service });
        },
        async removeService(root, { id }) {
            // retorna a quantidade removida
            return ServicesCollection.remove({ _id: id });
        },

    },

};



const SERVICE_QUERY = gql`
  query service($id: String!) {
    service(id: $id) {
      _id
      name
      amount
      duration
    }
  }
`;

const SERVICES_QUERY = gql`
    query Services {
        services {
            _id
            name
            amount
            duration
        }
    }
  `;

export const servicesQuery = graphql(SERVICES_QUERY, {
    name: 'servicesData',
    options: {
        fetchPolicy: 'cache-and-network',
    }
});

const refetchQueries = [{ query: SERVICES_QUERY }];

export const createServiceMutation = graphql(
    gql`
    mutation createService($service: ServiceInput) {
        createService(service: $service)
    }
  `,
    {
        name: 'createService',
        options: { refetchQueries },
    }
);


export const editServiceMutation = graphql(
    gql`
      mutation editService($id: ID! $service: ServiceInput!) {
        editService(id: $id, service: $service)
      }
    `,
    {
        name: 'editService',
        options: { refetchQueries },
    }
);


export const removeServiceMutation = graphql(
    gql`
      mutation removeService($id: ID!) {
        removeService(id: $id)
      }
    `,
    {
        name: 'removeService',
        options: { refetchQueries },
    }
);

export const SERVICES_SEARCH = gql`
  query searchServices($filter: String) {
    searchServices(filter: $filter) {
        _id
        name
        amount
        duration
    }
  }
`;