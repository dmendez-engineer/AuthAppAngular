const mongoose = require("mongoose");


mongoose.set('strictQuery',true);
const dbConnection=async ()=>{
    try{    
        await mongoose.connect(process.env.BD_CNN,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            autoIndex:true
            
            //useCreateIndex:true
        });

        console.log("DB Online");

    }catch(err){
        console.log(err);
        throw new Error("Error a la hora de inicializar");
    }
}

module.exports=dbConnection;