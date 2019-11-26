import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { UsersCollection } from "./users";
import { ServicesCollection } from "./services";

export const EventsCollection = new Mongo.Collection("events");

export const EventTypeDefs = `
type Query {
    event(id: ID): Event,
    events: [Event]
}

type Mutation {
    createEvent(event: EventInput): ID
    editEvent(id: ID, event: EventInput): Boolean
    removeEvent(id: ID): Boolean
}

type Event {
    _id: ID!
    title: String
    desc: String
    start: String
    end: String
    status: Int
    customer: User
    employee: User
    service: Service
}

input EventInput {
    title: String
    desc: String
    start: String!
    end: String!
    status: Int
    customerId: String!
    employeeId: String!
    serviceId: String!
}
`;

export const EventResolver = {
    Query: {
        async event(root, {id}) {
            return EventsCollection.findOne({_id: id});
        },
        async events() {
            return EventsCollection.find().fetch();
        },
    },

    Mutation: {
        async createEvent(root, {event}) {
            return EventsCollection.insert(event);
        },

        async editEvent(root, {id, event}) {
            return EventsCollection.update({ _id: id }, { $set: event });
        },

        async removeEvent(root, {id}) {
            return EventsCollection.remove({_id: id});
        }
    },

    Event: {
        async customer({customerId}) {
            return UsersCollection.findOne({ _id: customerId });
        },
        async employee({employeeId}) {
            return UsersCollection.findOne({ _id: employeeId });
        },
        async service({serviceId}) {
            return ServicesCollection.findOne({ _id: serviceId });
        },
    },
};

const EVENTS_QUERY = gql`
    query Events {
        events {
            _id
            title
            desc
            start
            end
            status
            customer {
                _id
                profile {
                  name
                }
            }
            employee {
                _id
                profile {
                  name
                }
            }
            service {
                _id
                name
                amount
                duration
            }
        }
    }
`;

export const eventsQuery = graphql(EVENTS_QUERY, {
  name: 'eventsData',
  options: {
      fetchPolicy: 'cache-and-network',
  }
});

const refetchQueries = [{ query: EVENTS_QUERY }];

export const createEventMutation = graphql(
    gql`
    mutation createEvent($event: EventInput) {
        createEvent(event: $event)
    }
  `,
    {
        name: 'createEvent',
        options: { refetchQueries },
    }
);


export const editEventMutation = graphql(
    gql`
      mutation editEvent($id: ID! $event: EventInput!) {
        editEvent(id: $id, event: $event)
      }
    `,
    {
        name: 'editEvent',
        options: { refetchQueries },
    }
);


export const removeEventMutation = graphql(
    gql`
      mutation removeEvent($id: ID!) {
        removeEvent(id: $id)
      }
    `,
    {
        name: 'removeEvent',
        options: { refetchQueries },
    }
);