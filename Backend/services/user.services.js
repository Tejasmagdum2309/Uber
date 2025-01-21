import User from "../models/user.model.js";

const createUser = async ({firstName , lastName , email , password}) => {
    try {
        const user = await User.create({
            firstName,
            email,
            password
        });
        return user;
    } catch (error) {
        console.log("error in createUser - " , error);
        throw error;
    }        

}


export {createUser};