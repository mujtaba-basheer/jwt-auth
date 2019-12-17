const ObjectId = require('mongodb').ObjectID;
const api = require('./apiFeatures')

exports.getUser = async (req, res, db) => {
    const user = await db.collection('users').findOne({_id: ObjectId(req.params.id)})
    if (user) {
        res.status(200).json({
            "status": 'success',
            user
        })
    } else {
        api.sendErrorStatus(400, res, 'User does not exist')
    }
}