const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose")

const graphQLSchema = require("./graphql/schema/index")
const graphQLResolvers = require("./graphql/resolvers/index")
const isAuth = require("./middleware/is-auth")

const app = express();

const PORT = 4000

app.use(bodyParser.json())

app.use((req, res, next) => {
    /* Here we need to setHeader() to bypass the common CORS issue*/
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type", "Authorization");
    /* Before GraphQL POST request is sent with the data, the browser sends an OPTIONS request in order to get some details about the
    endpoint. By sending a 200 status back to the browser, we are effectively greenlighting the enpoint and allowing for the actual
    POST request to come through*/
    if(req.method === "OPTIONS"){
        return res.sendStatus(200)
    }
    next()
});

// isAuth will be used on every single request within the app
app.use(isAuth)

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