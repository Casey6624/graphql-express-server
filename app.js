const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose")

const graphQLSchema = require("./graphql/schema/index")
const graphQLResolvers = require("./graphql/resolvers/index")

const app = express();

const PORT = 4000

app.use(bodyParser.json())

app.get("/", (req, res, next) => {
    res.send("Hello!")
})
// http://localhost:4000/graphiql for graphiql interface

// ID is not nullable, each event MUST have an ID
app.use("/graphiql", graphqlHttp({
    schema: graphQLSchema,
    // this is the resolver. Used to retrieve data
    rootValue: graphQLResolvers,
    graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@graphqlapp-wdjqw.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`)
.then(() => {
    const MONGO_PORT = 4001
    console.log(`Successfully connected to MongoDB on PORT: ${MONGO_PORT}`)
    app.listen()
})
.catch(err => {
    console.log(`Ooops! Error: ${err}`)
})

app.listen(PORT);