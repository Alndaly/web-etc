import { urlPrefix } from "@/config"
import { to } from "@/common/util";
import { request } from "@/common/request";

export const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const [res, err] = await to(request(`${urlPrefix}/file/upload`,
        'POST',
        formData
    ))
    console.log(res, err)

    // .then(response => response.json())
    // .then(data => {
    //     console.log(data)
    // })
    // .catch(error => {
    //     console.error(error)
    // })
}