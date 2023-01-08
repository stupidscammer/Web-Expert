const fs = require('fs')
const express = require('express')
const crypto = require('crypto')
const router = express.Router()

router.use(express.urlencoded({extended:true}))

const REDIRECT = '/admin'

let accounts = null;
{
    const input = fs.readFileSync(__dirname + '/Accounts.txt', 'utf8')
    if (input) {
        accounts = JSON.parse(input); //read accounts from file
    } else {
        accounts = []
    }
}

let logins = [] //keep track of log in (this resets everytime)

router.post('/', (req, res) => {
    let account = accounts.find(x => x.Username === req.body.username)

    if (!account || account.Password !== req.body.password) {
        res.status(401).send({result: false});
    } else {
        //update server-side logins
        const token = crypto.randomBytes(12).toString('hex');
        //set cookie on the client
        // console.log({'token': token, username: req.body.username, result: true})
        res.send({'token': token, username: req.body.username, result: true})
    }
});

router.post('/signup', (req, res) => {
    // let html = fs.readFileSync(__dirname + '/login.html', 'utf8');
    // html = html.replace('$$PWERR', 'hidden');
    // console.log(req.body)
    if (accounts.find(x => x.Username === req.body.regusername)) { //if an account already exist with given name
        // html = html.replace('$$AEERR', ''); //show the account already exists error
        // html = html.replace('$$PCERR', 'hidden'); //hide the unmatched password error
        // console.log('---------->>>>>>>>>>')
        res.send({'token': '', username: '', result: falase})
    } else {
        // html = html.replace('$$AEERR', 'hidden'); //show the account already exists error
        if (req.body.regpassword !== req.body.regconfirmpass) {
            // html = html.replace('$$PCERR', ''); //show the password doesn't match error
            // console.log('ConfirnPassword Error---------->>>>>>>>>>')
            res.send({'token': '', username: '', result: falase})
        } else {
            // html = html.replace('$$PCERR', 'hidden');
            //update accounts
            delete req.body.regconfirmpass;
            accounts.push(req.body);
            fs.writeFileSync(__dirname + '/Accounts.txt', JSON.stringify(accounts)); //update accounts file
            //update server-side logins
            const token = crypto.randomBytes(12).toString('hex');
            logins.push({ token: token, account: req.body.regusername })
            // console.log('Signup Success---------->>>>>>>>>>')
            res.send({'token': token, username: req.body.regusername, result: true})
            //set cookie on the client
            // res.cookie('LoginID', token, { httpOnly: true })

            // res.redirect(REDIRECT) //redirect to whatever is set for redirection constant
            // return
        }
    }
    // res.send(html);
});

function getCurrentAccount(req) {
    // let token=localStorage.getItem("token")
    // if(token){
    //     let username=localStorage.getItem("username", res.data.username)
    //     const mapping = logins.find(x => x.token === token)
    //     if (mapping) {
    //         return accounts.find(x => x.Username == mapping.account);
    //     }
    // }
    return req;
    
    // let LoginID = req.get('Cookie')

    // if (!LoginID) {return} //if there is no cookie, return nothing

    // LoginID = LoginID.match(/LoginID=([0-9a-f]+)/)

    // if (!LoginID) { return } //if the cookie doesn't contain a match, return nothing

    // LoginID = LoginID[1]

    // const mapping = logins.find(x => x.token === LoginID)

    // if (mapping) {
    //     return accounts.find(x => x.Username == mapping.account);
    // }
}

router.post('/logout', (req, res) => {
    let LoginID = req.get('Cookie')

    if (!LoginID) { return } //if there is no cookie, return nothing

    LoginID = LoginID.match(/LoginID=([0-9a-f]+)/)

    if (!LoginID) { return } //if the cookie doesn't contain a match, return nothing

    LoginID = LoginID[1]

    logins = logins.filter(x => x.token !== LoginID)

    res.status(200).end()
})

router.get('/status', (req, res) => {
    const account = getCurrentAccount(req);
    if (account) {
        delete account.Password
        delete account.ConfirmPassword
        res.send(account);
    } else {
        res.status(401).send({error:'not logged in'})
    }
})

module.exports.router = router
module.exports.getCurrentAccount = getCurrentAccount