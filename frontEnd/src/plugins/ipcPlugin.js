import ipcRequestHandler from "@/plugins/utils/ipcRequestHandler";

export default {
    install(app) {
        app.config.globalProperties.$ipcRequest = ipcRequestHandler;
    }
};
