const fs = require('fs');
const express = require('express');
const router = express.Router();

router.use(express.json({ extended: true })); //to parse query requests

const dist = require('js-levenshtein'); //levenstein distance is used to compare similarity of words
const src = require('./Dataset.json');
const index = require('./indexxed.json');


router.get('', (req, res) => {
    const recipe = req.query.recipe.toLowerCase().match(/[a-z]+/g);

    const search = recipe[0];

    let min = { dist: Number.POSITIVE_INFINITY }; //the word with the least distance to the search term

    for (let k in index) {
        let d = dist(k, search);
        if (d < min.dist) {
            min = { str: k, dist: d };
        }
    }

    let result = { data: [] };

    index[min.str].forEach((k, i) => {
        result.data.push(src.find(x => x.id === k));
    })

    res.send(result)
});

module.exports.router = router;
