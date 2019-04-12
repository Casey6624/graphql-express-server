const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const Event = require("./models/event")
const User = require("./models/user")

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

    type User {
        _id: ID!
        email: String!
        password: String
    }

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    input UserInput{
        email: String!
        password: String!
    }

    type RootQuery{
        events: [Event!]!
    }

    type RootMutation{
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
    `),
    // this is the resolver. Used to retrieve data
    rootValue: {
        events: () => {
            return Event.find()
            .then(events => {
                return events.map(event => {
                    return { ...event._doc }
                })
            })
            .catch(err => {
                console.log(err)
                throw err
            })
        },
        /* get the event details from args  */
        createEvent: (args) => {
            // new Event from models/event.js - This is the mongoose Schema
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: "5cb0b9083e56ca3280fc15e0"

            })
            /* Because event isn't a normal JS object, it is a mongoose object we have access to the .save() methods
            which will save the object we defined using graphql args into the database. It also has a promise-like response*/
            let createdEvent
            return event
            .save()
            .then(res => {
                createdEvent = {...res._doc}
                return User.findById("5cb0b9083e56ca3280fc15e0")                
            })
            .then(user => {
                if(!user){
                    throw new Error("Ooops! Please try again later")
                }
                user.createdEvents.push(event)
                return user.save()
            })
            .then(res => {
                return createdEvent
            })
            .catch(err => {
                console.log(err)
                throw err
            })
            return event
        },
        createUser: (args) => {
            return User.findOne({ email: args.userInput.email })
            /* we ALWAYS go into the .then() block in mongoose, its not just when/ if the query returns data.
            If no user is found with the email in this example then we still go into .then(). .catch() is only triggered
            on connection/server errors
            */
            .then(user => {
                if(user){
                    throw new Error("User Already Exists!")
                }
                return bcrypt.hash(args.userInput.password, 12)
            })
            .then(hashedPassword => {
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword
                })
                return user.save()
                .then(res => {
                    /*We set password to null as we never want to return this over graphQL. It is still stored in the database
                    as a hashed password, we just set the GraphQL response to null so no one can view it.                    
                    */
                    return { ...res._doc, password: null}
                })
                .catch(err => {
                    console.log(err)
                    throw err
                })
            })
            .catch(err => {
                console.log(err)
                throw err
            })
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