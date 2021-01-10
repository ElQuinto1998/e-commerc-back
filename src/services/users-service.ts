import { COLLECTIONS, MESSAGES } from "../config/contants";
import { IContextData } from "../interfaces/context-data";
import { asigDocumentId, findOneElement } from "../lib/db-operations";
import bcrypt from "bcrypt";
import ResolverOperationsService from "./resolvers-operations-services";
import JWT from "../lib/jwt";

class UserService extends ResolverOperationsService {
  private collection = COLLECTIONS.USERS;

  constructor(root: object, variables: object, context: IContextData) {
    super(root, variables, context);
  }

  //Listar usuarios
  async getUsers() {
    const result = await this.list(this.collection, "usuarios");
    return {
      status: result.status,
      message: result.message,
      users: result.items,
    };
  }

  //Iniciar sesion
  async login() {
    try {
      const variables = this.getVariables().user;
      const user = await findOneElement(this.getDb(), this.collection, {
        email: variables?.email,
      });

      if (user === null) {
        return {
          status: false,
          message: "Usuario no existe",
          token: null,
        };
      }

      const passwordChecked = bcrypt.compareSync(
        variables?.password,
        user.password
      );

      if (passwordChecked !== null) {
        delete user.password, delete user.birthday, delete user.registerDate;
      }

      return {
        status: passwordChecked,
        message: passwordChecked
          ? "Usuario cargado correctamente"
          : "Credenciales incorrectas",
        token: passwordChecked ? new JWT().sign({ user }) : null,
        user: passwordChecked ? user : null,
      };
    } catch (error) {
      console.log(error.message);
      return {
        status: false,
        message: "Error al logear el usuario",
        token: null,
      };
    }
  }

  //Autenticarse
  async auth() {
    console.log(this.getContext().token!);
    let info = new JWT().verify(this.getContext().token!);
    if (info === MESSAGES.TOKEN_INVALID) {
      return {
        status: false,
        message: info,
        user: null,
      };
    }
    return {
      status: true,
      message: "Usuario autenticado correctamente",
      user: Object.values(info)[0],
    };
  }

  //Registrar un usuario
  async register() {
    const user = this.getVariables().user;
    const userCheck = await findOneElement(this.getDb(), this.collection, {
      email: user?.email,
    });

    if (user === null) {
      return {
        status: false,
        message: "Usuario no definido",
        user: null,
      };
    }

    if (
      user?.password === null ||
      user?.password === undefined ||
      user?.password === ""
    ) {
      return {
        status: false,
        message: "Usuario sin contraseña",
        user: null,
      };
    }

    if (userCheck !== null) {
      return {
        status: false,
        message: `El email ${user?.email} ya se encuentra registrado`,
        user: null,
      };
    }
    user!.id = await asigDocumentId(this.getDb(), this.collection, {
      registerDate: -1,
    });

    user!.registerDate = new Date().toISOString();

    user!.password = bcrypt.hashSync(user!.password, 10);

    const result = await this.addItem(this.collection, user || {}, "usuario");

    return {
      status: result.status,
      message: result.message,
      user: result.item,
    };
  }

  //Modificar un usuario
  async modifyUser() {
    const user = this.getVariables().user;
    if (user === null) {
      return {
        status: false,
        message: "Usuario no definido",
        user: null,
      };
    }
    const filter = { id: user?.id };

    const result = await this.updateItem(
      this.collection,
      filter,
      user || {},
      "usuario"
    );

    return {
      status: result.status,
      message: result.message,
      user: result.item,
    };
  }

  //Eliminar un usuario
  async deleteUser() {
    const id = this.getVariables().id;

    if (id === null || id === undefined || id === "") {
      return {
        status: false,
        message: "Identificador del usuario no definido",
        user: null,
      };
    }

    const result = await this.deleteItem(this.collection, { id }, "usuario");

    return {
      status: result.status,
      message: result.message,
    };
  }
}

export default UserService;
