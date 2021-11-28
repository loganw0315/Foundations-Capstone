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

const { changeQuiz, resetStats, updateStats, getStats, getQuiz } = require("./controller");

app.get(`/api/stats`, getStats)
app.post(`/api/stats`, updateStats)
app.delete(`/api/stats`, resetStats)
app.get(`/api/quiz`, getQuiz)
app.put(`/api/quiz/:quiz`, changeQuiz)

const port = process.env.PORT || 4000
app.listen(port, ()=>{
    console.log(`App is running on ${port}`);
})