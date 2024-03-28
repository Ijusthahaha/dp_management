import {importTeacherTable} from "~/utils/fetch";
import {type MultiPartData} from "h3";

export default defineEventHandler(async (event) => {
    const token = event.headers.get("token")
    const formData = await readMultipartFormData(event)

    return await importTeacherTable(token as string, formData as MultiPartData[]).then(v => {
        return "ok"
    }).catch(e => {
        console.error(e)
    })
})