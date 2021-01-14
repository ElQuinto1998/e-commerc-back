import { IResolvers } from "graphql-tools";
import { COLLECTIONS } from "../../config/contants";
import { countElements, findOneElement } from "../../lib/db-operations";
import { pagination } from "../../lib/pagination";
import GenreService from "../../services/genre-services";

const resolversGenreQuery: IResolvers = {
  Query: {
    async genres(_, variables, { db }) {
      return new GenreService(_, {pagination: variables}, { db }).getGenres();
    },
    async genre(_, { id }, { db }) {
      return new GenreService(_, {id}, { db }).getGenreDetails();
    },
  },
};

export default resolversGenreQuery;
