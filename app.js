const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose")

const Event = require("./models/event")

const app = express();

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
            // new Event from models/event.js - This is the mongoose Schema
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            })
            /* Because event isn't a normal JS object, it is a mongoose object we have access to the .save() methods
            which will save the object we defined using graphql args into the database. It also has a promise-like response*/
            return event
            .save()
            .then(res => {
                console.log(res)
                return {...res._doc}
            })
            .catch(err => {
                console.log(err)
                throw err
            })
            return event
        }
    },
    graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@graphqlapp-wdjqw.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`)
.then(() => {
    console.log("Successfully connected to MongoDB")
    app.listen(4001)
})
.catch(err => {
    console.log(`Ooops! Error: ${err}`)
})

app.listen(400);