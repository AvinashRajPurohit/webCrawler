// project module imports
import { db_pool } from './operations';
import { createJobQueueTableSql, createResultTableSql } from './queries';

// Function for creating tables
export async function createTables(){
    var db_client = await db_pool.connect()
    await db_client.query(createJobQueueTableSql + " " + createResultTableSql);
    db_client.release()
}
