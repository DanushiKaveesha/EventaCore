const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    president:{
        type:String,
        required:true
<<<<<<< HEAD
    },

    category:{
        type:String,
        required:true
    },

    location:{
        type:String,
        required:true
    },

    contact_information:{
        type:String,
        required:true
    },

    image:{
        type:String,
        required:false
=======
>>>>>>> c2a0ea9ca9cdbaf69a3c34f73ada06cf37320e24
    }

},
{timestamps:true}
);

module.exports = mongoose.model("Club", clubSchema);