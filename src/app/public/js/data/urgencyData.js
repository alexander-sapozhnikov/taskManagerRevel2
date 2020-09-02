const URL = "/urgency/"

class UrgencyData{
    getAll(){
        return fetch(URL)
    }
}

let urgencyData = new UrgencyData()
export {urgencyData}