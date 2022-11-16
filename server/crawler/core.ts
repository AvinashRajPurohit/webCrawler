// third party imports
import cheerio from "cheerio";
import request from "request-promise";

// project modules imports
import { JOB_QUEUE_TABLE_NAME } from "../db/constants";
import { db_pool } from "../db/operations";
import { JobStatus } from "../utils/enum";
import { insertResultPath, updateCrawlerPath } from "./constants";

export async function getScrapInfo(url: string) {
    // Function for getting scrap data from falconi 
    var brand: any;
    var title: any;
    var image_url: any;
    try {
        const response = await request({
            uri: url,
            headers: {
                "accept": "*/*",
                "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,hi;q=0.7"},
            gzip: true
        })
        const $ = cheerio.load(response)
        const brand = $('h1[class="BrandProductNameAndTypestyle__Wrapper-sc-117vbmi-0 ihnFtO"] > a').text().trim()
        const title = $('span[class="BrandProductNameAndTypestyle__BrandName-sc-117vbmi-2 hRyxVn"]').text().trim()
        const image_url = $('img[class="ProductPreviewSliderstyle__Image-sc-1t0tp5v-2 grpdtf"]')['0'].attribs.src
        return {brand: brand, title: title, image_url: image_url}

    } catch (error) {
        console.log(error.message)
        return {brand: brand, title: title, image_url: image_url}

    }
}

// function for custom request 
export async function customRequest(uri: string, body: any){
    console.log("here is calling")
    var response = await request.post({
        uri: uri,
        body: body,
        headers:{ 'Content-Type': 'application/json'},
        json: true
    })
    return response
}

// Function for process crawling..
// as mentioned crawler is interecting with DB throught apis
export async function processCrawling(id: number){

    const db_client = await db_pool.connect();
    await db_client.query("BEGIN")
    const taskQueryResult = await db_client.query(
      ` SELECT *
        FROM ${JOB_QUEUE_TABLE_NAME}
        WHERE id = '${id}' FOR UPDATE SKIP LOCKED`,
    )
    var data = taskQueryResult.rows[0]
    customRequest(updateCrawlerPath, {job_id: data.id, status: JobStatus.in_progress})
    var crawlerData = await getScrapInfo(data.job_url)

    console.log(`crawling is processing for job id ${data.id}`)

    // Check data validation
    if (crawlerData.brand == undefined || crawlerData.title == undefined || crawlerData.brand == undefined){
        // mark this job as failed.
        customRequest(updateCrawlerPath, {job_id: data.id, status: JobStatus.failed})
    }else{
        // store the result and mark this job as completed
        customRequest(insertResultPath, {brand: crawlerData.brand, 
                                                title: crawlerData.title, 
                                                image_url: crawlerData.image_url,
                                                job_id: data.id})
        customRequest(updateCrawlerPath, {job_id: data.id, status: JobStatus.completed})
    }
  
    await db_client.query("COMMIT");
    await new Promise(f => setTimeout(f, 100));
    db_client.release()
    return 0
}

