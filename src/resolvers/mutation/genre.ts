import { IResolvers } from "graphql-tools";
import GenreService from "../../services/genre-services";

const resolversGenreMutation: IResolvers = {
    Mutation: {
        addGenre(_, variables, context) {
            return new GenreService(_, variables, context).insertGen();
        },
        updateGenre(_, variables, context) {
            return new GenreService(_, variables, context).updateGen();
        },
        deleteGenre(_, variables, context) {
            return new GenreService(_, variables, context).deleteGen();
        }
    }
};

export default resolversGenreMutation;