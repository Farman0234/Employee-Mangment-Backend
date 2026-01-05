const user = require('../Module/userModule');

const bcrypt = require('bcrypt');

async function userRegister() {
    
    try{
        const existingAdmin = await user.findOne({email:'admin66@gmail.com'})
        if(existingAdmin){
            console.log("adimn account already exits")
            return;
        }
        const hashPassword = await bcrypt.hash('admin@1234',10)
        const admin =  new user({
            name:"Admin",
            email:"admin66@gmail.com",
            password:hashPassword,
            role:'admin'
        })
        const saveAdmin  = await admin.save();
        console.log("Admin account created successfuly",saveAdmin)
    }catch (error){
        console.log(error.message)
    }
}

module.exports = userRegister;