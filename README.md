# Web Crawler

```
A Web Crawler App for crawling using node and posgres queue..
```

Built with ❤︎ and :coffee: in three night by  [Deepak Rajpurohit](https://github.com/AvinashRajPurohit)

---


# Features
- #### Apis:
    - Add Crawling Job (```/add/crawling```):
        - handling multiple jobs in postgres queue
        - proccess crawling and update status
        - Only process unprocessed requests
        - return md5 generated job id.

    - Update job status (```/update/crawling```):
        - Used by crawler to update job status

    - Get an enqueued job (```/get/enqueued/job```)

    - Get all jobs by status (```/get/jobs/{status}```):
        - Process only valid status

    - Get an job by id (```/get/job```)

    - Add Job Result (```/add/result```):
        - Add processed job result (crawler can intract with db only through apis)
- #### App:
    - Realtime Chart and Table Visualization
    - Requests Concurrency
    - Micro-Service Arch
    - Dockerization 

## Tech Stack:
    - Node / Express js / Socket.io
    - React / Antv / Socket.io client
    - Docker
    - Docker-compose

# Installation
    - NPM install : https://nodejs.org/dist/v18.12.1/node-v18.12.1.pkg
    - Postgres DB install : https://www.enterprisedb.com/postgresql-tutorial-resources-training?uuid=975d8454-ffd8-4074-a5c6-fb24a060e885&campaignId=7012J000001h3GiQAI
    - Docker install: https://docs.docker.com/engine/install/
    - Docker compose install : https://www.digitalocean.com/community/tutorials/how-to-install-docker-compose-on-ubuntu-18-04

###### After installation run this command for running over docker.

```bash
docker-compose up -d
```
- #### Curl Requests:
    - Add Crawling Job (/add/crawling):
        ```bash
            curl --location --request POST 'http://116.203.117.119:4000/add/crawling' \
                --header 'Content-Type: application/json' \
                --data-raw '{
                    "job_name": "valid url",
                    "job_url": "https://www.flaconi.de/pflege/vichy/normaderm/vichy-normaderm-24h-feuchtigkeit-gesichtscreme.html#sku=80020057-50"
                }'
            ```
    - Update job status (/update/crawling):
        ```bash
            curl --location --request POST 'http://116.203.117.119:4000/update/crawling' \
                --header 'Content-Type: application/json' \
                --data-raw '{
                    "job_id": 1,
                    "status": "Valid Status"
                }'
        ```
    - Get an enqueued job (/get/enqueued/job)
        ```bash 
            curl --location --request POST 'http://116.203.117.119:4000/get/enqueued/job'
        ```
    - Get all jobs by status (/get/jobs/{status}):
        ```bash 
                curl --location --request GET 'http://116.203.117.119:4000/get/jobs/completed' 
        ```

    - Get an job by id (/get/job)
        ```bash 
            curl --location --request POST 'http://116.203.117.119:4000/get/job' \
                --header 'Content-Type: application/json' \
                    --data-raw '{
                        "job_id": 1
                    }'
        ```
    - Add Job Result (/add/result):
        ```bash 
            curl --location --request POST 'http://116.203.117.119:4000/add/result' \
                --header 'Content-Type: application/json' \
                --data-raw '{
                    "job_id": 1,
                    "brand": "brand name",
                    "title": "title name",
                    "image_url": "valid image url"
                }'
        ```

#### Queue Performance:
    - for imporoving queue performance increased connection in postgres pool.

### Deployment:
    - Backend: http://116.203.117.119:4000/
    - Frontend: http://116.203.117.119:3000/

    
### Thank you 