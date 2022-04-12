var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

// set up a mongoose model
var MatematicaSchema = new Schema({
    
    
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
            type:Number,default:1,
            
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
    logica:{
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
            type:Number,default:1,
            
        }
    },
    geometria:{
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
    elettromagnetismo:{
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

});
 
module.exports = mongoose.model('Matematica', MatematicaSchema);

