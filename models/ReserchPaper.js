const mongoose = require("mongoose");

const researchSchema = new mongoose.Schema({

      researchName: {
        type: String,
        required: true,
      },
    
      postName: {
        type: String,
        required: true,  
      },
      Item: {
        type: String,
        required: true,
      },
           
      
});

const Research = mongoose.model("Research", researchSchema);

const createResearch  = async(body)=> {
    const newResearch = await Research.create(body);
    return newResearch;
}

const getResearch = async() => {
    const Research = Research.find();
    return Research;
}

module.exports = {
    Research,
    createResearch,
    getResearch,
}


