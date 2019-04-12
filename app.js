const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");

const mongoose = require("mongoose")

const app = express();

const events = []

app.use(bodyParser.json());

/*
Each type of query needs a variable type.
[String!]! -- first ! means NOT NULLABLE, value inside the list cannot be null. Second ! is so the list itself cannot return null

It is common practice to use object names like events, just as if events was an object within the application. As opposed to getEvents which
is more like a function name. This is different for Mutations as mutations are more like function calls with parameter querys 

RootQuery returns an array of Event(s). We define the Event type under Type Event
*/

app.get("/", (req, res, next) => {
    res.send("Hello!")
})
// http://localhost:4000/graphql for graphiql interface

// ID is not nullable, each event MUST have an ID
app.use("/graphql", graphqlHttp({
    schema: buildSchema(`
    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    type RootQuery{
        events: [Event!]!
    }

    type RootMutation{
        createEvent(eventInput: EventInput): Event
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
    `),
    // this is the resolver. Used to retrieve data
    rootValue: {
        events: () => {
            return events
        },
        /* get the event details from args  */
        createEvent: (args) => {
            const event = {
                _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: args.eventInput.date
            }
            events.push(event)
            return event
        }
    },
    graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@graphqlapp-wdjqw.mongodb.net/test?retryWrites=true`)
.then(() => {
    console.log("Successfully connected to MongoDB")
    app.listen(4001)
})
.catch(err => {
    console.log(`Ooops! Error: ${err}`)
})

app.listen(400);