///########################################################  TUTTE LE FUNZIONI DESTINATE AI DOTTORI
Account=require('../models/account');
Prof=require('../models/prof');
Profile=require('../models/profile');
Student=require('../models/student');
Appello=require('../models/appello');
Elenco=require('../models/elencostudenti');
///######################################################## IMPORT PACKAGE NODE
var jwt= require('jwt-simple');
var moment =require('moment-timezone');

///########################################################  VARIABILI UTILIZZATE NELLE FUNZIONI

///######################################################## Funzione per creare un appello
exports.addAppello = function(req,res) {
    var token = getToken(req.headers);
        if (token) {
            var decoded = jwt.decode(token, process.env.SECRET);
            Account.findOne({
                _id:decoded._id,
            }).exec(function (err,account){
                if (err) 
                    return res.json({success:false,msg:'Token invalido'});
                if(!account)
                    return res.json({succes:false,msg:'Account inesistente'});
                if(account) {
                    if (account.role=='prof'){
                        Prof.findOne({
                            account_id:decoded._id,
                        }).exec(function (err,prof){
                            if(err)
                                return res.json({success:false,msg:'Profilo docente non trovato'});
                            if(prof){
                                var timestamp=req.body.data;
                                var date=moment.tz(timestamp,"Europe/Amsterdam");
                                var date=date.format().toString();
                                var x = date.substr(0, 10);
                                var y = date.substring(11, 16);

                                Appello.findOne({
                                    esame:prof.insegnamenti,
                                    data:x,
                                    ora:y,
                                }).exec(function(err,verify){
                                    if(err) 
                                        return res.json({err});
                                    if(!verify){
                                            var newAppello =new Appello({
                                                prof_id:prof.account_id,
                                                name_prof:prof.firstname +' ' + prof.lastname,
                                                corso:prof.corso, 
                                                esame:prof.insegnamenti,
                                                data:x,
                                                ora:y,
                                            })
                                            newAppello.save(function(err,appello){
                                                if (err)
                                                    return res.json({success:false,msg:'Errore creazione appello'});
                                                if (appello)
                                                   return res.json({succes:true,msg:'Appello creato'});
                                            })    
                                    }if(verify)
                                            return res.json({succes:false,msg:'Appello esistente'});
                                    })
                            }
                        })
                    }else{
                        return res.json({success:false,msg:'Non sei un docente'});
                    }   
            }
        })
    }else{
        return res.json({succes:false,msg:'Token invalido'});
    }
}

exports.deleteAppello = function (req,res){
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, process.env.SECRET);
        Account.findOne({   
                _id:decoded._id,
         }).exec(function (err,account){
            if (err) 
                return res.json({success:false,msg:'Token invalido'});
             else {
                if (account.role=='prof'){
                    Prof.findOne({
                        account_id:decoded._id,
                    }).exec(function (err,prof){
                        if(err)
                            return res.json({success:false,msg:'Profilo docente non trovato'});
                        else{
                            Appello.findOne({
                                _id:req.body.id
                            }).exec(function(err,appello){
                                if(err)
                                    return res.json({success:false,msg:'Errore ricerca appello'});
                                if(!appello)
                                    return res.json({success:false,msg:'Appello inesistente'});
                                if(appello){
                                    deleteAllElenco(appello._id);
                                    deleteAppello(appello._id);
                                    return res.json({success:true,msg:'Appello cancellato'});
                                }    
                            })
                        }
                    }) 
                }else{
                    return res.json({success:false,msg:'Non sei un docente'});
                }
            }                    
        })    
    }        
}

exports.editAppello = function (req,res){
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, process.env.SECRET);
        Account.findOne({   
                _id:decoded._id,
         }).exec(function (err,account){
            if (err) 
                return res.json({success:false,msg:'Token invalido'});
             else {
                if (account.role=='prof'){
                    Prof.findOne({
                        account_id:decoded._id,
                    }).exec(function (err,prof){
                        if(err)
                           return res.json({success:false,msg:'Profilo docente non trovato'});
                        else{
                            var timestamp=req.body.data;
                            var date=moment.tz(timestamp,"Europe/Amsterdam");
                            var date=date.format().toString();
                            var x = date.substr(0, 10);
                            var y = date.substring(11, 16);
                            Appello.findOneAndUpdate({
                                _id:req.body.id,
                            },{
                                $set:{
                                    data:x,
                                    ora:y,
                                }
                            },{new: true},function(err,appello){
                                if(err)
                                    return res.json({success:false,msg:'Errore ricerca appello'});
                                if(!appello)
                                    return res.json({success:false,msg:'Appello inesistente'});
                                if(appello){
                                    return res.json({success:true,msg:'Appello modificato'});
                                }    
                            })
                        }
                    }) 
                }else{
                    return res.json({success:false,msg:'Non sei un docente'});
                }
            }                    
        })    
    }        
}

exports.chiudiAppello = function (req,res){
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, process.env.SECRET);
        Account.findOne({   
                _id:decoded._id,
         }).exec(function (err,account){
            if (err) 
                return res.json({success:false,msg:'Token invalido'});
             else {
                if (account.role=='prof'){
                    Prof.findOne({
                        account_id:decoded._id,
                    }).exec(function (err,prof){
                        if(err)
                            return res.json({success:false,msg:'Profilo docente non trovato'});
                        else{
                            Appello.findOneAndUpdate({
                                _id:req.body.id
                            },{
                                $set:{
                                    aperto:false,
                                }
                            },{new: true},function(err,appello){
                                if(err)
                                    return res.json({success:false,msg:'Errore ricerca appello'});
                                if(!appello)
                                    return res.json({success:false,msg:'Appello inesistente'});
                                if(appello){
                                    return res.json({success:true,msg:'Appello chiuso'});
                                }    
                            })
                        }
                    }) 
                }else{
                    return res.json({success:false,msg:'Non sei un docente'});
                }
            }                    
        })    
    }        
}


exports.iscrittiAppello = function (req,res){
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, process.env.SECRET);
        Account.findOne({   
                _id:decoded._id,
         }).exec(function (err,account){
            if (err) 
                return res.json({success:false,msg:'Token invalido'});
             else {
                if (account.role=='prof'){
                    Prof.findOne({
                        account_id:decoded._id,
                    }).exec(function (err,prof){
                        if(err)
                            return res.json({success:false,msg:'Profilo docente non trovato'});
                        else{
                            Appello.findOne({
                                _id:req.body.id
                            }).exec(function(err,appello){
                                if(err)
                                    return res.json({success:false,msg:'Errore ricerca appello'});
                                if(!appello)
                                    return res.json({success:false,msg:'Appello inesistente'});
                                if(appello){
                                    Elenco.find({
                                        appello_id:appello._id
                                    }).exec(function(err,doc){
                                        if (err)
                                            return res.json({success:true,msg:'Errore durante la ricerca degli iscritti'});
                                        if(!doc)
                                            return res.json({success:true,msg:'Elenco non trovato'});
                                        if(doc)
                                            return res.json({success:true,msg:doc});
                                    })
                                    
                                }    
                            })
                        }
                    }) 
                }else{
                    return res.json({success:false,msg:'Non sei un docente'});
                }
            }                    
        })    
    }        
}

exports.votiprovvisoriAppello = function (req,res){
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, process.env.SECRET);
        Account.findOne({   
                _id:decoded._id,
         }).exec(function (err,account){
            if (err) 
                return res.json({success:false,msg:'Token invalido'});
             else {
                if (account.role=='prof'){
                    Prof.findOne({
                        account_id:decoded._id,
                    }).exec(function (err,prof){
                        if(err)
                            return res.json({success:false,msg:'Profilo docente non trovato'});
                        else{
                            Appello.findOne({
                                _id:req.body.id
                            }).exec(function(err,appello){
                                if(err)
                                    return res.json({success:false,msg:'Errore ricerca appello'});
                                if(!appello)
                                   return res.json({success:false,msg:'Appello inesistente'});
                                if(appello){
                                    if(req.body.provvisorio<18 || req.body.provvisorio>32)
                                        return res.json({succes:false,msg:'Voto non assegnabile'});
                                    Elenco.findOneAndUpdate({
                                        appello_id:req.body.id,
                                        account_id:req.body.account_id,
                                        conferma:true,
                                        accettato:false,
                                    },{
                                        $set:{
                                            voto_provvisorio:req.body.provvisorio,
                                            conferma:false,
                                        }
                                    },{new: true},function(err,doc){
                                        if (err)
                                           return res.json({success:true,msg:'Errore durante la ricerca degli iscritti'});
                                        if(!doc)
                                            return res.json({success:true,msg:'Iscrizione non trovata o voto già inserito'});
                                        
                                        if(doc)
                                            return res.json({success:true,msg:'Voto provvisorio caricato'});
                                    })
                                    
                                }    
                            })
                        }
                    }) 
                }else{
                    return res.json({success:false,msg:'Non sei un docente'});
                }
            }                    
        })    
    }        
}

exports.mostraAppelli = function (req,res){
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, process.env.SECRET);
        Account.findOne({   
                _id:decoded._id,
         }).exec(function (err,account){
            if (err) 
                return res.json({success:false,msg:'Token invalido'});
             else {
                if (account.role=='prof'){
                    Prof.findOne({
                        account_id:decoded._id,
                    }).exec(function (err,prof){
                        if(err)
                           return res.json({success:false,msg:'Profilo docente non trovato'});
                        else{                            
                            Appello.find({
                                esame:prof.insegnamenti,
                                corso:prof.corso,
                                prof_id:prof.account_id,
                            }).exec(function(err,appello){
                                if(err)
                                    return res.json({success:false,msg:'Errore ricerca appello'});
                                if(!appello)
                                    return res.json({success:false,msg:'Appello inesistente'});
                                if(appello){
                                    return res.json({success:true,msg:appello});
                                }    
                            })
                        }
                    })
            }else{
                    return res.json({success:false,msg:'Non sei un docente'});
                }
            }                    
        })    
    }        
}



// ALTRE FUNZIONI UTILIZZATE 

getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
}

deleteElenco = function (user) {
    Elenco.remove({
        _id : user
    }, function(err) {
        if (err)
            res.status(400).send({success:false,msg:'Errore eliminazione elenco'});
	});
}

deleteAppello = function (user) {
    Appello.remove({
        _id : user
    }, function(err) {
        if (err)
            res.status(400).send({success:false,msg:'Errore eliminazione elenco'});
	});
}

deleteAllElenco = function (user) {
    Elenco.remove({
        appello_id : user
    }, function(err) {
        if (err)
            res.status(400).send({success:false,msg:'Errore eliminazione elenco'});
	});
}