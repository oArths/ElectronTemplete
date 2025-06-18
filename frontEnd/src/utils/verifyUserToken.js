function verifyUserToken(){

    try {
        return 
            global.activeUser 
            && global.activeUser.token 
            && typeof global.activeUser.token === "string" 
            && global.activeUser.token.length > 0;
    }catch (e){
        return false
    }

}

export default verifyUserToken()

