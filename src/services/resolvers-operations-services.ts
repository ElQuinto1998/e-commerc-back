import { Db } from "mongodb";
import { IContextData } from "../interfaces/context-data";
import { IVariales } from "../interfaces/variables-interface";
import {
  deleteOneElement,
  findElements,
  findOneElement,
  insertOneElement,
  updateOneElement,
} from "../lib/db-operations";

class ResolverOperationsService {
  private root: object;
  private variables: IVariales;
  private context: IContextData;
  constructor(root: object, variables: IVariales, context: IContextData) {
    this.root = root;
    this.variables = variables;
    this.context = context;
  }

  protected getContext(): IContextData {
    return this.context;
  }

  protected getVariables(): IVariales {
    return this.variables;
  }
  protected getDb(): Db {
    return this.context.db!;
  }

  //Listar informacion
  protected async list(collection: string, listElement: string) {
    try {
      return {
        status: true,
        message: `Lista de ${listElement} cargados`,
        items: await findElements(this.getDb(), collection),
      };
    } catch (error) {
      console.log(error.message);
      return {
        status: false,
        message: `Error al cargar ${listElement}: ${error}`,
        items: null,
      };
    }
  }

  //Obtener detalles del Item
  protected async getItemDetail(collection: string) {
    const collectionName = collection.toLowerCase();
    try {
      return findOneElement(this.getDb(), collection, {
        id: this.variables.id,
      }).then((result) => {
        if (result) {
          return {
            status: true,
            message: `${collectionName} cargada correctamente`,
            item: result,
          };
        }
        return {
          status: true,
          message: `${collectionName} no obtuvo información`,
          item: null,
        };
      });
    } catch (error) {
      return {
        status: false,
        message: `Error al cargar informacion de la colleccion ${collectionName}`,
        item: null,
      };
    }
  }

  //Añadir Item
  protected async addItem(collection: string, document: object, item: string) {
    try {
      return await insertOneElement(this.getDb(), collection, document).then(
        (res) => {
          if (res.result.ok === 1) {
            return {
              status: true,
              message: `${item} añadido correctamente`,
              item: document,
            };
          }
          return {
            status: false,
            message: `No se insertó el ${item}`,
            item: null,
          };
        }
      );
    } catch (error) {
      return {
        status: false,
        message: `Error al insertar informacion en la colleccion ${item}`,
        item: null,
      };
    }
  }
  //Modificar item
  protected async updateItem(
    collection: string,
    filter: object,
    objectUpdate: object,
    item: string
  ) {
    try {
      return await updateOneElement(
        this.getDb(),
        collection,
        filter,
        objectUpdate
      ).then((res) => {
        if (res.result.nModified === 1 && res.result.ok) {
          return {
            status: true,
            message: `Elemento de ${item} fue actualizado correctamente`,
            item: Object.assign({}, filter, objectUpdate),
          };
        }
        return {
          status: false,
          message: `Elemento de ${item} no fue actualizado, sin datos para actualizar o compruebe el filtro `,
          item: Object.assign({}, filter, objectUpdate),
        };
      });
    } catch (error) {
      return {
        status: false,
        message: `Elemento de ${item} no pudo ser actualizado`,
        item: null,
      };
    }
  }

  //Eliminar item
  protected async deleteItem(collection: string, filter: object, item: string) {
    try {
      return await deleteOneElement(this.getDb(), collection, filter).then(
        (res) => {
          if (res.deletedCount === 1) {
            return {
              status: true,
              message: `Elemento de ${item} fue eliminado correctamente`,
            };
          }
          return {
            status: false,
            message: `Elemento de ${item} no fue eliminado`,
          };
        }
      );
    } catch (error) {
      return {
        status: false,
        message: `Error al eliminar el ${item}`,
        item: null,
      };
    }
  }
}

export default ResolverOperationsService;
