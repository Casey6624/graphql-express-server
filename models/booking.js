const mongoose = require("mongoose")

const Schema = mongoose.Schema

const bookingSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: "Event"
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
    /* Timestamps are set to true which essentially gets Mongoose to add timestamp fields onto the document which tell us when the row was
    created and updated.
    createdAt - String
    updatedAt - String
    */
}, { timestamps: true })

module.exports = mongoose.model("Booking", bookingSchema)