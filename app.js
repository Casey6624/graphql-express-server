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

const events = async eventIds => {
    try {
      const events = await Event.find({ _id: { $in: eventIds } });
      events.map(event => {
        return {
          ...event._doc,
          _id: event.id,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event.creator)
        };
      });
      return events;
    } catch (err) {
      throw err;
    }
  };
// findById() finds a document by a MongoDB ID
const user = async userId => {
    try {
      const user = await User.findById(userId);
      return {
        ...user._doc,
        _id: user.id,
        createdEvents: events.bind(this, user._doc.createdEvents)
      };
    } catch (err) {
      throw err;
    }
  };

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
        creator: User!
    }

    type User {
        _id: ID!
        email: String!
        password: String
        createdEvents: [Event!]
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
            /* .populate() is a mongoose method used to populate other fields with relational data. if we didn't have 
            the populate line here, we wouldn't get Email/Password of a user back. The arguement it takes is the field which
            we want to populate           */
            //.populate("creator")
            .then(events => {
                return events.map(event => {
                    /* user() is a function defined right at the top of the page. We use this to replace the .populate() method
                    we previously defined under the original Mongoose Event.find() call. user() expects a userID parameter,
                    so we use bind to bind the this context  */
                    return { ...event._doc, creator: user.bind(this, event._doc.creator) }
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