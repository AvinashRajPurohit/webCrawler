// third party imports
import http from 'http';
import express from 'express';
import * as socketio from 'socket.io';

// project module imports
import * as ops from './db/operations';
import { processCrawling } from './crawler/core';
import { QUEUE_NAME } from './db/constants';
import { createTables } from './db/prepare_db';
import { JobStatus } from './utils/enum';
import { insertResultScheme, jobQueueScheme, updateQueueStatusScheme } from './utils/schema';


// Initialize the express engine
const app: express.Application = express();
const port: number = 4000;
app.use(express.json())

// Initialize Socket.io
const httpServer = http.createServer(app);
const server = new socketio.Server(httpServer, {
  cors:{
    origin: "*"
  }
})

let timeChange: any;
server.on("connection", (socket) => {
  console.log("connected")

  socket.on('disconnect', function () {
    // server disconnect
    console.log('disconnect server event....');
  });

  socket.on('getData', async function(data) {
    // work when client ask for graph and table data per 2 MS
    var isData = await ops.queueAvailableOrNot(QUEUE_NAME)
    if (isData){
      // if queue is available
      if (timeChange) clearInterval(timeChange)
      setInterval(async () => socket.emit("queueData", 
                {"data": await ops.getGraphDataByQueueName(QUEUE_NAME),
                "table_data": await ops.getTableDataByQueueName(QUEUE_NAME)}
                ), 2000)
    }else{
      // if queue is not available
      console.log("no available")
      socket.emit("queueData", {"message": "Queue not available.."});
    }
  });
})



app.get('/', (_req, _res) => {
    // Health Check
    _res.send("Health check");
  
});


app.post('/add/crawling', async (req, res) =>{
  // api for add crawling
  const {error, value} = jobQueueScheme.validate(req.body);
  
  if (error){
    console.log(error);
    return res.send("Invalid Request.");
  }
  // check at least processed once using job url
  let job_id = await ops.isJobAlreadyProcessed(value.job_url);
  if (job_id != null) {
    let result_data = await ops.getResultByJobId(job_id);
    return res.send({"message": `Crawler job already processed: ${job_id}`,
                     "results": result_data.rows[0]});
  }
  try{
    var data = await ops.addJob(QUEUE_NAME, value.job_url, value.job_name)
  }catch(err){
      if (err.code == "23505") {
          console.error(err.message);
          return res.status(400).send({"message": `Job already exists..`});

        } else {
          console.error(err.message);
          return res.status(500).send({"message": `Something Went Wrong!`});
        }
  }

  console.log('processing queue job id: ', data.id);

  await processCrawling(data.id);
  return res.send({"message": `Crawler job is processing for id: ${data.id} and job_id: ${data.job_id}`});
})


app.post('/update/crawling', async (req, res) =>{
  // api for update crawling job
  const {error, value} = updateQueueStatusScheme.validate(req.body);

  if (error){
    console.log(error);
    return res.send("Invalid Request.");
  }

  var data = await ops.updateJobStatus(value.job_id, value.status)

   if (data.rowCount == 0) return res.status(404).send({"message": "Data Not Available"})
   else return res.send(data.rows[0]);
  })

app.post('/get/job', async (req, res) =>{
  // api for get job based on id
  const {error, value} = updateQueueStatusScheme.validate(req.body);

  if (error){
    console.log(error);
    return res.send("Invalid Request.");
  }
  var data = await ops.getJobQueryById(value.job_id)

  if (data.rows.length == 0) return res.status(404).send({"message": "Data Not Available"})
  else return res.send(data.rows[0]);
})

app.post('/get/enqueued/job', async (req, res) =>{
  // api get an single enqueued job
  var data = await ops.getEnqueuedJob()
  if (data.rows.length == 0) return res.status(404).send({"message": "Data Not Available"})
  else return res.send(data.rows[0]);
})

app.get('/get/jobs/:status', async (req, res) => {
  // api to get job based on different-different status 
  var status: JobStatus = JobStatus[req.params['status']]
  var data = await ops.getJobQueryResultByStatus(status)

  if (data.rows.length == 0)return res.status(404).send({"message": "Data Not Available"})
  else return res.send(data.rows);
})
 
app.post('/add/result', async (req, res) =>{
    // api to insert job result
  const {error, value} = insertResultScheme.validate(req.body);

  if (error){
    console.log(error);
    return res.send("Invalid Request.");
  }
  var data = await ops.insertJobResult(value.title, value.brand, value.image_url, value.job_id)
  console.log(data)
  return res.send({"message": "result has been added", "id": data});
})



// Server setup
httpServer.listen(port, () => {
    console.log(`TypeScript with Express
         http://localhost:${port}/`);
    // setting up tables..
    createTables()
});
