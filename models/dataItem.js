import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Item2 = new Schema ({

    tuotto:{
        type: Number,
        required: true      
    },

    kulutus:{
        type: Number,
        required: false
    },

    lampo:{
        type: Number,
        required: true
    },

    hinta:{
        type: Number,
        required: true
    }
  
},
{
    versionKey: false,
    timestamps: true

});

const Item = new mongoose.model('Item', Item2);
//module export Item;
export default Item;