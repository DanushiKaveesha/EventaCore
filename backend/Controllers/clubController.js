const Club = require("../Models/clubModel");


// Create Club
exports.createClub = async (req,res) => {

    try{
<<<<<<< HEAD
        const clubData = req.body;
        if (req.file) {
            clubData.image = `/uploads/${req.file.filename}`;
        }

        const club = new Club(clubData);
=======

        const club = new Club(req.body);
>>>>>>> c2a0ea9ca9cdbaf69a3c34f73ada06cf37320e24
        const savedClub = await club.save();

        res.status(201).json(savedClub);

    }catch(error){

        res.status(500).json({message:error.message});

    }
};



// Get All Clubs
exports.getAllClubs = async (req,res) => {

    try{

        const clubs = await Club.find();
        res.status(200).json(clubs);

    }catch(error){

        res.status(500).json({message:error.message});

    }
};



// Get Single Club
exports.getClubById = async (req,res) => {

    try{

        const club = await Club.findById(req.params.id);
        res.status(200).json(club);

    }catch(error){

        res.status(500).json({message:error.message});

    }
};



// Update Club
exports.updateClub = async (req,res) => {

    try{

        const updatedClub = await Club.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );

        res.status(200).json(updatedClub);

    }catch(error){

        res.status(500).json({message:error.message});

    }
};



// Delete Club
exports.deleteClub = async (req,res) => {

    try{

        await Club.findByIdAndDelete(req.params.id);

        res.status(200).json({message:"Club deleted successfully"});

    }catch(error){

        res.status(500).json({message:error.message});

    }
};