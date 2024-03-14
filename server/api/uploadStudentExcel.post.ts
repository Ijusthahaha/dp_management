import {importStudentTable} from "~/utils/fetch";
import {MultiPartData} from "h3";

export default defineEventHandler(async (event) => {
    const token = event.headers.get("token")
    const formData = await readMultipartFormData(event)

    return await importStudentTable(token as string, formData as MultiPartData[]).then(v => {
        return "ok"
    }).catch(e => {
        console.error(e)
    })
})