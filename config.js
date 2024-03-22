/* 
Config file to help set up the uri link to connect to db 
Note: practice code from lesson 10/11 were useful for the creation of the file. 
*/
exports.database = {
    database: process.env.DATABASE_NAME || "openLabDB",
    username: process.env.DATABASE_USER || "krodriguez6",
    password: process.env.DATABASE_PASSWORD || "master45",
    host:
      process.env.DATABASE_SERVER ||
      "cluster0.8ibh9n4.mongodb.net/openLabDB?retryWrites=true&w=majority&appName=Cluster0"
    };
  