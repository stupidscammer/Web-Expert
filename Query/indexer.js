let op = {};

const src = require('./Dataset.json');

src.forEach((recp, i) => {
    recp.title.toLowerCase().replace(/[^a-z-\s]/g, '').split(/[\s-]+/g).forEach((word, i) => {
        if (!op[word]) op[word] = []
        op[word].push(recp.id)
    });
});

fs.writeFileSync('indexxed.json', JSON.stringify(op), { encoding: 'utf8' });