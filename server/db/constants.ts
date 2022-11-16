// Postgres db string
const postgreStrKey: string = "POSTGRE_STR"
export const postgreStr: any = process.env[postgreStrKey];
export const JOB_QUEUE_TABLE_NAME = "jobs_queue";
export const RESULT_TABLE_NAME = "results";
export const QUEUE_NAME = "flaconi_queue"