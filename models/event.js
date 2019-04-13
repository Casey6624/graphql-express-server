const mongoose = require("mongoose")

const Schema = mongoose.Schema

/*
We use a Schema to define the data that we are going to place into MongoDB.

Once the schema is defined we place it inside the mongoose model. The model creates the Collection (Table in SQL) for us using the data
definitions we have defined. We can reference another Model using a ref

*/
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
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref:"User"
    }
});
// the model puts the blueprint in place
// This model sets the collection the document is stored in. Collection == similar to a table in RDBMS
module.exports = mongoose.model("Event", eventSchema)