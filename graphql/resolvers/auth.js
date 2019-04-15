const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
// Mongoose Models
const User = require('../../models/user');

module.exports = {
  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error('User exists already.');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword
      });

      const result = await user.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  login: async ({email, password}) => {
    // Check to see if the email exists in the database
    const user = await User.findOne({email: email}) 
    if(!user){
      throw new Error("User does not exist");
    }
    // hash the password entered in form and check against hashed password in DB
    const isEqual = await bcrypt.compare(password, user.password)
    if(!isEqual){
      throw new Error("Invalid password.")
    }
    /* First parameter is the object we want to hash using JWT. 
    Second paramter is the hash string we want to use to has the password
    Third parameter is a further settings object which tells JWT how long to allow the token to last for */
    const token = jwt.sign({
      userId: user.id,
      email: user.email
    }, 
    "somesecretsuperkey",
    {
      expiresIn: "1h"
    }
    )
    return{
      userId: user.id,
      token: token,
      tokenExpiration: 1
    }

  }
};