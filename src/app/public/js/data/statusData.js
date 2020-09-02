const URL = "/status/"

class StatusData{
    getAll(){
        return fetch(URL)
    }
}

let statusData = new StatusData()

export {statusData}