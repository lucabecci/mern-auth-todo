const router = require("express").Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const User = require('../models/User')
const auth = require('../middleware/auth')

router.post("/register", async (req, res) => { 
    try{
        let {email, password, passwordCheck, displayName} = req.body

        if(!email || !password || !passwordCheck){
            return res.status(400).json({
                msg: 'Please send all camps'
            })
        }
        if(password.length < 5) {
            return res.status(400).json({
                msg: 'Password short, the min lenght of the password is 5'
            })
        }
        if(password !== passwordCheck){
            return res.status(400).json({
                msg: 'Enter the same passwords'
            })
        }

        const existingUser = await User.findOne({email: email})

        if(existingUser){
            return res.status(400).json({
                msg: 'Email already use'
            })
        }

        if(!displayName) displayName = email

        const salt = await bcrypt.genSalt(10)

        const hashed = await bcrypt.hash(password, salt)

        const newUser = new User({
            email,
            password: hashed,
            displayName
        }) 

        const savedUser = await newUser.save()

        res.status(200).json(savedUser)
    }
    catch(e){
        res.status(500).json({error: e.message})
    }
})


router.post("/login", async (req, res) => {
    try{
        const {email, password} = req.body

        if(!email || !password){
            return res.status(400).json({msg: "Please send all camps"})
        }

        const user = await User.findOne({email: email})
        if(!user) return res.status(400).json({msg: "Not account with this email"})

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(400).json({msg: 'Invalid password'})

        const token = jwt.sign({id: user._id}, process.env.JWT_TOKEN)
        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.displayName,
                email: user.email
            }
        })
    }
    catch(e){
        res.status(500).json({error: e.message})
    }
})


router.delete("/delete", auth, async(req, res) => {
    try{
        const deletedUser = await User.findByIdAndDelete(req.user)
        res.status(200).json({
            msg: "User deleted, goodbye."
        })
    }
    catch(e){
        res.status(500).json({error: e.message})
    }
})


router.post("/tokenIsValid", async(req, res) => {
    const token = req.header('x-auth-token')
    if(!token) return res.json(false)

    const verified = jwt.verify(token, process.env.JWT_TOKEN)
    if(!verified)return res.json(false)

    const user = await User.findById(verified.id)

    if(!user) return res.json(false)

    return res.json(true)
})

router.get('/', auth, async (req, res) => {
    const user = await User.findById(req.user)
    res.status(200).json({
        id: user._id,
        displayName: user.displayName
    })
})

module.exports = router