let stats = []
let answerId = 0;
let correctCount = 0;
let wrongCount = 0;
let currentquiz
const quiz1 = require("./food.json")
const quiz2 = require("./science-nature.json")
const quiz3 = require("./video-games.json");

module.exports = {
    //Sends stats to results page
    getStats: (req,res) => res.status(200).send([stats,correctCount,wrongCount]),
    //Updates stats after each question is answered
    updateStats: (req,res) => {
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
    },
    //Resets stats after results page is populated
    resetStats: (req,res) => {
        stats=[]
        answerId=0
        correctCount=0
        wrongCount=0
    },
    //Sends current quiz on quiz start
    getQuiz: (req,res) => res.status(200).send(currentquiz),
    //Changes current quiz when selecting from the dropdown
    changeQuiz: (req,res) => {
  
        if(req.params.quiz == "quiz1"){
          currentquiz = quiz1
        }else if(req.params.quiz == "quiz2"){
          currentquiz = quiz2
        }else if(req.params.quiz == "quiz3"){
          currentquiz = quiz3
        }
        res.status(200).send(currentquiz)
    },

    
}