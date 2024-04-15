const fs = require('fs')
const path = require('path')
function uploadHumanPhoto(file, name) {
    const dirToSave = path.join(__dirname, "photos", name)
    fs.writeFileSync(dirToSave, file)
}
module.exports = uploadHumanPhoto