const mongoose = require("mongoose")

const Schema = mongoose.Schema

// schema acts as the blueprint of the model
const userSchema = new Schema({
    email: {
        // could also set email to just email: String, but we have to make it an object if we want to add required field
        type: String,
        // using required fits graphql schema of not nullable, Aka String!
        required: true
    },
    password: {
        // could also set password to just password: String, but we have to make it an object if we want to add required field
        type: String,
        // using required fits graphql schema of not nullable, Aka String!
        required: true
    },

    createdEvents: [
        {
            // Type is the mongoDB ObjectID
            type: Schema.Types.ObjectId,
            /* ref is used to add relationships to the mongo database. We pass it "Event" which is the name we gave the Event Model */
            ref: "Event"
        }
    ]
});
// the model puts the blueprint in place
// This model sets the collection the document is stored in. Collection == similar to a table in RDBMS
module.exports = mongoose.model("User", userSchema)