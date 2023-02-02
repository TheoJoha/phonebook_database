// mongoose stuff
const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
.then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    minLength: 3,
    type: String,
    required: true
  }, 
  num: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        if (v.length >= 8) {
          let intCount = 0;
          for (let i = 0; i < v.length; i++) {
            if (0 <= v[i] && v[i] <= 9) {
              intCount += 1;
            }
          }
          if (v[1] == "-" || v[2] == "-") {
            if (intCount == v.length - 1) {
              return true
            }
          }
          if (intCount < 8) {
            return false
          }
          // return /\d{3}-\d{3}-\d{4}/.test(v);
        }
        else {return false}
        
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required'],
  }, 
  id: Number,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
