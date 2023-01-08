const fs = require('fs');
const express = require('express');
const router = express.Router();
const getCurrentAccount = require('../Login/login.js').getCurrentAccount

//router.use(express.json({ extended: true }));
let favorites = null;
{
    const input = fs.readFileSync(__dirname + '/favorites.txt', 'utf8')
    if (input) {
        favorites = JSON.parse(input); //read accounts from file
    } else {
        favorites = {}
    }
}
//console.log(favorites)
//console.log(getCurrentAccount)

router.put('', (req, res) => { //the add endpoint
    const account = getCurrentAccount(req);
    if (!account) { //if the use is not logged in, return 401
        res.status(401).send('Not logged in');
        return;
    }

    const id = req.query.recipeid;
    if (!id) { //missing parameter
        res.status(400).send('recipeid is missing');
        return;
    }

    if (!favorites[account.Username]) {
        favorites[account.Username] = [id]
    }
    else if (!favorites[account.Username].find(x => x == id)) {
        favorites[account.Username].push(id);
    }

    fs.writeFileSync(__dirname + '/favorites.txt',JSON.stringify(favorites)) //update favorites.txt file

    return res.status(200).send('success');
});

router.delete('', (req, res) => { //the add endpoint
    const account = getCurrentAccount(req);

    if (!account) { //if the use is not logged in, return 401
        res.status(401).send('Not logged in');
        return;
    }

    const id = req.query.recipeid;
    if (!id) { //missing parameter
        res.status(400).send('recipeid is missing');
        return;
    }

    if (favorites[account.Username]) {
        favorites[account.Username] = favorites[account.Username].filter(x => x != id);
    }

    fs.writeFileSync(__dirname + '/favorites.txt', JSON.stringify(favorites)) //update favorites.txt file
    res.status(200).send('success');
});

router.get('', (req, res) => {
    // const account = getCurrentAccount(req);

    // if (!account) { //if the use is not logged in, return 401
    //     res.status(401).send('Not logged in');
    //     return;
    // }
    
    let account = {
        Username: "Ahmed Abdelrahman"
    }

    if (favorites[account.Username]) {
        res.status(200).send(favorites[account.Username]);
    } else {
        res.status(200).send([]);
    }
});

module.exports.router = router;