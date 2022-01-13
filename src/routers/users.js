const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')
const multer = require('multer')
const { send } = require('express/lib/response')
const sharp = require('sharp')
const { sendWelcomeEmail, sendGoodbyeEmail } = require('../emails/account')

router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    } catch (error) {
        return res.status(400).send(error)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (e) {
        return res.status(400).send()
    }
})

router.post('/users/logout', auth , async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
        
    }
})

router.post('/users/logoutAll',auth, async (req,res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send
    }
})




router.get('/users/me', auth ,async (req,res) => {
    res.send(req.user)
    
})

router.patch('/users/me', auth ,async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({ error : 'invalid update'})
    }

    try {
        

        updates.forEach((update) => req.user[update]= req.body[update])

        await req.user.save()

        //const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators:true})
        return res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth ,async(req, res)=>{
    try {
        await req.user.remove()
        sendGoodbyeEmail(req.user.email,req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

const avatarUpload = multer({
    limits:{
        filesize : 1000000
    },
    fileFilter(req, file, cb ){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload a JPG , PNG or JPEG file'))
        }
        
        cb(undefined,true)
    }
})

router.post('/users/me/avatar', auth, avatarUpload.single('avatar'), async (req,res) => {
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar=buffer
    await req.user.save()
    res.send()
},(error, req, res, next) => {
    res.status(400).send({error: error.message })
} )


router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

router.delete('/users/me/avatar', auth, async (req,res) => {
    try {
        req.user.avatar = undefined
        req.user.save()
        res.send()
    } catch (e) {
        return res.status(500).send(e)
    }
})

module.exports = router