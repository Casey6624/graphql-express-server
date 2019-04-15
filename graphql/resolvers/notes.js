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
            createdEvent = {
                ...res._doc, 
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, res._doc.creator)}
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
}