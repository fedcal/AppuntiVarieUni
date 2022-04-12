// TUTTE LE FUNZIONI DESTINATE ALLO STUDENTE
    
///########################################################  SCHEMI MONGOOSE
Account=require('../models/account');
Prof=require('../models/prof');
Profile=require('../models/profile');
Student=require('../models/student');
Informatica=require('../models/carriera/informatica');
Chimica=require('../models/carriera/chimica');
Fisica=require('../models/carriera/fisica');
Elenco=require('../models/elencostudenti');
Feedback=require('../models/feedback');

///######################################################## IMPORT PACKAGE NODE
var jwt= require('jwt-simple');
var moment =require('moment-timezone');

///######################################################## FUNZIONI PER LA GESTIONE DEL PROFILO 

///######################################################## Richiedi profilo dell'utente loggato
exports.pullProfileStudent = function(req,res) {
    var token = getToken(req.headers);
        if (token) {
            var decoded = jwt.decode(token, process.env.SECRET);
            Student.findOne({
                account_id:decoded._id
            }).exec(function (err, currentaccount){
                if (err) {
                    return res.json({success:false,msg:'Autorizzazione negata'});
                }
                if (!currentaccount) {
                    return res.json({success:false,msg:'Profilo di ' + decoded.name + 'non trovato.'});
                }
                return res.json(currentaccount);
            });
		}else{
            return res.json({success:false,msg:'Autorizzazione non valida'});
        }
};

///######################################################## Richiedi carriera dell'utente loggato
exports.verifyCarriera = function(req,res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, process.env.SECRET);
            Informatica.findOne({
                account_id:decoded._id
            }).exec(function (err, info){
                if (err) 
                    return res.json({success:false,msg:'Autorizzazione negata'});
                if (info)
                    return res.json({success:true,msg:'informatica'});
                if (!info){ 
                    Fisica.findOne({
                        account_id:decoded._id
                    }).exec(function (err, mate){
                        if (err) 
                            return res.json({success:false,msg:'Autorizzazione negata'});
                        if (mate)
                            return res.json({success:true,msg:'fisica'});
                        if (!mate){
                            Chimica.findOne({
                                account_id:decoded._id
                            }).exec(function (err, bio){
                                if (err) 
                                    return res.json({success:false,msg:'Autorizzazione negata'});
                                if (bio)
                                    return res.json({success:true,msg:'chimica'});
                                if (!bio){
                                    return res.json({success:false,msg:'Carriera non presente'});
                                }                
                            });
                        }
                    })
                }
            })
		}else{
            return res.json({success:false,msg:'Autorizzazione non valida'});        
    }
};

///######################################################## Richiedi carriera dell'utente loggato
exports.pullCarriera = function(req,res) {
    var token = getToken(req.headers);
        if (token) {
            var decoded = jwt.decode(token, process.env.SECRET);
            Fisica.findOne({
                account_id:decoded._id
            }).exec(function (err, mate){
                if (err) 
                   return res.json({success:false,msg:'Autorizzazione negata'});
                if (!mate) {
                    Chimica.findOne({
                        account_id:decoded._id
                    }).exec(function(err,bio){
                        if(err)
                            return res.json({success:false,msg:'Autorizzazione negata'});
                        if(!bio){
                            Informatica.findOne({
                                account_id:decoded._id
                            }).exec(function(err,info){
                                if(err)
                                    return res.json({success:false,msg:'Autorizzazione negata'});
                                if(!info)
                                    return res.json({success:false,msg:'Carriera non presente'});
                                else{
                                    return res.json({success:true,carriera:'Carriera di '+ decoded.username,msg:info});
                                }
                            })
                        }else{
                           return res.json({success:true,carriera:'Carriera di ' + decoded.username,msg:bio});
                        }
                    })
                }else{
                   return res.json({success:true,carriera:'Carriera di ' + decoded.username,mate});
                }
            });
		}else{
            return res.json({success:false,msg:'Autorizzazione non valida'});
        }
};

///######################################################## prende i valori che l'utente vuole inserire ed aggiorna il profilo
exports.pushProfile = function(req,res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, process.env.SECRET);
        Student.findOneAndUpdate({
            account_id:decoded._id
        },
        {
            $set:{
                address:req.body.address,
                cell:req.body.cell,
        }},{new: true},function(err,doc){
            if (err){
                    return res.json({success:false,msg:'Errore aggiornamento profilo'});
                }
            return res.json(doc);
        })
    }
}

exports.iscrizioneAppello = function (req,res){
    var token = getToken(req.headers);
        if (token) {
            var decoded = jwt.decode(token, process.env.SECRET);
            Student.findOne({
                account_id:decoded._id
            }).exec(function (err, currentaccount){
                if (err) {
                    return res.json({success:false,msg:'Autorizzazione negata'});
                }
                if (!currentaccount) {
                    return res.json({success:false,msg:'Profilo di ' + decoded.name + 'non trovato.'});
                }if(currentaccount){
                    Appello.findOne({
                        _id:req.body.id,
                        corso:currentaccount.corso,
                        aperto:true,
                    }).exec(function (err, appello){
                        if(err)
                            return res.json({success:false,msg:'Errore ricerca appello'});
                        if(!appello)
                            return res.json({success:false,msg:'Appello inesistente\chiuso'});
                        if(appello) {
                            Elenco.findOne({
                                appello_id:appello._id,
                                account_id:currentaccount.account_id,
                            }).exec(function (err,elenco){
                                if(err)
                                    return res.json({success:false,msg:'Errore ricerca appello'}); 
                                if(elenco)
                                    return res.json({success:false,msg:'Iscrizione presente'});
                                if(!elenco){  
                                    var NewElenco =new Elenco({
                                        appello_id:appello._id,
                                        account_id:currentaccount.account_id,
                                        nome:currentaccount.firstname,
                                        cognome:currentaccount.lastname,
                                        esame:appello.esame,
                                        data:appello.data,
                                        ora:appello.ora,
                                    })
                                    NewElenco.save(function(err,elenco){
                                        if(err)
                                            return res.json({success:false,msg:'Errore ricerca appello'});
                                        if(elenco){
                                            var n = appello.number_iscritti+1;
                                            Appello.findOneAndUpdate({
                                                corso:currentaccount.corso,
                                                _id:req.body.id
                                            },
                                            {
                                                $set:{
                                                    number_iscritti:n,
                                            }},{new: true},function(err,appello){
                                                if(err){
                                                    deleteElenco(elenco._id)
                                                return res.json({success:false,msg:'Errore iscrizione'});
                                                }
                                                if(!appello)
                                                    return res.json({success:false,msg:'Appello non disponibile'});
                                                if(appello)
                                                    return res.json({success:true,msg:'Iscrizione riuscita'});
                                            })
                                        }    
                                    })
                                }
                            })
                        }
                    })
                }
            })  
                    
        }else{
            return res.json({success:false,msg:'Autorizzazione non valida'});
    }
}

exports.vediAppello = function (req,res){
    var token = getToken(req.headers);
        if (token) {
            var decoded = jwt.decode(token, process.env.SECRET);
            Student.findOne({
                account_id:decoded._id
            }).exec(function (err, currentaccount){
                if (err) {
                    return res.json({success:false,msg:'Autorizzazione negata'});
                }
                if (!currentaccount) {
                    return res.json({success:false,msg:'Profilo di ' + decoded.name + 'non trovato.'});
                }
                Appello.find({
                     corso:currentaccount.corso,
                     aperto:true,
                }).exec(function (err, appello){
                    if(err)
                        return res.json({success:false,msg:'Errore ricerca appello'});
                    if(!appello)
                        return res.json({success:false,msg:'Appelli inesistenti o chiusi'});
                    else {
                        return res.json({success:true,msg:appello})
                    }
                })    
            })                        
        }else{
            return res.json({success:false,msg:'Autorizzazione non valida'});
    }
}

exports.vediIscrizione = function (req,res){
     var token = getToken(req.headers);
        if (token) {
            var decoded = jwt.decode(token, process.env.SECRET);
            Student.findOne({
                account_id:decoded._id
            }).exec(function (err, currentaccount){
                if (err) {
                     return res.json({success:false,msg:'Autorizzazione negata'});
                }
                if (!currentaccount) {
                     return res.json({success:false,msg:'Profilo di ' + decoded.name + 'non trovato.'});
                }else{
                    Elenco.find({
                        account_id:currentaccount.account_id,
                    }).exec(function(err,elenco){
                        if(err)
                             return res.json({success:false,msg:'Errore durante la ricerca del elenco'});
                        if(!elenco)
                             return res.json({success:false,msg:'Non sei iscritto a nessun appello'});
                                if(elenco){
                                     return res.json({success:true,msg:elenco});
                                }
                        })
                }
            })
        }else{
             return res.json({success:false,msg:'Autorizzazione non valida, rifare il login'});
        }
}

exports.deleteIscrizione = function (req,res){
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, process.env.SECRET);
        Student.findOne({
            account_id:decoded._id
        }).exec(function (err, currentaccount){
            if (err) {
                return res.json({success:false,msg:'Autorizzazione negata'});
            }
            if (!currentaccount) {
                return res.json({success:false,msg:'Profilo di ' + decoded.name + 'non trovato.'});
            }else{
                Appello.findOne({
                    _id:req.body.id
                }).exec(function(err,appello){
                    if(err)
                        return res.json({success:false,msg:'Errore ricerca appello'});
                    if(!appello)
                        return res.json({success:false,msg:'Appello non disponibile'}); 
                    if(appello){
                        Elenco.findOne({
                            account_id:currentaccount.account_id,
                            appello_id:appello._id
                        }).exec(function(err,elenco){
                            if(err)
                                return res.json({success:false,msg:'Errore durante la ricerca del elenco'});
                            if(!elenco)
                                return res.json({success:false,msg:'Elenco non trovato'});
                            if (elenco)
                                bool=elenco.voto_provvisorio==null;
                            if(bool==true){
                                var n = appello.number_iscritti-1;
                                Appello.findOneAndUpdate({
                                    _id:req.body.id
                                },{
                                    $set:{
                                        number_iscritti:n,
                                    }
                                },{new: true},function(err,appello){
                                    if(err)
                                        return res.json({success:false,msg:'Errore ricerca appello'}); 
                                    if(appello){
                                        Elenco.findOne({
                                            account_id:currentaccount.account_id,
                                            appello_id:appello._id
                                        }).exec(function(err,elenco){
                                            if(err)
                                                return res.json({success:false,msg:'Errore durante la ricerca del elenco'});
                                            if(!elenco)
                                                return res.json({success:false,msg:'Elenco non trovato'});
                                            if(elenco){
                                                deleteElenco(elenco._id);
                                                return res.json({success:true,msg:'non sei più iscritto'});
                                            }
                                        })
                                    }
                                })
                            }
                            if (bool==false){
                                return res.json({success:true,msg:'Iscrizione non eliminabile'});
                            }
                        })
                    }
                })
            }
        })
    }else{
        return res.json({success:false,msg:'Autorizzazione non valida, rifare il login'});
    }
}   

exports.mostraRisultati =function (req,res){
    var token = getToken(req.headers);
    if (token) {
            var decoded = jwt.decode(token, process.env.SECRET);
            Student.findOne({
                account_id:decoded._id
            }).exec(function (err, currentaccount){
                if (err) {
                    return res.json({success:false,msg:'Autorizzazione negata'});
                }
                if (!currentaccount) {
                     return res.json({success:false,msg:'Profilo di ' + decoded.name + 'non trovato.'});
                }else{
                    Elenco.find({
                        account_id:currentaccount.account_id,
                        conferma:false
                    }).exec(function(err,result){
                        if(err)
                            return res.json({success:false,msg:'Non è stato possibile trovare i tuoi risultati'});
                        if(!result)
                            return res.json({success:false,msg:'Non è stato trovato alcun voto'});
                        if(result)
                            return res.json({success:true,msg:result})
                    })  
                }
            })
    }else{
        return res.json({success:false,msg:'non sei loggato'});
    }
}

 
exports.confermaVoto = function (req,res){
     var token = getToken(req.headers);
        if (token) {
            var decoded = jwt.decode(token, process.env.SECRET);
            Student.findOne({
                account_id:decoded._id
            }).exec(function (err, currentaccount){
                if (err) {
                    return res.json({success:false,msg:'Autorizzazione negata'});
                }
                if (!currentaccount) {
                    return res.json({success:false,msg:'Profilo di ' + decoded.name + 'non trovato.'});
                }else{
                    Appello.findOne({
                       _id:req.body.id,
                    }).exec(function(err,appello){
                        if(err)
                            return res.json({success:false,msg:'Errore ricerca appello'});
                        if(!appello)
                            return res.json({success:false,msg:'Appello non disponibile'});    
                        if(appello)
                            Elenco.findOne({
                                account_id:currentaccount.account_id,
                                appello_id:appello._id
                            }).exec(function(err,elenco){
                                if(err)
                                    return res.json({success:false,msg:'Errore ricerca elenco'});
                                if(!elenco)
                                    return res.json({success:false,msg:'Iscrizione non effettuata'});
                                if(elenco){
                                    var voto=elenco.voto_provvisorio==null
                                    var nulla=!null;
                                    if(voto==true)
                                        return res.json({success:false,msg:'Nessun voto'});
                                    if(voto==false){
                                        Elenco.findOneAndUpdate({
                                            account_id:currentaccount.account_id,
                                            appello_id:appello._id,
                                            conferma:false,
                                            accettato:false,  
                                        },{
                                            $set:{
                                                voto_definitivo:elenco.voto_provvisorio,
                                                conferma:true,
                                                accettato:true,
                                            }
                                        },{new: true},function(err,doc){
                                                if(err)
                                                    return res.json({success:false,msg:'Errore durante la conferma del voto'});
                                                if(doc){
                                                    var materia=appello.esame;
                                                     if(currentaccount.corso='informatica'){
                                                         //######################################################  CASE 1
                                                         if(materia=='analisi'){
                                                                Informatica.findOne({
                                                                    account_id:currentaccount.account_id,
                                                                    'analisi.voto':elenco.voto_provvisorio
                                                                                                                                        
                                                                }).exec(function(err,info){
                                                                    if(err)
                                                                        return res.json({success:false,msg:'Errore verifica voto'});    
                                                                    if(info)
                                                                        return res.json({success:false,msg:'Voto gia salavato'});
                                                                    if(!info){
                                                                        Informatica.findOneAndUpdate({
                                                                            account_id:currentaccount.account_id
                                                                        },{
                                                                            $set:{
                                                                                analisi:{
                                                                                    voto:elenco.voto_provvisorio,
                                                                                    data:appello.data,
                                                                                    cfu:12,
                                                                                    anno:1,
                                                                                },
                                                                            }
                                                                        },{new:true},function(err,doc){
                                                                            if(err)
                                                                                return res.json({success:false,msg:'Errore'})
                                                                            if(doc)
                                                                                return res.json({success:true,msg:'Conferma voto'})
                                                                    })
                                                                }
                                                            })
                                                         }
                                                             //###################################################### CASE 2
                                                            if(materia=='sistemi_operativi'){
                                                                Informatica.findOne({
                                                                    account_id:currentaccount.account_id,
                                                                    'sistemi_operativi.voto':elenco.voto_provvisorio
                                                                                                                                        
                                                                }).exec(function(err,info){
                                                                    if(err)
                                                                        return res.json({success:false,msg:'Errore verifica voto'});    
                                                                    if(info)
                                                                        return res.json({success:false,msg:'Voto gia salavato'});
                                                                    if(!info){
                                                                        Informatica.findOneAndUpdate({
                                                                            account_id:currentaccount.account_id
                                                                        },{
                                                                            $set:{
                                                                                sistemi_operativi:{
                                                                                    voto:elenco.voto_provvisorio,
                                                                                    data:appello.data,
                                                                                    cfu:12,
                                                                                    anno:2,
                                                                                },
                                                                            }
                                                                        },{new:true},function(err,doc){
                                                                            if(err)
                                                                                return res.json({success:false,msg:'Errore'})
                                                                            if(doc)
                                                                                return res.json({success:true,msg:'Conferma voto'})
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                             //###################################################### CASE 3
                                                            if(materia=='algoritmi'){
                                                                Informatica.findOne({
                                                                    account_id:currentaccount.account_id,
                                                                    'algoritmi.voto':elenco.voto_provvisorio
                                                                                                                                        
                                                                }).exec(function(err,info){
                                                                    if(err)
                                                                        return res.json({success:false,msg:'Errore verifica voto'});    
                                                                    if(info)
                                                                        return res.json({success:false,msg:'Voto gia salavato'});
                                                                    if(!info){
                                                                        Informatica.findOneAndUpdate({
                                                                            account_id:currentaccount.account_id
                                                                        },{
                                                                            $set:{
                                                                                algoritmi:{
                                                                                    voto:elenco.voto_provvisorio,
                                                                                    data:appello.data,
                                                                                    cfu:12,
                                                                                    anno:2,
                                                                                },
                                                                            }
                                                                        },{new:true},function(err,doc){
                                                                            if(err)
                                                                                return res.json({success:false,msg:'Errore'})
                                                                            if(doc)
                                                                                return res.json({success:true,msg:'Conferma voto'})
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                             //###################################################### CASE 4
                                                            if(materia=='logica'){
                                                                Informatica.findOne({
                                                                    account_id:currentaccount.account_id,
                                                                    'logica.voto':elenco.voto_provvisorio
                                                                                                                                        
                                                                }).exec(function(err,info){
                                                                    if(err)
                                                                        return res.json({success:false,msg:'Errore verifica voto'});    
                                                                    if(info)
                                                                        return res.json({success:false,msg:'Voto gia salavato'});
                                                                    if(!info){
                                                                        Informatica.findOneAndUpdate({
                                                                            account_id:currentaccount.account_id
                                                                        },{
                                                                            $set:{
                                                                                logica:{
                                                                                    voto:elenco.voto_provvisorio,
                                                                                    data:appello.data,
                                                                                    cfu:6,
                                                                                    anno:1,
                                                                                },
                                                                            }
                                                                        },{new:true},function(err,doc){
                                                                            if(err)
                                                                                return res.json({success:false,msg:'Errore'})
                                                                            if(doc)
                                                                                return res.json({success:true,msg:'Conferma voto'})
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                             //###################################################### CASE 5
                                                            if(materia=='programmazione'){
                                                                Informatica.findOne({
                                                                    account_id:currentaccount.account_id,
                                                                    'programmazione.voto':elenco.voto_provvisorio
                                                                                                                                        
                                                                }).exec(function(err,info){
                                                                    if(err)
                                                                        return res.json({success:false,msg:'Errore verifica voto'});    
                                                                    if(info)
                                                                        return res.json({success:false,msg:'Voto gia salavato'});
                                                                    if(!info){
                                                                        Informatica.findOneAndUpdate({
                                                                            account_id:currentaccount.account_id
                                                                        },{
                                                                            $set:{
                                                                                programmazione:{
                                                                                    voto:elenco.voto_provvisorio,
                                                                                    data:appello.data,
                                                                                    cfu:12,
                                                                                    anno:1,
                                                                                },
                                                                            }
                                                                        },{new:true},function(err,doc){
                                                                            if(err)
                                                                                return res.json({success:false,msg:'Errore'})
                                                                            if(doc)
                                                                                return res.json({success:true,msg:'Conferma voto'})
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                             //######################################################  ALTRI CASE PER LA Carriera di INFORMATICA
                                                        }
                                                     //###################################################### ESAMI CHIMICA
                                                    if(currentaccount.corso='chimica'){
                                                             //###################################################### CASE 1
                                                            if(materia=='analisi'){
                                                                Chimica.findOne({
                                                                    account_id:currentaccount.account_id,
                                                                    'analisi.voto':elenco.voto_provvisorio
                                                                                                                                        
                                                                }).exec(function(err,info){
                                                                    if(err)
                                                                        return res.json({success:false,msg:'Errore verifica voto'});    
                                                                    if(info)
                                                                        return res.json({success:false,msg:'Voto gia salavato'});
                                                                    if(!info){
                                                                        Chimica.update({
                                                                            account_id:currentaccount.account_id
                                                                        },{
                                                                            $set:{
                                                                                analisi:{
                                                                                    voto:elenco.voto_provvisorio,
                                                                                    data:appello.data,
                                                                                    cfu:12,
                                                                                    anno:1,
                                                                                },
                                                                            }
                                                                        },{new:true},function(err,doc){
                                                                            if(err)
                                                                                return res.json({success:false,msg:'Errore'})
                                                                            if(doc)
                                                                                return res.json({success:true,msg:'Conferma voto'})
                                                                        })
                                                                    }   
                                                                })
                                                            }
                                                             //###################################################### CASE 2
                                                            if(materia=='biochimica'){
                                                                Chimica.findOne({
                                                                    account_id:currentaccount.account_id,
                                                                    'biochimica.voto':elenco.voto_provvisorio
                                                                                                                                        
                                                                }).exec(function(err,info){
                                                                    if(err)
                                                                        return res.json({success:false,msg:'Errore verifica voto'});    
                                                                    if(info)
                                                                        return res.json({success:false,msg:'Voto gia salavato'});
                                                                    if(!info){
                                                                        Chimica.update({
                                                                            account_id:currentaccount.account_id
                                                                        },{
                                                                            $set:{
                                                                                biochimica:{
                                                                                    voto:elenco.voto_provvisorio,
                                                                                    data:appello.data,
                                                                                    cfu:12,
                                                                                    anno:2,
                                                                                },
                                                                            }
                                                                        },{new:true},function(err,doc){
                                                                            if(err)
                                                                                return res.json({success:false,msg:'Errore'})
                                                                            if(doc)
                                                                                return res.json({success:true,msg:'Conferma voto'})
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                             //###################################################### CASE 3
                                                            if(materia=='inglese'){
                                                                Chimica.findOne({
                                                                    account_id:currentaccount.account_id,
                                                                    'inglese.voto':elenco.voto_provvisorio
                                                                                                                                        
                                                                }).exec(function(err,info){
                                                                    if(err)
                                                                        return res.json({success:false,msg:'Errore verifica voto'});    
                                                                    if(info)
                                                                        return res.json({success:false,msg:'Voto gia salavato'});
                                                                    if(!info){
                                                                        Chimica.update({
                                                                            account_id:currentaccount.account_id
                                                                        },{
                                                                            $set:{
                                                                                inglese:{
                                                                                    voto:elenco.voto_provvisorio,
                                                                                    data:appello.data,
                                                                                    cfu:12,
                                                                                    anno:2,
                                                                                },
                                                                            }
                                                                        },{new:true},function(err,doc){
                                                                            if(err)
                                                                                return res.json({success:false,msg:'Errore'})
                                                                            if(doc)
                                                                                return res.json({success:true,msg:'Conferma voto'})
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                             //###################################################### CASE 4
                                                            if(materia=='computer_science'){
                                                                Chimica.findOne({
                                                                    account_id:currentaccount.account_id,
                                                                    'computer_science.voto':elenco.voto_provvisorio
                                                                                                                                        
                                                                }).exec(function(err,info){
                                                                    if(err)
                                                                        return res.json({success:false,msg:'Errore verifica voto'});    
                                                                    if(info)
                                                                        return res.json({success:false,msg:'Voto gia salavato'});
                                                                    if(!info){
                                                                        Chimica.update({
                                                                            account_id:currentaccount.account_id
                                                                        },{
                                                                            $set:{
                                                                                computer_science:{
                                                                                    voto:elenco.voto_provvisorio,
                                                                                    data:appello.data,
                                                                                    cfu:6,
                                                                                    anno:1,
                                                                                },
                                                                            }
                                                                        },{new:true},function(err,doc){
                                                                            if(err)
                                                                                return res.json({success:false,msg:'Errore'})
                                                                            if(doc)
                                                                                return res.json({success:true,msg:'Conferma voto'})
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                             //###################################################### CASE 5
                                                            if(materia=='fisica'){
                                                                Chimica.findOne({
                                                                    account_id:currentaccount.account_id,
                                                                    'fisica.voto':elenco.voto_provvisorio
                                                                                                                                        
                                                                }).exec(function(err,info){
                                                                    if(err)
                                                                        return res.json({success:false,msg:'Errore verifica voto'});    
                                                                    if(info)
                                                                        return res.json({success:false,msg:'Voto gia salavato'});
                                                                    if(!info){
                                                                        Chimica.update({
                                                                            account_id:currentaccount.account_id
                                                                        },{
                                                                            $set:{
                                                                                fisica:{
                                                                                    voto:elenco.voto_provvisorio,
                                                                                    data:appello.data,
                                                                                    cfu:12,
                                                                                    anno:1,
                                                                                },
                                                                            }
                                                                        },{new:true},function(err,doc){
                                                                            if(err)
                                                                                return res.json({success:false,msg:'Errore'})
                                                                            if(doc)
                                                                                return res.json({success:true,msg:'Conferma voto'})
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                        }
                                                             //######################################################  ESAMI FISICA
                                                    if(currentaccount.corso='fisica'){
                                                        if(materia=='analisi'){
                                                             //######################################################  CASE1
                                                            Fisica.findOne({
                                                                account_id:currentaccount.account_id,
                                                                'analisi.voto':elenco.voto_provvisorio                                                                       
                                                            }).exec(function(err,info){
                                                                if(err)
                                                                    return res.json({success:false,msg:'Errore verifica voto'});    
                                                                if(info)
                                                                    return res.json({success:false,msg:'Voto gia salavato'});
                                                                if(!info){
                                                                    Fisica.update({
                                                                        account_id:currentaccount.account_id
                                                                    },{
                                                                        $set:{
                                                                            analisi:{
                                                                                voto:elenco.voto_provvisorio,
                                                                                data:appello.data,
                                                                                cfu:12,
                                                                                anno:1,
                                                                            },
                                                                        }
                                                                    },{new:true},function(err,doc){
                                                                        if(err)
                                                                            return res.json({success:false,msg:'Errore'})
                                                                        if(doc)
                                                                            return res.json({success:true,msg:'Conferma voto'})
                                                                    })
                                                                }
                                                            })
                                                        }
                                                             //###################################################### CASE 2
                                                        if(materia=='elettromagnetismo'){
                                                            Fisica.findOne({
                                                                account_id:currentaccount.account_id,
                                                                'elettromagnetismo.voto':elenco.voto_provvisorio                                                                                            
                                                            }).exec(function(err,info){
                                                                if(err)
                                                                    return res.json({success:false,msg:'Errore verifica voto'});    
                                                                if(info)
                                                                    return res.json({success:false,msg:'Voto gia salavato'});
                                                                if(!info){
                                                                    Fisica.update({
                                                                        account_id:currentaccount.account_id
                                                                    },{
                                                                        $set:{
                                                                            elettromagnetismo:{
                                                                                voto:elenco.voto_provvisorio,
                                                                                data:appello.data,
                                                                                cfu:6,
                                                                                anno:2,
                                                                            },
                                                                        }
                                                                    },{new:true},function(err,doc){
                                                                        if(err)
                                                                            return res.json({success:false,msg:'Errore'})
                                                                        if(doc)
                                                                            return res.json({success:true,msg:'Conferma voto'})
                                                                    })
                                                                }
                                                            })
                                                        }
                                                             //###################################################### CASE 3
                                                        if(materia=='geometria'){
                                                            Fisica.findOne({
                                                                account_id:currentaccount.account_id,
                                                                'geometria.voto':elenco.voto_provvisorio                                                                                    
                                                            }).exec(function(err,info){
                                                                if(err)
                                                                    return res.json({success:false,msg:'Errore verifica voto'});    
                                                                if(info)
                                                                    return res.json({success:false,msg:'Voto gia salavato'});
                                                                if(!info){
                                                                    Fisica.update({
                                                                        account_id:currentaccount.account_id
                                                                    },{
                                                                        $set:{
                                                                            geometria:{
                                                                                voto:elenco.voto_provvisorio,
                                                                                data:appello.data,
                                                                                cfu:12,
                                                                                anno:1,
                                                                            },
                                                                        }
                                                                    },{new:true},function(err,doc){
                                                                        if(err)
                                                                            return res.json({success:false,msg:'Errore'})
                                                                        if(doc)
                                                                            return res.json({success:true,msg:'Conferma voto'})
                                                                    })
                                                                }
                                                            })
                                                        }
                                                            //###################################################### CASE 4
                                                        if(materia=='logica'){
                                                            Fisica.findOne({
                                                                account_id:currentaccount.account_id,
                                                                'logica.voto':elenco.voto_provvisorio                                                                                    
                                                            }).exec(function(err,info){
                                                                if(err)
                                                                    return res.json({success:false,msg:'Errore verifica voto'});    
                                                                if(info)
                                                                    return res.json({success:false,msg:'Voto gia salavato'});
                                                                if(!info){
                                                                    Fisica.update({
                                                                        account_id:currentaccount.account_id
                                                                    },{
                                                                        $set:{
                                                                            logica:{
                                                                                voto:elenco.voto_provvisorio,
                                                                                data:appello.data,
                                                                                cfu:6,
                                                                                anno:1,
                                                                            },
                                                                          }
                                                                    },{new:true},function(err,doc){
                                                                        if(err)
                                                                            return res.json({success:false,msg:'Errore'})
                                                                        if(doc)
                                                                            return res.json({success:true,msg:'Conferma voto'})
                                                                    })
                                                                }
                                                            })
                                                        }
                                                            //###################################################### CASE 5
                                                        if(materia=='fisica'){
                                                            Fisica.findOne({
                                                                account_id:currentaccount.account_id,
                                                                'fisica.voto':elenco.voto_provvisorio                                                                           
                                                            }).exec(function(err,info){
                                                                if(err)
                                                                    return res.json({success:false,msg:'Errore verifica voto'});    
                                                                if(info)
                                                                    return res.json({success:false,msg:'Voto gia salavato'});
                                                                if(!info){
                                                                    Fisica.update({
                                                                        account_id:currentaccount.account_id
                                                                    },{
                                                                        $set:{
                                                                            fisica:{
                                                                                voto:elenco.voto_provvisorio,
                                                                                data:appello.data,
                                                                                cfu:12,
                                                                                anno:1,
                                                                            },
                                                                        }
                                                                    },{new:true},function(err,doc){
                                                                        if(err)
                                                                            return res.json({success:false,msg:'Errore'})
                                                                        if(doc)
                                                                            return res.json({success:true,msg:'Conferma voto'})
                                                                    })
                                                                }
                                                            })
                                                        }
                                                    }
                                                }
                                            })           
                                        }
                                    }
                                })
                            }
                        )
                    }
            })
                    
        }else{
            return res.json({success:false,msg:'Autorizzazione non valida, rifare il login'});
        }
}


exports.inserisciFeedback = function (req,res){
    var token = getToken(req.headers);
        if (token) {
            var decoded = jwt.decode(token, process.env.SECRET);
            Student.findOne({
                account_id:decoded._id
            }).exec(function (err, currentaccount){
                if (err) {
                    return res.json({success:false,msg:'Autorizzazione negata'});
                }
                if (!currentaccount) {
                    return res.json({success:false,msg:'Profilo di ' + decoded.name + 'non trovato.'});
                }else{
                    Prof.findOne({
                        _id:req.body.id
                    }).exec(function(err,prof){
                        if (err)
                            return res.json({success:false,msg:'Errore durante la ricerca del professore'});
                        if(!prof)
                            return res.json({success:false,msg:'Docente non torvato'});
                        if(prof){
                            Feedback.findOne({
                                student_id:currentaccount._id,
                                prof_id:prof._id
                            }).exec(function(err,feed){
                                if(err)
                                    return res.json({success:false,msg:'Errore durante la verifica dell\'feedback'});
                                if(feed)
                                    return res.json({success:false,msg:'Feedback già esistente'});
                                if(!feed){
                                    var NewFeedback =new Feedback({
                                        prof_id:prof._id,
                                        student_id:currentaccount._id,
                                        testo:req.body.testo,
                                        firstname:prof.firstname,
                                        lastname:prof.lastname,
                                        corso:prof.corso,
                                    })
                                    NewFeedback.save(function(err,Feedback){
                                    if(err)
                                        return res.json({success:false,msg:'Errore durante il salvataggio dell\'feedback'});
                                    if(Feedback)
                                        return res.json({success:true,msg:'Feedback salvato'});
                                    })
                                }         
                            })
                            
                        }
                    })
                }
            })
        }
}

exports.vediProf = function (req,res){
    var token = getToken(req.headers);
        if (token) {
            var decoded = jwt.decode(token, process.env.SECRET);
            Student.findOne({
                account_id:decoded._id
            }).exec(function (err, currentaccount){
                if (err) {
                    return res.json({success:false,msg:'Autorizzazione negata'});
                }
                if (!currentaccount) {
                    return res.json({success:false,msg:'Profilo di ' + decoded.name + 'non trovato.'});
                }else{
                    Prof.find({
                        corso:currentaccount.corso,
                    }).exec(function(err,prof){
                        if (err)
                            return res.json({success:false,msg:'Errore durante la ricerca del professore'});
                        if(!prof)
                            return res.json({success:false,msg:'Docente non torvato'});
                        if(prof){
                            return res.json({success:false,msg:prof});
                        }
                    })
                }
            })
        }else{
            return res.json({success:false,msg:'Necessario login'});
            
        }
}


///######################################################## ALTRE FUNZIONI UTILIZZATE
getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        }else{
            return null;
        }
    }else{
        return null;
    }
}

deleteElenco = function (user) {
    Elenco.remove({
        _id : user
    }, function(err) {
        if (err)
            return res.json({success:false,msg:'Errore eliminazione elenco'});
	});
}