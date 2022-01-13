const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')
const { request } = require('express')

router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort ={}

    // GET /tasks?completed=true
    if(req.query.completed){
        match.completed=req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1 
    }

    try {
        
        await req.user.populate({

            path: 'tasks',
            match,
            options:{
                //pagination options 
                // GET /tasks?limit=10&skip=20 --- bu 10 adet sonuç ver baştan 20 atla demek
                limit:parseInt(req.query.limit),// bu kaç tane obj gelecek onu gösteriyor 
                skip:parseInt(req.query.skip), // bu baştan kaç tane atlayacağını gösteriyor bu sayede sayfa atlamış gibi oluyosun 
                sort //  bu da sıralama demek request de şöyle : // GET /tasks?sortBy=createdAt:desc
            }
        })
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
        console.log(e)
    }
})


router.post('/tasks', auth, async (req,res)=> {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        return res.status(400).send(error) 
    }
})

router.get('/tasks/:id', auth ,async (req, res) => {
    const _id = req.params.id
    try {
    //  const task = await Task.findById(_id)
    const task = await Task.findOne({_id, owner: req.user._id})
     if(!task){
        return res.status(404).send()
     }
     res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})


router.patch('/tasks/:id', auth , async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({ error : 'invalid update'})
    }

    try {
        const task = await Task.findOne({_id: req.params._id, owner: req.user._id })
        

        //const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators:true})
        if(!task){
        return res.status(404).send()
        }
        updates.forEach((update) => task[update]=req.body[update])

        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})



router.delete('/tasks/:id',auth  ,async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})






module.exports = router