const userModel = require('../../models/userModel');

const getStudents = async (req, res)=>{
    try {

        const students = await userModel.find({role: 2000})
        console.log(students);
        res.status(200).json({students})
        
    } catch (error) {
        console.log(error);
    }
}

const updateAccess = async (req, res)=>{
    try {
        const id = req.params.id;
        const {isAccess} = req.body
        console.log(typeof isAccess);
        const updatedUser = await userModel.findByIdAndUpdate(id,{$set: {isAccess: !isAccess}},{new: true});
        res.status(200).json({message: 'access updated',updatedUser})
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    getStudents,
    updateAccess,
}