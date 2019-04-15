const { buildSchema } = require("graphql")



/*
Each type of query needs a variable type.
[String!]! -- first ! means NOT NULLABLE, value inside the list cannot be null. Second ! is so the list itself cannot return null

It is common practice to use object names like events, just as if events was an object within the application. As opposed to getEvents which
is more like a function name. This is different for Mutations as mutations are more like function calls with parameter querys 

RootQuery returns an array of Event(s). We define the Event type under Type Event


    bookEvent(eventId: ID!): Booking! -- book event with the passed event ID, return Booking data
    cancelBooking(bookingId: ID!): Event -- cancel booking with the passed booking ID, return Event data

*/

module.exports = buildSchema(`
type Booking {
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
}

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

input UserInput {
  email: String!
  password: String!
}

type RootQuery {
    events: [Event!]!
    bookings: [Booking!]!
}

type RootMutation {
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);