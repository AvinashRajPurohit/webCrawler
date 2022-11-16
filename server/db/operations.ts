// Third party imports
import pg from "pg";
import MD5 from "crypto-js/md5";
import {v4 as uuidv4} from 'uuid';
// project modules imports
import * as q from './queries';
import { FormatString, getSqlDate } from '../utils/helper';
import { JobStatus } from '../utils/enum';
import {postgreStr} from './constants'


export const db_pool: pg.Pool = new pg.Pool({ connectionString: postgreStr, max: 25 })

export const addJob = async (
    // function for adding job in queue
    queue_name: string,
    job_url: string,
    job_name: string,
    ): Promise<{ id: number, job_id: string }> => {

    const db_client = await db_pool.connect()
    let job_uuid = uuidv4();

    const insertResult = await db_client.query(q.insertInJobQueueQuery, [queue_name, job_url, 
                                                job_name, MD5(job_uuid).toString()])
    let id: number = insertResult.rows[0].id 
    let job_id: string = insertResult.rows[0].job_id
    db_client.release()
    return {id: id, job_id: job_id}
  }

export const updateJobStatus = async (job_id: number, status: JobStatus): Promise<any> => {
    // function for updating job status
    const db_client = await db_pool.connect()
    await db_client.query(q.beginQuery)
    
    const data = await db_client.query(
                FormatString(q.updateQueueJobStatusQuery, 
                status, getSqlDate(), String(job_id)))

    await db_client.query(q.commitQuery)
    db_client.release()

    return data
}


export const getJobQueryResultByStatus = async (status: JobStatus): Promise<any> => {
    // function for get job result by status
    const db_client = await db_pool.connect()
    await db_client.query(q.beginQuery)

    const taskQueryResult = await db_client.query(FormatString(q.getJobByStatusQuery, status))

    await db_client.query(q.commitQuery)
    db_client.release()

    return taskQueryResult
}

export const getJobQueryById = async (job_id: number): Promise<any> => {
    // funciton get job query by id
    const db_client = await db_pool.connect()
    await db_client.query(q.beginQuery)

    const taskQueryResult = await db_client.query(
     FormatString(q.getJobByIdQuery, String(job_id))
    )

    await db_client.query(q.commitQuery)
    db_client.release()

    return taskQueryResult
}


export const getEnqueuedJob = async (): Promise<any> => {
    // function for geting enqueued job
    const db_client = await db_pool.connect()

    const taskQueryResult = await db_client.query(q.getAnEnqueuedJobQuery)

    db_client.release()
    return taskQueryResult
}
export const insertJobResult = async (title: string, brand: string, 
                              image_url: string, job_id: number): Promise<any> => {
    // function to insert job result
    const db_client = await db_pool.connect()

    const insertResult = await db_client.query(q.insertJobResultQuery,
                              [title, brand, image_url, job_id])
    let id: number = insertResult.rows[0].id 

    db_client.release()
    return id
    
}

export const queueAvailableOrNot = async (queue_name: string) => {
  // function to check queue available in database or not 
  const db_client = await db_pool.connect()

  const jobsCount = await db_client.query(FormatString(q.getJobByQueueNameQuery, queue_name))
  var count = Number(jobsCount.rows[0].count)

  db_client.release()

  if (count > 0){
    return true;
  }
  return false;

}

export const getGraphDataByQueueName = async (queue_name: string) => {
  // function to get graph data
  var result = {"completed": 0, "enqueued": 0,
                "in_progress": 0,"failed": 0}

  var count = 0;
  const db_client = await db_pool.connect()
  const data = await db_client.query(FormatString(q.getGraphtDatabyQueueNameQuery, queue_name))

  data.rows.forEach(function(value){
    count += Number(value.count)
    result[value.status] = Number(value.count)
  });

  db_client.release()
  return result;
}


export const getTableDataByQueueName = async (queue_name: string) => {
  // function to get table data
  const db_client = await db_pool.connect()

  const data = await db_client.query(FormatString(q.getTableDataByQueueNameQuery, queue_name))

  db_client.release()
  return data.rows;
}

export const getJobQueryByUrl = async (job_url: string): Promise<any> => {
  // funciton get job query by job url
  const db_client = await db_pool.connect()

  const taskQueryResult = await db_client.query(
   FormatString(q.getJobByUrlQuery, job_url))

  db_client.release()

  return taskQueryResult.rows
}

export const getResultByJobId = async (job_id: number): Promise<any> => {
  // funciton get job result by job id
  const db_client = await db_pool.connect()

  const taskQueryResult = await db_client.query(
   FormatString(q.getResultByJobIdQuery, String(job_id)))

  db_client.release()

  return taskQueryResult
}

export const isJobAlreadyProcessed = async (job_url: string): Promise<any> => {
    // function to check is job is processed or not based on job url 
    let data = await getJobQueryByUrl(job_url);

    if (data.length > 0) return data[0].id
    return null
}
