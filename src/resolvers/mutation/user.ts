import { IResolvers } from "apollo-server-express";
import { COLLECTIONS } from "../../config/contants";
import bcrypt from "bcrypt";
import {
  asigDocumentId,
  findOneElement,
  insertOneElement,
} from "../../lib/db-operations";
import UserService from "../../services/users-service";

const resolversUserMutation: IResolvers = {
  Mutation: {
    async register(_, { user }, context) {
      return new UserService(_, {user}, context).register();
    },
    async updateUser(_, { user }, context) {
      return new UserService(_, {user}, context).modifyUser();
    },
    async deleteUser(_, { id }, context) {
      return new UserService(_, {id}, context).deleteUser();
    },
  },
};

export default resolversUserMutation;
