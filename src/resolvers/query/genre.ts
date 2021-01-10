import { IResolvers } from "graphql-tools";
import { COLLECTIONS } from "../../config/contants";
import { findOneElement } from "../../lib/db-operations";
import GenreService from "../../services/genre-services";

const resolversGenreQuery: IResolvers = {
  Query: {
    async genres(_, __, { db }) {
      return new GenreService(_, __, { db }).getGenres();
    },
    async genre(_, { id }, { db }) {
      return new GenreService(_, {id}, { db }).getGenreDetails();
    },
  },
};

export default resolversGenreQuery;
