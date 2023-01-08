const express = require('express')
var bodyParser = require('body-parser')
const login = require('./Login/login.js')
const query = require('./Query/query.js')
const favorites = require('./Favorites/favorites.js')
const shopping = require('./Shopping/shopping.js')
// const bodyParser=require('body-parser');
const app = express()
const cors = require('cors')

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));
// app.use(bodyParser.json())

app.use(cors())

app.use('/login', login.router);

app.use('/query', query.router);

app.use('/shopping', shopping.router)

app.use('/favorites', favorites.router)

app.get('/admin', (req, res) => {
    res.send('Hello my dear visitor!\nYour cookes are:\n    '+req.get('Cookie'));
});

app.post('/api/getDataByCondition', (req, res) => {
    console.log(req.body);
    res.status(200).json({ status: "success", msg: "first api" });
});

app.listen(8000,(err)=>{
    if(!err){
        // console.log("view the login page at 'http://localhost:8000/login'")
    }
});
