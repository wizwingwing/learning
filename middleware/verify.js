const jwt = require('jsonwebtoken');
const moment = require('moment')

function Time(current, before) {
    const [byear, bmonth, bday, bhour] = before.split("/")
    const [cyear, cmonth, cday, chour] = current.split("/")
    const year = cyear - byear
    const month = cmonth - bmonth
    const day = cday - bday
    const hour = chour - bhour
    if (year > 0 || month > 0 || day > 0 || hour > 0) {
        return false
    } else if (day >= 1 && hour > 0) {
        return false
    } else {
        return true
    }
}

module.exports = async function auth (req, res, next) {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access Denied')
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        req.user = verified;
        const isInTime = await Time(moment().format("YYYY/MM/DD/HH"), moment(verified.moment).format("YYYY/MM/DD/HH"))
        if (isInTime) {
            next();
        } else {
           res.status(400).send('Token expire')
        }
    } catch  (err){
        res.status(400).send('Invalid Token')
    }
}
