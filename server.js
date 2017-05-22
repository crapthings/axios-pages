import _ from 'lodash'
import faker from 'faker'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const demo = _.times(10000, n => ({
  _id: n + 1,
  title: faker.lorem.sentence(),
}))

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors())

app.get('/api/test', function (req, res) {
  const page = req.query.page ? parseInt(req.query.page) : 1
  const per_page = req.query.per_page ? parseInt(req.query.per_page) : 10

  const start = page == 1 ? 0 : page * per_page - per_page
  const end = start + per_page

  const data = _.slice(demo, start, end)

  res.json(data)
})

app.listen(4000, function () {
  console.log('start at port', 4000)
})
