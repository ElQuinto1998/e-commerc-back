const { MongoClient } = require("mongodb");
import chalk from "chalk";

class Database {
  async init() {
    const MONGO_DB =
      process.env.DATABASE || "mongodb://localhost:27017/ecommerce";
    const client = await MongoClient.connect(MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    let db = client.db();
    if (client.isConnected()) {
      console.log("==============Database is connected==============");
      console.log(`STATUS: ${chalk.greenBright("ONLINE")}`);
      console.log(`DB_NAME: ${chalk.greenBright(db.databaseName)}`);
      console.log("=================================================");
    }
    return db;
  }
}

export default Database;
