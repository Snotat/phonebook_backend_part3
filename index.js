const express = require('express')
const app = express()
const Book = require('./mongo')
require('dotenv').config({ path: '.env' });
var bodyParser = require('body-parser')
const cors = require('cors')
const connectDB = require('./mongo')

app.use(express.static('dist'))

const morgan = require('morgan');


morgan.token('body', (req) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body);

    } return;
});
app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


const errorHandler = (error, request, response, next) => {

    if (error) {
        return response.status(400).send({ error: error.message })
    }

    next(error)
}
app.use(bodyParser.json())
let now = new Date()
app.use(cors())
app.get('/notes', (request, response) => {

    let notes = Book.countDocuments({})
    response.type('text/plain');
    response.send(`<p>Phonebook has ${notes} people</p><br /><p>${now}</p>`)
})

app.get('/api/persons', async (request, response, next) => {
    await connectDB()
    await Book.find({}).then(res => {
        response.json(res)
        console.log(res)
    }).catch(err => {
        next(err)
    })
})


app.delete(`/api/persons/:id`, (request, response, next) => {
    let id = request.params.id
    Book.findByIdAndDelete(id).then(res => {
        response.status(204).send(res)
    }).catch(err => {
        console.log(err)
        next(err)
    })

})

app.put('/api/persons/:id', async (request, response) => {
    let id = request.params.id
    console.log(id, request.body)

    try {

        Book.findByIdAndUpdate(id, request.body, { new: true, runValidators: true, context: 'query' }).then(res => {
            response.status(201).json(res.data)
            console.log(request.body)
        })
    }
    catch (err) {
        response.status(422).send(err)
    }

})
app.get('/api/persons/:id', async (request, response) => {
    connectDB()
    let id = request.params.id
    console.log(id, request.body)
    await Book.findById(id).then(res => {
        response.status(200).send(res)
    })
})

app.post('/api/persons', async (request, response) => {
    let body = request.body;
    console.log('body', body);

    const checkExist = () => {
        Book.findOne({ name: body.name }).then((res) => {
            console.log('find one  dd', res)
        })
    }

    console.log('exist', !!checkExist())
    if (body.name == null || body.name == '') {
        response.status(500).send({ error: 'name is missing!' })
    }
    else if (body.number == null || body.number == '') {
        response.status(500).send({ error: 'number is missing!' })
    }
    else if (checkExist()) {
        response.status(500).send({ error: 'name must be unique' })
    } else {
        let book = new Book({
            name: body.name,
            number: body.number
        })
        try {
            await book.validate();
            book.save().then(res => {
                response.status(200).send(res)
            }).catch((err) => {
                console.log(err)
                response.status(500).send(err?.response?.data?.message)
            })
        } catch (err) {
            response.status(422).send(err)
        }


    }
})


app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})