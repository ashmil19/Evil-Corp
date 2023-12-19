require('dotenv').config()
const { Worker } = require('bullmq');
const {Jobs} = require('./jobs');

const workerHandler = async (job) => {
    switch(job.data.type){
        case Jobs.videoUpload: {
            console.log("Hello world", job.data);
            return;
        }

        // case "DoSomeHeavyComputing": {
        //     console.log("starting job", job.data);
        //     job.updateProgress(10);

        //     let sum = 0;
        //     for(let i=0; i<100000; i++){
        //         sum = sum + i;
        //         console.log(sum);
        //     }

        //     job.updateProgress(100);
        //     console.log("finished job", job.name);
        //     return;
        // }

        // case "MayFailOrNot": {
        //     if(Math.random() > 0.3){
        //         console.log(`FAILED ;(- ${job.data.data.magicNumber})`);
        //         throw new Error("something went wrong");
        //     }
            
        //     console.log(`COMPLETED ;(- ${job.data.data.magicNumber})`);
        //     return "done";
        // }
    }
};

const workerOptions = {
    connection: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
};

const worker = new Worker("testQueue", workerHandler, workerOptions);

console.log("worker Started");
