const crawlerAppHost = "http://localhost:4000"

export const getEnqueuedCrawlerPath = crawlerAppHost + "/get/job"

export const updateCrawlerPath = crawlerAppHost + "/update/crawling"

export const getJobsByStatusPath = crawlerAppHost + "/get/jobs/%s"

export const insertResultPath = crawlerAppHost + "/add/result"

export const addCrawlerPath = crawlerAppHost + "/add/crawling"
