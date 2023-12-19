require("dotenv").config();
const AWS = require('aws-sdk');
const { Upload } = require("@aws-sdk/lib-storage");
const { S3Client } = require("@aws-sdk/client-s3")
const fs = require('fs')

// const s3 = new AWS.S3({
//     region: process.env.REGION,
//     accessKeyId: process.env.ACCESS_KEY,
//     secretAccessKey: process.env.SECRET_KEY
// });

const s3 = new S3Client({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY
    },
})

const bucketName = process.env.BUCKET_NAME

// const uploadVideo = (file) =>{
//     try {

//         const fileContent  = fs.readFileSync(file.tempFilePath)
//         console.log(fileContent);
//         const params = {
//             Bucket: bucketName,
//             Key: file.name,
//             Body: fileContent,
//             ContentType: file.mimetype
//         }
    
//         s3.upload(params, (err, data) => {
//             if (err) {
//               console.error('Error uploading video:', err);
//             } else {
//               console.log('Video uploaded successfully. S3 location:', data);
//             }
//           });
        
//     } catch (error) {
//         console.log(error)
//     }
// }

const uploadVideo = async (file) =>{
    
    
    try {
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
			console.log(progress)
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