// Helper functions
const { transformBooking } = require("./merge")
// Mongoose Models
const Booking = require("../../models/booking");
const Event = require("../../models/event")

module.exports = {
  bookings: async (args, req) => {
    /* Here we add validation which checks the isAuth property of the header and sees if a user is authenticated */
    if(!req.isAuth){
      throw new Error("Unauthenticated! Please login to view bookings.")
    }
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return transformBooking(booking)
      });
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args, req) => {
    /* Here we add validation which checks the isAuth property of the header and sees if a user is authenticated */
    if(!req.isAuth){
      throw new Error("Unauthenticated! Please login to book events.")
    }
    // find the event which matches the passed eventId
    const fetchedEvent = await Event.findOne({_id: args.eventId})
    const booking = new Booking({
      user: req.userId,
      event: fetchedEvent
    })
    const result = await booking.save()
    return transformBooking(result)
  },
  cancelBooking: async (args, req) => {
    /* Here we add validation which checks the isAuth property of the header and sees if a user is authenticated */
    if(!req.isAuth){
      throw new Error("Unauthenticated! Please login to cancel events.")
    }
    try {
      const booking = await Booking.findById(args.bookingId).populate('event');
      const event = transformEvent(booking.event)
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  }
};