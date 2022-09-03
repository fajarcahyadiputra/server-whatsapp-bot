const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { extname } = require("path");


const storageMultiple = (dir) => {
    multer.diskStorage({
        destination: function (req, file, cb) {
            var dir = 'public/images/' + dir;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    })
}

//untuk upload image multiple
const uploadMultiple = (dir, name) => {
    multer({
        storage: storageMultiple(dir),
        limits: { fileSize: 10000000 },
        fileFilter: function (req, file, cb) {
            checkFileType(file, cb);
        }
    }).array(name, 12);
}


// Set storage engine
const storage = (dir) => {
    return multer.diskStorage({
        destination: "public/images/" + dir,
        filename: function (req, file, cb) {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    });
}

const uploadSingle = (name, dir) => {
    return multer({
        storage: storage(dir),
        limits: { fileSize: 1000000 },
        fileFilter: function (req, file, cb) {
            checkFileType(file, cb);
        }
    }).single(name);
}

// // Check file Type
function checkFileType(file, cb) {

    // Allowed ext
    const fileTypes = /jpeg|jpg|png/;
    // Check ext
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType && extName) {
        return cb(null, true);
    } else {
        cb("Error: Images Only !!!");
    }
}

module.exports = { uploadMultiple, uploadSingle };