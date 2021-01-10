import slugify from "slugify";
import { COLLECTIONS } from "../config/contants";
import { IContextData } from "../interfaces/context-data";
import { asigDocumentId, findOneElement } from "../lib/db-operations";
import ResolverOperationsService from "./resolvers-operations-services";

class GenreService extends ResolverOperationsService {
  collection = COLLECTIONS.GENRES;

  constructor(root: object, variables: object, context: IContextData) {
    super(root, variables, context);
  }

  async getGenres() {
    const result = await this.list(this.collection, "géneros");
    return {
      status: result.status,
      message: result.message,
      genres: result.items,
    };
  }

  async getGenreDetails() {
    const result = await this.getItemDetail(this.collection);
    return {
      status: result.status,
      message: result.message,
      genre: result.item,
    };
  }

  async insertGen() {
    const genre = this.getVariables().genre;

    if (!this.checkData(genre || "")) {
      return {
        status: false,
        message: "El género no se especificó correctamente",
        genre: null,
      };
    }

    if (await this.checkInDatabase(genre || "")) {
      return {
        status: false,
        message: "El género a guardar ya existe",
        genre: null,
      };
    }

    const genreObject = {
      id: await asigDocumentId(this.getDb(), this.collection, { id: -1 }),
      name: genre,
      slug: slugify(genre || "", { lower: true }),
    };

    const result = await this.addItem(this.collection, genreObject, "género");
    return {
      status: result.status,
      message: result.message,
      genre: result.item,
    };
  }

  async updateGen() {
    const id = this.getVariables().id;
    const genre = this.getVariables().genre;

    if (!this.checkData(String(id) || "")) {
      return {
        status: false,
        message: "El ID no se especificó correctamente",
        genre: null,
      };
    }

    if (!this.checkData(genre || "")) {
      return {
        status: false,
        message: "El género no se especificó correctamente",
        genre: null,
      };
    }

    const object = { name: genre, slug: slugify(genre || "", { lower: true }) };

    const result = await this.updateItem(
      this.collection,
      { id },
      object,
      "género"
    );

    return {
      status: result.status,
      message: result.message,
      genre: result.item,
    };
  }

  async deleteGen() {
    const id = this.getVariables().id;
    const genre = this.getVariables().genre;

    if (!this.checkData(String(id) || "")) {
      return {
        status: false,
        message: "El ID no se especificó correctamente",
        genre: null,
      };
    }

    const result = await this.deleteItem(this.collection, { id }, "género");

    return {
      status: result.status,
      message: result.message,
    };
  }

  private checkData(value: string) {
    return value === "" || value === undefined ? false : true;
  }

  private async checkInDatabase(value: string) {
    return await findOneElement(this.getDb(), this.collection, {
      name: value,
    });
  }
}

export default GenreService;
