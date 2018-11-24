const express = require('express')
const graphqlHTTP = require('express-graphql')
const schema = require('./schema/schema')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
const port = 8081

app.use(cors())


app.get('/', () => console.log('works'))

// bind express with graphql
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));
// connect to db

mongoose.connect('mongodb://ksyhoo:newman84@ds237373.mlab.com:37373/tenders')
mongoose.connection.once('open', () => {
    console.log('connected to db')
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})





