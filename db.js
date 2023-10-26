const mongoose= require('mongoose');
const mongoURI="mongodb+srv://rangan:Xtremeranga1234@cluster0.kzgavdp.mongodb.net/notebook";


const connectToMongo=()=>{
    mongoose.connect(mongoURI)
    console.log("Connected to db successfully")
}

module.exports= connectToMongo;