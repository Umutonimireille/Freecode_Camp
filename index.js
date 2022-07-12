const express = require('express')
const app = express()
const cors = require('cors')
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://yuhi:twKhZhX3xMwEkVw1@cluster0.glct8.mongodb.net/projectUrl").then(()=>{console.log('mongodb connected')}).catch((error)=>{console.log(error);})
require('dotenv').config()

app.use(cors())
app.use(express())
app.use(express.json())
app.use(bodyparser.urlencoded({extended:false}))
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// models

//models
const newUser = new mongoose.Schema({
  username: {
    type: String,
    required: true
  }
})
const User = mongoose.model('users', newUser)
const newExercise = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  date: {
    type: String
  }
})

const Exercise = mongoose.model('exercises', newExercise)
const log = new mongoose.Schema({
  username: { type: String, required: true },
  count: { type: Number, required: true },
  log: [
    {
       _id : false,
      description: String,
      duration: Number,
      date: String
    }
  ]
})
const Log = mongoose.model('logs', log)

app.post("/api/users", async (req, res) => {
  const user = new User({
    username: req.body.username
  })

  //

  app.get("/api/users", async (req, res) => {
  const users = await User.find()
  res.status(200).send(users)
})

  app.post('api/users',async(req,res) =>{
     const user = new User({
    username: req.body.username
  })
  res.status(200).send(user)
  await user.save()
  })
  res.status(200).send(user)
  await user.save()
})

// /api/users/:_id/exercises
app.post('/api/users/:_id/exercises', async (req, res) => {
  let user = await User.findById(req.params._id)
   let date;
if(req.body.date === ""){
  date = Date.now().toDateString()
  }else{
  let event = new Date(req.body.date)
   date = event.toDateString()
  if(date === "Invalid Date"){
    let event = new Date(Date.now()).toDateString()
     date = event
  }
  }
  console.log(date)
  const exercise = new Exercise({
    username: user.username,
    description: req.body.description,
    duration: req.body.duration,
    date: date
  })
  exercise.save()
  const response = {
    _id:user._id,
    username: user.username,
    description: exercise.description,
    duration: exercise.duration,
    date: date
  }
  res.send(response)
})
// /api/users/:_id/logs
app.get('/api/users/:_id/logs', async (req, res) => {
 const { from, to, limit} = req.query;
   const user = await User.findById(req.params._id)
  let exercise = await Exercise.find({username: user.username})
  if(from){
    const fromDate= new Date(from)
    exercise = exercise.filter(exe => new Date(exe.date) > fromDate);
  }
  if(to){
    const toDate = new Date(to)
    exercise = exercise.filter(exe => new Date(exe.date) < toDate);
  }
  if(limit){
    exercise = exercise.slice(0,limit);
  }
  console.log(req.query)
  const response = {
   username: exercise.username,
  count: exercise.length,
  _id: user._id,
  log: exercise.map((data)=> {
      return({
        description: data.description,
        duration: data.duration,
        date: new Date(data.date).toDateString()
      })
    })
  }
  console.log( response.log[0].date)
 res.send(response)
})
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})



