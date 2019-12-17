const bcrypt = require('bcrypt');
const api = require('./apiFeatures')

exports.signup = async (req, res, db) => {
    let data = req.body
    const user = await db.collection('users').findOne({email: data.email})
    if (!user) {
        data.date = new Date().toISOString()
        data.password = bcrypt.hashSync(req.body.password, 10)
        db.collection('users').insertOne(data)
        .then(user => {
            api.sendToken(user.ops[0], 200, res)
        })
        .catch(err => console.error(err)
        )
    } else {
        api.sendErrorStatus(400, res, 'User already exists')
    }
}

exports.login = async (req, res, db) => {
    let data = req.body
    const user = await db.collection('users').findOne({email: data.email})
    if (user) {
        if (await api.checkPass(data.password, user.password)) {
            api.sendToken(user, 200, res)
        } else {
            api.sendErrorStatus(400, res, 'Incorrect Password!')
        }
    } else {
        api.sendErrorStatus(400, res, 'User does not exist')
    }
}

exports.protect = (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
        api.verifyToken(token)
        .then(() => {
            return next()
        })
        .catch((err) => {
            api.sendErrorStatus(400, res, err.message)
        })
    } else {
        api.sendErrorStatus(400, res, 'Not Authorized')
    }
}