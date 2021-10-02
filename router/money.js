const router = require('express').Router()
const verify = require('../middleware/verify')

router.get('/', verify, async (req, res) => {
    res.json({money:"100,000"})
})

module.exports = router