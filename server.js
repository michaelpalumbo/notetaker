const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const { v4: uuidv4 } = require('uuid');
const PORT = process.argv.PORT || 3000
const host = '0.0.0.0';

let db = JSON.parse(fs.readFileSync(path.join(__dirname, '/Develop/db/db.json')))
//middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/Develop/public')))
app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, '/Develop/public/index.html'))
})

app.get('/notes', (req, res) =>{
    res.sendFile(path.join(__dirname, '/Develop/public/notes.html'))
})

// get saved notes:
app.get('/api/notes', (req, res) =>{
    res.json(db)
})
// save a new note
app.post('/api/notes', (req, res) => {
    // receive a new note
    let newNote = req.body
    // use an npm package to generate a unique id for this note
    newNote.id = uuidv4()
    // add it to the db.json file
    db.push(newNote)
    fs.writeFileSync(path.join(__dirname, '/Develop/db/db.json'), JSON.stringify(db, null, 4))
    // return the new note to the client
    res.json(db)
})

app.delete('/api/notes/:id', (req, res) => {
    for(i=0; i<db.length; i++){
        if(db[i].id === req.params.id){
            db.splice(i, 1)
            fs.writeFileSync(path.join(__dirname, '/Develop/db/db.json'), JSON.stringify(db, null, 4))
            // return the new note to the client
            res.json(db)
        }
    }
})
app.listen(PORT, host, ()=> {
    console.log('listening on PORT', PORT)
})