const mongoose = require("mongoose")

const Schema = mongoose.Schema

// schema acts as the blueprint of the model
const eventSchema = new Schema({
    title: {
        // could also set title to just title: String, but if we pass an object we get more params to use
        type: String,
        // using required fits graphql schema of not nullable, Aka String!
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});
// the model puts the blueprint in place
// This model sets the collection the document is stored in. Collection == similar to a table in RDBMS
module.exports = mongoose.model("Event", eventSchema)