const express = require("express");
const cors = require("cors");
const path = require('path')
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('client'))
app.use(express.static(path.join(__dirname, 'client/client.js')))

app.get('/', (req,res)=>{
  res.sendFile(path.join(__dirname, '../client/main.html'))
})

const quiz1 = require("./food.json")
const quiz2 = require("./science-nature.json")
const quiz3 = require("./video-games.json")

let currentquiz

let stats = []
let answerId = 0;
let correctCount = 0;
let wrongCount = 0;

app.get(`/api/stats`, (req,res) => {
    res.status(200).send([stats,correctCount,wrongCount])
})

app.post(`/api/stats`, (req, res) => {
  let {question, correct} = req.body
  let answer = {
    id: answerId,
    question,
    correct
  }
  stats.push(answer)
  res.status(200).send(answer)
  if(correct){
    correctCount++
  }else{
    wrongCount++
  }
  answerId++
})

app.delete(`/api/stats`, (req,res) => {
  stats=[]
  answerId=0
  correctCount=0
  wrongCount=0
})

app.get(`/api/quiz`, (req,res) => {
  res.status(200).send(currentquiz)
})

app.put(`/api/quiz/:quiz`, (req,res) => {
  
  if(req.params.quiz == "quiz1"){
    currentquiz = quiz1
  }else if(req.params.quiz == "quiz2"){
    currentquiz = quiz2
  }else if(req.params.quiz == "quiz3"){
    currentquiz = quiz3
  }
  res.status(200).send(currentquiz)
})





const port = process.env.PORT || 4000
app.listen(port, ()=>{
    console.log(`App is running on ${port}`);
})