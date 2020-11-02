import { IResolvers } from "apollo-server-express";
import { COLLECTIONS } from "../config/contants";
import bcrypt from 'bcrypt';

const resolversMutation: IResolvers = {
  Mutation: {
    async register(_, { user }, { db }) {
      const userCheck = await db
        .collection(COLLECTIONS.USERS)
        .findOne({ email: user.email });

      if (userCheck !== null) {
        return {
          status: false,
          message: `El email ${user.email} ya se encuentra registrado`,
          user: null,
        };
      }
      const lastUser = await db
        .collection(COLLECTIONS.USERS)
        .find()
        .limit(1)
        .sort({ registerDate: -1 })
        .toArray();
      if (lastUser.length === 0) {
        user.id = 1;
      } else {
        user.id = lastUser[0].id + 1;
      }

      user.registerDate = new Date().toISOString();

      user.password = bcrypt.hashSync(user.password, 10);

      return await db
        .collection(COLLECTIONS.USERS)
        .insertOne(user)
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

export default resolversMutation;
