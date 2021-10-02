const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const makeid = require("../middleware/randomString");
const router = require('express').Router()
const moment = require('moment')
const { user } = require('../models')

router.post('/register', async (req, res) => {
    try {
        const body = req.body
        const duplicate = await user.findOne({ where: { username: body.username } });

        if (duplicate) {
            res.json({ msg: "duplicate username" });
        } else {
            body.refetchToken = await makeid(10)
            const salt = bcrypt.genSaltSync(10);
            body.password = bcrypt.hashSync(body.password, salt);
            await user.create(body);
            const isUser = await user.findOne({where:{username:body.username}, raw:true})
            const token = jwt.sign({ id: isUser.id, username: isUser.username, moment: moment(), refetchToken:body.refetchToken }, process.env.JWT_SECRET);
            res.header("auth-token", token).json({ accessToken: token, refetchToken:body.refetchToken });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "server is not connected" });
    }
})

router.post('/login', async (req,res) =>{
    try {
        const { username, password } = req.body;
        const client = await user.findOne({ where: { username }, raw:true });
        if (!client) {
            res.json({ msg: "username login failed" });
        } else {
            const validPass = await bcrypt.compareSync(password, client.password);
            if (!validPass) {
                return res.send({ message: "invalid password" });
            } else {
                const refetchToken = await makeid(10)
                const isUser = await user.update({refetchToken}, { where: { username }, raw: true });
                const token = jwt.sign({ id: isUser.id, username: isUser.username, moment: moment(), refetchToken }, process.env.JWT_SECRET);
                res.header("auth-token", token).json({ accessToken: token, refetchToken });
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "server is not connected" });
    }
})

router.post('/refetchToken', async (req,res) =>{
    try {
        const {username, refetchToken} = req.body
        const isUser = await user.findOne({where:{username, refetchToken}, raw:true})
        if (isUser) {
            const token = jwt.sign({ id: isUser.id, username: isUser.username, moment: moment(), refetchToken }, process.env.JWT_SECRET);
            res.header("auth-token", token).json({ accessToken: token });
        } else {
            res.status(401).json({msg:"refetch Token is not used"})
        }
    } catch (error) {
        res.status(500).json({msg:"server is not connected"})
    }
})

module.exports = router