import { IResolvers } from "apollo-server-express";
import { COLLECTIONS, MESSAGES } from "../../config/contants";
import JWT from "../../lib/jwt";
import bcrypt from "bcrypt";
import { findElements, findOneElement } from "../../lib/db-operations";
import UserService from "../../services/users-service";

const resolversUserQuery: IResolvers = {
  Query: {
    async users(_, __, context) {
      return new UserService(_, __, context).getUsers();
    },
    async login(_, { email, password }, context) {
      return new UserService(_, { user: { email, password } }, context).login();
    },
    async me(_, __, { token }) {
      return new UserService(_, __, {token}).auth();
    }
  },
};

export default resolversUserQuery;
