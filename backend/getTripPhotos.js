const fs = require('fs')
const path = require('path')
function getPhotos() {
    const tripsFolerDir = path.join(__dirname, "trips")
    const listOfPhotos = fs.readdirSync(tripsFolerDir)
    let listOfPaths = []
    for (photo of listOfPhotos) {
        listOfPaths.push(path.join(tripsFolerDir, photo))
    }
    console.log(listOfPaths)
    for (photo of listOfPaths) {
        console.log(photo)
        console.log(fs.statSync(photo)["mtime"])
    }
}
getPhotos()