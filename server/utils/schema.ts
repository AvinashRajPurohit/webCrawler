// thrid party imports
import Joi from "joi";

// project module imports
import { JobStatus } from "./enum";

// Schemes for request validations
export const jobQueueScheme = Joi.object(
    {
     job_name: Joi.string().min(3).max(50).required(),
     job_url: Joi.string().uri().required()
    }

)

export const updateQueueStatusScheme = Joi.object(
    {
     job_id: Joi.number().required(),
     status: Joi.string().valid(...Object.values(JobStatus))
    }

)

export const insertResultScheme = Joi.object(
    {
        job_id: Joi.number().required(),
        brand: Joi.string().required(),
        title: Joi.string().required(),
        image_url: Joi.string().uri().required()
    }

)