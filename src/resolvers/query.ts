import { IResolvers } from "apollo-server-express";
import { COLLECTIONS, MESSAGES } from "../config/contants";
import JWT from "../lib/jwt";
import bcrypt from "bcrypt";

const resolversQuery: IResolvers = {
  Query: {
    async users(_, __, { db }) {
      try {
        return {
          status: true,
          message: "Usuario cargados correctamente",
          users: await db.collection(COLLECTIONS.USERS).find().toArray(),
        };
      } catch (error) {
        console.log(error.message);
        return {
          status: false,
          message: "Error al cargar los usuarios",
          users: [],
        };
      }
    },
    async login(_, { email, password }, { db }) {
      try {
        const user = await db.collection(COLLECTIONS.USERS).findOne({ email });

        if (user === null) {
          return {
            status: false,
            message: "Usuario no existe",
            token: null,
          };
        }

        const passwordChecked = bcrypt.compareSync(password, user.password);

        if (passwordChecked !== null) {
          delete user.password, delete user.birthday, delete user.registerDate;
        }

        return {
          status: true,
          message: passwordChecked
            ? "Usuario cargado correctamente"
            : "Credenciales incorrectas",
          token: passwordChecked ? new JWT().sign({ user }) : null,
        };
      } catch (error) {
        console.log(error.message);
        return {
          status: false,
          message: "Error al logear el usuario",
          token: null,
        };
      }
    },
    async me(_, __, { token }) {
      console.log(token);
      let info = new JWT().verify(token);
      if (info === MESSAGES.TOKEN_INVALID) {
        return {
          status: false,
          message: info,
          user: null,
        };
      }
      return {
        status: true,
        message: 'Usuario autenticado correctamente',
        user: Object.values(info)[0]
      };
    },
  },
};

export default resolversQuery;
