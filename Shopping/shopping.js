const fs = require('fs');
const express = require('express');
const router = express.Router();
const getCurrentAccount = require('../Login/login.js').getCurrentAccount

router.use(express.json({ extended: true }));
let shopItems = null;
{
    const input = fs.readFileSync(__dirname + '/shopping.txt', 'utf8')
    if (input) {
        shopItems = JSON.parse(input); //read accounts from file
    } else {
        shopItems = []
    }
}

function compareitem(a, b) {
    if (a.id != b.id) {
        return false;
    } else if (a.recipeid != b.recipeid) {
        return false;
    } else {
        return true;
    }
}

function validate(x) {
    if (!x || !x.hasOwnProperty('name') || !x.hasOwnProperty('unit') || !x.hasOwnProperty('amount') || !x.hasOwnProperty('recipeid') || !x.hasOwnProperty('id')) { return false; }
    return true;
}

router.put('', (req, res) => { //the add endpoint
    const account = getCurrentAccount(req);
    if (!account) { //if the use is not logged in, return 401
        res.status(401).send('Not logged in');
        return;
    }

    const ingred = req.body;
    if (!validate(ingred)) { //missing parameter
        res.status(400).send('ingredient is missing or incorrect');
        return;
    }

    if (!shopItems[account.Username]) {
        shopItems[account.Username] = [ingred]
    }
    else if (!shopItems[account.Username].find(x => compareitem(x,ingred))) {
        shopItems[account.Username].push(ingred);
    }

    fs.writeFileSync(__dirname + '/shopping.txt',JSON.stringify(shopItems)) //update shopping.txt file

    return res.status(200).send('success');
});

router.delete('', (req, res) => { //the deletion endpoint
    const account = getCurrentAccount(req);

    if (!account) { //if the use is not logged in, return 401
        res.status(401).send('Not logged in');
        return;
    }

    if (!req.query.id || !req.query.recipeid) {
        res.status(400).send('missing parameter');
        return;
    }
    const ingred = {
        id: req.query.id,
        recipeid: req.query.recipeid
    };

    if (shopItems[account.Username]) {
        shopItems[account.Username] = shopItems[account.Username].filter(x => !compareitem(x,ingred));
    }

    fs.writeFileSync(__dirname + '/shopping.txt', JSON.stringify(shopItems)); //update shopping.txt file

    res.status(200).send('success');
});

router.get('', (req, res) => {
    const account = getCurrentAccount(req);

    if (!account) { //if the use is not logged in, return 401
        res.status(401).send('Not logged in');
        return;
    }

    if (shopItems[account.Username]) {
        res.status(200).send(shopItems[account.Username]);
    } else {
        res.status(200).send([]);
    }
});

module.exports.router = router;