const mongoose = require('mongoose')
let name = ""
let num = ""
let id = -1

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

if (process.argv.length == 5) {
    console.log('assumption is that name and num are given')
    name = process.argv[3]
    num = process.argv[4]
    id = getRandomInt(10000)
    if (name != "" && num != "" && id != -1) {
        console.log(`added ${name} number ${num} to phonebook`)
    }
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.xokwo6l.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  num: String,
  id: Number,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 5) {
    const person = new Person({
        name: name,
        num: num,
        id: id
      })
      
      person.save().then(result => {
        console.log('person saved!')
        mongoose.connection.close()
      })
}

if (process.argv.length == 3) {
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
      })
}



