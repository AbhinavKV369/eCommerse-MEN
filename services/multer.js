const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null,"public/uploads");
    },
    filename: (req, file, cb) =>{ 
        const ext = path.extname(file.originalname);
       
        cb(null, Date.now() + ext);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
