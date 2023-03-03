const path = require('path')
const express = require("express")
const fs = require("fs")
const database = require("./db/db.json")

const PORT = process.env.PORT || 3001
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"))
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})

app.get('/api/notes', (req, res) => {
    res.json(database)
})

app.post('/api/notes', (req, res) => {
    const newNote = createNote(req.body, database)
    res.json(newNote)
})

const createNote = (body, notesArr) => {
    let newNote = body;
    if (!Array.isArray(notesArr)) {
        notesArr = []
    }
    body.id = notesArr.length;
    notesArr.push(newNote)
    fs.writeFileSync(
        path.join(__dirname, "./db/db.json"),
        JSON.stringify(notesArr, null, 2)
    )
    return newNote
}

app.delete("/api/notes/:id", (req, res) => {
    deleteNote(req.params.id, database)
    res.json(true)
})

const deleteNote = (id, notesArr) => {
    for (let i = 0; i < notesArr.length; i++) {
        let note = notesArr[i]
        if (note.id == id) {
            notesArr.splice(i, 1)
            fs.writeFileSync(
                path.join(__dirname, "./db/db.json"),
                JSON.stringify(notesArr, null, 2)
            )

        }
    }
}


app.listen(PORT, () => {
    console.log("app listening at http://localhost:3001")
})