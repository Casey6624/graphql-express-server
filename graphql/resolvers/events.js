// Helper functions

const { transformEvent } = require("./merge")
// Mongoose Models
const Event = require('../../models/event');
  
module.exports = {
    events: async () => {
      try {
        const events = await Event.find();
        return events.map(event => {
          return transformEvent(event)
        });
      } catch (err) {
        throw err;
      }
    },
    createEvent: async (args, req) => {
      /* Here we add validation which checks the isAuth property of the header and sees if a user is authenticated */
      if(!req.isAuth){
        throw new Error("Unauthenticated! Please login to create events.")
      }
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: req.userId
      });
      let createdEvent;
      try {
        const result = await event.save();
        createdEvent = transformEvent(result)
        const creator = await User.findById(req.userId);
  
        if (!creator) {
          throw new Error('User not found.');
        }
        creator.createdEvents.push(event);
        await creator.save();
  
        return createdEvent;
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  };