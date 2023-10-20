import {Status} from "~/types/Status";

export function createStatus(status: number, message: Error | string): Status {
    return {
        status,
        message
    }
}