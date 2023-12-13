const cloudinary = require('cloudinary').v2;
const { randomUUID } = require('crypto');


const imageUpload = async (file)=>{
    try{

        const result = await cloudinary.uploader.upload(file.tempFilePath,{
            public_id: `${randomUUID()}`,
            resource_type: "auto",
            folder: "EvilCorp",
            transformation: [
                {width: 1280, height: 720, crop: "fill", gravity: "auto", quality: 80}
            ]
        })

        const myResultObj = {
            public_id: result.public_id,
            url: result.url,
        }
        
        return myResultObj;

    }catch(err){
        console.log(err);
    }
}


module.exports = {
    imageUpload
}