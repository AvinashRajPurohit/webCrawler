import React, {useState, useEffect} from "react";
import io from 'socket.io-client';
import { Bar } from '@ant-design/plots';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Table, TableBody } from "@mui/material";

const socket = io("http://116.203.117.119:4000/");
function createJobData(
  // Create object of job data
  job_name,
  title,
  brand,
  created_at,
  image_url
) {
  return { job_name, title, brand, created_at, image_url};
}

function App() {

  const [data, setData] = useState("");
  const [table, setTable] = useState("");

  var jobData = []
  var resultData = []

  useEffect(() => {

    // handle when socket connnect
    socket.on('connect', () => {
      console.log("connected")

    });

    // handle when socket disconnect
    socket.on('disconnect', function () {
      console.log('disconnect client event....');
      socket.emit('getData')
    });

    // If there is any available queue in database show chart and table
    socket.emit('getData')
    socket.on("queueData", (q_data) =>{
      // Setting Up Chart Data Start Here
      if ("message" in q_data){
        // If there is no available queue in database
        setData(<h1>{q_data.message}</h1>);
      }else{
        // If there is any available queue in database show chart and table
        for (var key in q_data.data){
          var obj = {"status": key, "value": q_data.data[key]}
          jobData.push(obj)
        }
        const config = {
          data:jobData,
          xField: 'value',
          yField: 'status',          
          legend: {
            position: 'top-left',
            
          },
        
        };
   
        setData(<Bar {...config} />)
        jobData = []

        // Setting Up Chart Data End Here

        // Setting Up Table Data Start Here
        for (var j in q_data.table_data){
          var r = q_data.table_data[j]
          resultData.push(createJobData(r.job_name, r.title, r.brand, r.created_at, r.image_url))
        }
        var table_data = (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Job Name)</TableCell>
                  <TableCell align="right">Brand</TableCell>
                  <TableCell align="right">Title</TableCell>
                  <TableCell align="right">Created At</TableCell>
                  <TableCell align="right">Image Url</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resultData.map((row) => (
                  <TableRow
                    key={row.job_name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.job_name}
                    </TableCell>
                    <TableCell align="right">{row.brand}</TableCell>
                    <TableCell align="right">{row.title}</TableCell>
                    <TableCell align="right">{row.created_at}</TableCell>
                    <TableCell align="right"><a target="_blank" rel="noopener noreferrer" href={row.image_url}>{row.brand}</a></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
        setTable(table_data)
        resultData = []
        // Setting Up Table Data End Here
      }
    })
  }, []);
  // return app data
  return (
    <div className="App">
      <h2>Chart for Visualizing Job Queue Status</h2>
      {data}
      <br></br>
      <hr></hr>
      <h1>Job Results</h1>
      {table}
    </div>
  );
}

export default App;
