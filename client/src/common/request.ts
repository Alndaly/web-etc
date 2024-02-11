export const request = (url: string, method: "POST" | "GET", body: any) => {
    const options: RequestInit = {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        body: body,
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    }
    return new Promise((resolve, reject) => {
        fetch(url, options)
            .then((response) => {
                if (response.headers.get('Content-Type')?.includes('application/json')) {
                    response.json()
                        .then(value => {
                            if (value.statusCode >= 200 && value.statusCode < 300) {
                                resolve(value)
                            }
                            reject(value)
                        }
                        )
                        .catch(error => reject(error))
                }
            })
            .catch((error) => reject(error))
    })
}