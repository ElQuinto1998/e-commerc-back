import { IResolvers } from "apollo-server-express";

const resolversProductQuery: IResolvers = {
  Query: {
    products() {
      return true;
    },
  },
};

export default resolversProductQuery;
