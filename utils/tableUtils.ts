import type {UploadRawFile} from "element-plus";
import type {AxiosResponse} from "axios";

export const createDownloadLink = (res: AxiosResponse<any, any>, fileName: string) => {
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
}

export const beforeUploadTable = (file: UploadRawFile) => {
    if (file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
        file.type !== "application/vnd.ms-excel") {
        ElMessage.error('File type not allowed.')
        return false
    }
    if (file.size / 1024 / 1024 > 1) {
        ElMessage.error('File size too large.')
        return false
    }
    return true
}