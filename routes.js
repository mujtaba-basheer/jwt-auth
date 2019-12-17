const MongoClient = require('mongodb').MongoClient;
const env = require('dotenv')
const auth = require('./controllers/auth')
const router = require('express').Router()
const User = require('./controllers/users')

env.config()

const dbName = 'jwt'
const client = new MongoClient(process.env.URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})

client.connect(function (err, db) {
  if (!err) {
    console.log("Connected to DB");
    const db = client.db(dbName)

    router.route('/register').post((req, res) => auth.signup(req, res, db))
    router.route('/login').post((req, res) => auth.login(req, res, db))
    router.route('/:id').get(
      (req, res, next) => auth.protect(req, res, next),
      (req, res) => User.getUser(req, res, db))
  }
});

module.exports = router;