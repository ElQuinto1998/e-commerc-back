import express from "express";
import cors from "cors";
import compression from "compression";
import { createServer } from "http";
import environment from "./config/environment";
import { ApolloServer } from "apollo-server-express";
import schema from "./schema";
import expressPlayground from "graphql-playground-middleware-express";
import Database from "./lib/database";
import { IContext } from "./interfaces/contex.interface";

if (process.env.NODE_ENV !== "production") {
  const env = environment;
  console.log(env);
}

async function init() {
  const app = express();

  app.use("*", cors());

  app.use(compression());

  const database = new Database();

  const db = await database.init();

  const context = async({ req, connection }: IContext) => {
    const token = (req) ? req.headers.authorization : connection.authorization;
    return {db, token}
  };

  const server = new ApolloServer({
    schema,
    introspection: true,
    context,
  });

  server.applyMiddleware({ app });

  app.get(
    "/",
    expressPlayground({
      endpoint: "/graphql",
    })
  );

  const serverApp = createServer(app);

  serverApp.listen({ port: process.env.PORT || 9000 }, () => {
    console.log(`Api running on port ${process.env.PORT}`);
  });
}

init();
