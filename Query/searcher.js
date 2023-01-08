const fs = require('fs');
const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
const dist = require('js-levenshtein')

const src = require('./Dataset.json');

const index = require('./indexxed.json')

function getinput() {
    rl.question('Enter a search term: ', (search) => {
        search = search.toLowerCase().match(/[a-z]+/)[0]

        let min = {dist:Number.POSITIVE_INFINITY} //the word with the least distance to the search term

        for (let k in index) {
            let d = dist(k, search)
            if (d < min.dist) {
                min = {str:k,dist:d}
            }
        }

        index[min.str].forEach((k,i) => {
            // console.log(src.find(x => x.id === k).title)
        })

        // console.log()

        getinput()
    });
}
getinput()