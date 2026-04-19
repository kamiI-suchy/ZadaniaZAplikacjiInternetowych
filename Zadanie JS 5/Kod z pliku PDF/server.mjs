import express from 'express';

const 
    app = express(),
    port = 3000;

app.get('/',
    (req, res) => res.send('From MyApp')
)

app.get('/about',
    (req, res, next) => {
        console.log('%s %s - %s', (new Date).toString(), req.method, req.url),
        next()
    }
) 

app.get('/about',
    (req, res) => res.send('My About')
)

app.get('/about/contact',
    (req, res) => res.send('My Contact')
)

app.use('myStorage', express.static('myimages'))

app.get('/user/:userid/book/:bookid', (req, res, next) => {
    const aUserId = req.params.userid,
        aBookId = req.params.bookid

    console.log(`UserID=${aUserId}`)
    console.log(`BookID=${aBookId}`)

    if ('45' !== aUserId) {
        next(403)
        return
    }
    res.rmaes = {
        UserID: aUserId,
        BookID: aBookId
    }
    next();
})

app.get('/user/:userid/book/:bookid', 
    (req, res) => {
        const rmaes = res.rmaes;
        res.send(`My user=${rmaes.UserID} and My Book=${rmaes.BookID}`)
})

app.use(function (err, req, res, next) {
    res.status(err).send('My error')
})

app.listen(port, 
    () => console.log(`MyServer ready on http://localhost:${port}!`)
)