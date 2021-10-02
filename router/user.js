const router = require('express').Router()
const { user } = require('../models')

router.get('/', async (req,res) => {
    console.log(req.query)
    res.json({message:"ดึงข้อมูลเรียบร้อยแล้ว"})
})

router.post('/create', async (req,res) =>{
    try {
        const body = req.body
        console.log(body)
        await user.create(body);
        res.json({message:"สร้างข้อมูลเรียบร้อยแล้ว"})
    } catch (err) {
        console.log(err)
        res.status(500).send("create user error")
    }
})


router.put('/update', (req,res) =>{
    console.log(req.body)
    res.json({message:"แก้ไขข้อมูลเรียบร้อยแล้ว"})
})
router.delete('/delete', (req,res) =>{
    console.log(req.query)
    res.json({message:"ลบข้อมูลเรียบร้อยแล้ว"})
})

module.exports = router