// project module imports
import { JOB_QUEUE_TABLE_NAME, RESULT_TABLE_NAME } from "./constants"

// For creating tables queries
export const createJobQueueTableSql: string = `CREATE TABLE IF NOT EXISTS ${JOB_QUEUE_TABLE_NAME} (
                                        id bigserial PRIMARY KEY,
                                        created_at timestamptz NOT NULL DEFAULT NOW(),
                                        updated_at timestamptz NOT NULL DEFAULT NOW(),
                                        job_id text NULL UNIQUE,
                                        job_url text UNIQUE NOT NULL,
                                        job_name text NOT NULL,
                                        queue_name text NOT NULL,
                                        status text NOT NULL DEFAULT 'enqueued'
                                    );
                                    CREATE INDEX IF NOT EXISTS ${JOB_QUEUE_TABLE_NAME}_queue_name_idx ON ${JOB_QUEUE_TABLE_NAME}(queue_name);
                                    CREATE INDEX IF NOT EXISTS ${JOB_QUEUE_TABLE_NAME}_state_idx ON ${JOB_QUEUE_TABLE_NAME}(status);
                                    `

export const createResultTableSql: string = `CREATE TABLE IF NOT EXISTS ${RESULT_TABLE_NAME} (
                                        id SERIAL PRIMARY KEY,
                                        brand TEXT NOT NULL,
                                        jobs_queue_id INT NOT NULL UNIQUE,
                                        title TEXT NOT NULL,
                                        image_url TEXT NOT NULL,
                                        created_at timestamptz NOT NULL DEFAULT NOW(),
                                        updated_at timestamptz NOT NULL DEFAULT NOW(),
                                        CONSTRAINT fk_jobs_queue FOREIGN KEY(jobs_queue_id) REFERENCES jobs_queue(id)
                                        );`



// Insert Queries

export const insertInJobQueueQuery: string = `INSERT INTO ${JOB_QUEUE_TABLE_NAME} (queue_name, job_url, job_name, job_id)
                                        VALUES ($1, $2, $3, $4) RETURNING *;`

export const insertJobResultQuery: string = `INSERT INTO results (title, brand, image_url, jobs_queue_id)
                                        VALUES ($1, $2, $3, $4)
                                        RETURNING *`

// Update Queries
export const updateQueueJobStatusQuery: string = ` UPDATE ${JOB_QUEUE_TABLE_NAME}
                                            SET status = '{0}',
                                            updated_at = '{1}'
                                            WHERE id = '{2}'
                                            RETURNING *;`


// Get Queries
export const getJobByUrlQuery: string = `SELECT *
                                    FROM ${JOB_QUEUE_TABLE_NAME}
                                    WHERE job_url = '{0}';`

export const getResultByJobIdQuery: string = `SELECT *
                                        FROM ${RESULT_TABLE_NAME}
                                        WHERE jobs_queue_id = '{0}';`

export const getJobByStatusQuery: string  = `SELECT *
                                        FROM ${JOB_QUEUE_TABLE_NAME}
                                        WHERE status = '{0}';`

export const getJobByIdQuery: string =  `SELECT *
                                        FROM ${JOB_QUEUE_TABLE_NAME}
                                        WHERE id = '{0}';`

export const getAnEnqueuedJobQuery: string = `SELECT *
                                            FROM ${JOB_QUEUE_TABLE_NAME}
                                            WHERE status = 'enqueued' limit 1;`

export const getJobByQueueNameQuery: string = `Select Count(id)  FROM ${JOB_QUEUE_TABLE_NAME}
                                            where queue_name = '{0}'`

export const getGraphtDatabyQueueNameQuery: string = `Select status, count(1) FROM ${JOB_QUEUE_TABLE_NAME} 
                                                where queue_name = '{0}' group by status;` 
                                    
export const getTableDataByQueueNameQuery: string = `select rs.*, jq.job_name from ${JOB_QUEUE_TABLE_NAME} jq inner join 
                                    ${RESULT_TABLE_NAME} rs on jq.id = rs.jobs_queue_id and jq.queue_name = '{0}'
                                    ORDER BY rs.created_at Desc Limit 10;`
                                    
// BEGIN & COMMIT Queries
export const beginQuery: string = "BEGIN;"
export const commitQuery: string = "COMMIT;"
