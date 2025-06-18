const ipcRenderer = window.require("electron").ipcRenderer;

export default async function ipcRequestHandler(ipcAddress, successResponse = null, errorResponse = null, params, callback = null, errorCallback = null) {
    try {
        const requestPromise = new Promise((resolve, reject) => {
            const handleSuccess = (_event, response) => {
                ipcRenderer.removeAllListeners(errorResponse);
                console.log(`%c[${new Date().toISOString()}] Response received ${successResponse}:`, "color: orange; font-weight: bold;", response);
                resolve(response);
            };
    
            const handleError = (_event, error) => {
                ipcRenderer.removeAllListeners(successResponse);
                console.error(`%c[${new Date().toISOString()}] Error in ${errorResponse}:`, "color: red; font-weight: bold;", error);
                reject(error);
            };
    
            if(successResponse !== null) {
                ipcRenderer.once(successResponse, handleSuccess);
            }
    
            if(errorResponse !== null){
                ipcRenderer.once(errorResponse, handleError);
            }
    
            console.log(`%c[${new Date().toISOString()}] Sending ${ipcAddress}:`, "color: #7CFC00; font-weight: bold;", params);
            ipcRenderer.send(ipcAddress, params);
        }).then((response) => {
            if(callback !== null){
                callback(response);
            }
            return response;
        }).catch((error) => {
            console.error(`%c[${new Date().toISOString()}] Error in ipcRequestHandler:`, "color: red; font-weight: bold;", error);
            errorCallback(error);
            return error;
        });

        return requestPromise;
    }catch(err){
        console.log(`%c[${new Date().toISOString()}] Error in ipcRequestHandler:`, "color: red; font-weight: bold;", err);
        errorCallback();
    }
} 