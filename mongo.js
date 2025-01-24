const mongoose = require('mongoose')

require('dotenv').config();



let url = "mongodb+srv://olawale:ola1234@cluster0.cun74.mongodb.net/?retryWrites=true&w=majority";
console.log(url)
const connectDB = async () => {
    try {
        await mongoose.set('strictQuery', false)
        await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => console.log('Connected to MongoDB Atlas!'))

    } catch (error) {
        console.log(error)
    }

}
connectDB()


const phonebookSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: function (v) {
                return /^\d{2}-\d*$|^\d{3}-\d*$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
    },
})



module.exports = mongoose.model('Book', phonebookSchema)

