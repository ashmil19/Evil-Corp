require("dotenv").config();
const { Upload } = require("@aws-sdk/lib-storage");
const { S3Client } = require("@aws-sdk/client-s3")
const fs = require('fs')

const s3 = new S3Client({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY
    },
})

const bucketName = process.env.BUCKET_NAME

// const onUploadProgress = (socket, progress)=>{
//     socket.emit("videoUploadProgress", {progress})
// }

const uploadVideo = async (file) =>{
    
    
    try {
        // let socket;
        // if(args.length > 0){
        //     socket = args[0];
        // }

        const fileContent  = fs.readFileSync(file.tempFilePath)
        console.log(fileContent);

        const params = {
            Bucket: bucketName,
            Key: file.name,
            Body: fileContent,
            ContentType: file.mimetype,
        }

        const uploadParallel = new Upload({
            client: s3,
            queueSize: 4,
            partSize: 5542880,
            leavePartsOnError: false,
            params,
        })

        uploadParallel.on("httpUploadProgress", progress => {
            const percentProgress = Math.round((progress.loaded / progress.total) * 100)
			console.log(`Upload Progress: ${percentProgress}%`);
            // if(socket){
            //     onUploadProgress(socket, percentProgress)
            // }
		})

        const data = await uploadParallel.done()
        return {
            public_id: data.Key,
            url: data.Location
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    uploadVideo,
}