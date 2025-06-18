import { exec } from "child_process";


function killApiProcesses(exeFile) {
    exec(`taskkill /F /IM ${exeFile}`);
}


export default killApiProcesses;