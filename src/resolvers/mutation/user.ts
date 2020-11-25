import { IResolvers } from "apollo-server-express";
import { COLLECTIONS } from "../../config/contants";
import bcrypt from "bcrypt";
import {
  asigDocumentId,
  findOneElement,
  insertOneElement,
} from "../../lib/db-operations";

const resolversUserMutation: IResolvers = {
  Mutation: {
    async register(_, { user }, { db }) {
      const userCheck = await findOneElement(db, COLLECTIONS.USERS, {
        email: user.email,
      });

      if (userCheck !== null) {
        return {
          status: false,
          message: `El email ${user.email} ya se encuentra registrado`,
          user: null,
        };
      }
      user.id = await asigDocumentId(db, COLLECTIONS.USERS, {
        registerDate: -1,
      });

      user.registerDate = new Date().toISOString();

      user.password = bcrypt.hashSync(user.password, 10);

      return await insertOneElement(db, COLLECTIONS.USERS, user)
        .then(async () => {
          return {
            status: true,
            message: `Usuario ${user.name} registrado exitosamente`,
            user,
          };
        })
        .catch((err: Error) => {
          console.log(err.message);
          return {
            status: false,
            message: `Ha ocurrido un error registrando el usuario`,
            user: null,
          };
        });
    },
  },
};

export default resolversUserMutation;
