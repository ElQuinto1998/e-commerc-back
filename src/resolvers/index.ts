import { IResolvers } from "apollo-server-express";
import query from "./query";
import mutation from "./mutation";

const resolvers: IResolvers = {
    ...query,
    ...mutation
}

export default resolvers;