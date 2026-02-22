const express = require("express")
const app = express()

app.use(express.json())
app.use(express.static('dist'))

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

let data = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/person', (request, response) => {
    response.json(data)
});

app.get('/api/info', (request, response) => {
    const count = data.length
    const time = new Date()
    
    response.send(
        `<div>
            <p>Phonebook has info for ${count} people</p>
            <p>${time}</p>
        </div>`
    )
});

app.get('/api/person/:id', (request, response) => {
    const id = request.params.id
    const getPerson = data.find(person => person.id === id)

    if (getPerson) {
        response.json(getPerson)
    }
    else {
        response.status(404).end()
    }
});

app.delete('/api/person/:id', (request, response) => {
    const id = request.params.id
    data = data.filter(person => person.id !== id)
    response.status(204).end()
})

const generateID = () => {
    const maxID = data.length > 0 ? Math.max(...data.map(n => Number(n.id))) : 0
    return String(maxID + 1)
}

app.post('/api/person', (request, response) => {
    const body = request.body
    const number = body.number
    const name = body.name

    if (!name || !number) {
        return response.status(400).json({
        error: "Content missing",
        });
    }

    const existed = data.some(n => n.name === body.name)

    if (existed){
        return response.status(400).json({
            error: "Name must be unique",
        });
    }

    const newPerson = {
        id: generateID(),
        name: body.name,
        number: body.number,
    }

    data = data.concat(newPerson)

    response.json(data)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})