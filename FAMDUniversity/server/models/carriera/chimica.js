var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

var ChimicaSchema = new Schema({
    
   
    account_id:{
        type:String,
        required:true,
        unique:true,
        index:true
    },
    fisica:{
        voto:{
            type:Number,
        },
        data:{
            type:String,
        },
        cfu:{
            type:Number,default:12,
        },
        anno:{
            type:Number,default:2,
            
        }
    },
    analisi:{
        voto:{
            type:Number,
        },
        data:{
            type:String,
        },
        cfu:{
            type:Number,default:12,
        },
        anno:{
            type:Number,default:1,
            
        }
    },
    biochimica:{
        voto:{
            type:Number,
        },
        data:{
            type:String,
        },
        cfu:{
            type:Number,default:6,
        },
        anno:{
            type:Number,default:2,
            
        }
    },
    inglese:{
        voto:{
            type:Number,
        },
        data:{
            type:String,
        },
        cfu:{
            type:Number,default:6,
        },
        anno:{
            type:Number,default:2,
            
        }
    },
    computer_science:{
        voto:{
            type:Number,
        },
        data:{
            type:String,
        },
        cfu:{
            type:Number,default:6,
        },
        anno:{
            type:Number,default:2,
            
        }
    }

});
 
module.exports = mongoose.model('Chimica', ChimicaSchema);