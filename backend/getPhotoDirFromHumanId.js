const fs = require("fs")
const path = require("path")
function getPhotoDir(humanId) {
    let defaultPhotoDir = path.join(__dirname, "photos", `${humanId.toString()}.jpg`)
    if (fs.existsSync(defaultPhotoDir)) {
        return defaultPhotoDir
    }
    else {
        return path.join(__dirname, "photos", "anonymous.jpg")
    }
}
module.exports = getPhotoDir