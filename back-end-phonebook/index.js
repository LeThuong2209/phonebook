require('dotenv').config()
const express = require("express")
const app = express()
const Information = require('./models/information')
const morgan = require("morgan")

morgan.token('body', (req) => {
    if (req.method === 'POST'){
        return JSON.stringify(req.body)
    }
  return ''
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)
app.use(express.json())
app.use(express.static('dist'))

app.get('/api/person', (request, response) => {
    Information.find({}).then(information => {
        response.json(information)
    })
});

app.get('/api/info', (request, response) => {
    Information.countDocuments({}).then(count => {
        const time = new Date()
        response.send(`
            <div>
                <p>Phonebook has info for ${count} people</p>
                <p>${time}</p>
            </div>
        `)
    })
});

app.put('/api/person/:id', (request, response, next) => {
    const name = request.body.name
    const number = request.body.number

    Information.findById(request.params.id)
        .then(result => {
            if (!result) {
                return response.status(404).end()
            }
            result.name = name
            result.number = number

            return result.save().then(savedInfor => {
                response.json(savedInfor)
            })
        })
        .catch(error => next(error))
})

app.get('/api/person/:id', (request, response) => {
    const id = request.params.id
    
    Information.findById(id).then(returnedObject => {
        response.json(returnedObject)
    })
});

app.delete('/api/person/:id', (request, response, next) => {
    Information.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/person', (request, response, next) => {
    const body = request.body
    const number = body.number
    const name = body.name

    if (!name || !number) {
        return response.status(400).json({
        error: "Content missing",
        });
    }

    Information.findOne({name: name})
        .then(result => {
            if (result) {
                return response.status(400).json({
                    error: "Name must be unique"
                })
            }

            const newPerson = new Information({
                name: body.name,
                number: body.number,
            })

            newPerson.save()
                .then(result => response.json(result))
                .catch(error => next(error))
        })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  else if (error.name === 'ValidationError'){
    return response.status(400).json({error: error.message})
  }

  next(error)
}

app.use(errorHandler)
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})