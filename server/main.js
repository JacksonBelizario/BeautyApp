import { Meteor } from 'meteor/meteor';
import { makeExecutableSchema } from 'graphql-tools';
import { getSchema, load } from 'graphql-load';
import { setup } from 'meteor/swydo:ddp-apollo';
import { UserTypeDefs, UserResolver } from '../imports/api/users';
import { ServicesTypeDefs, ServicesResolver } from '../imports/api/services';
import { EmployeeTypeDefs, EmployeeResolver } from '../imports/api/employees';
import { CustomerTypeDefs, CustomerResolver } from '../imports/api/customers';


load({
  typeDefs: [UserTypeDefs, ServicesTypeDefs, EmployeeTypeDefs, CustomerTypeDefs],
  resolvers: [UserResolver, ServicesResolver, EmployeeResolver, CustomerResolver],
});

const schema = makeExecutableSchema(getSchema());

setup({
  schema,
});

Meteor.startup(() => {
  // Todo
});
