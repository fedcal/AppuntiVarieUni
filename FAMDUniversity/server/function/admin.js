///########################################################  Funzioni per l'admin
Account=require('../models/account');
Prof=require('../models/prof');
Profile=require('../models/profile');
Student=require('../models/student');
Feedback=require('../models/feedback');

///######################################################## IMPORT PACKAGE NODE
var jwt= require('jwt-simple');
var logger = require("../config/logger");
var moment =require('moment-timezone');

///########################################################  Funzioni per la gestione della registrazione dei dottori
exports.addProf= function(req,res) {
    var token = getToken(req.headers);
      if (token) {
        var decoded = jwt.decode(token, process.env.SECRET);
        Account.findOne({
          _id:decoded._id
        }).exec(function (err, user){
          if (err) {
            return res.json({success: false, msg:'Non autorizzato'});
          }
          if (!user) {
            return res.json({success: false, msg:'Account admin' + decoded.name + 'non trovato.'});
          }else{
            if(user.role=='admin'){
              if (!req.body.password || !req.body.email || !req.body.username) {
                return res.json({success: false, msg: 'Credenziali richieste.'});
              }else{
                if (!req.body.firstname || !req.body.lastname|| !req.body.bod || !req.body.gender || !req.body.insegnamenti || !req.body.cell) 
                      return res.json({success:false,msg:'Dati richiesti'});  
                var timestamp=new Date();
                var date=moment.tz(timestamp,"Europe/Amsterdam");
                var date=date.format().toString()           
                var newAccount= new Account({
                  username: req.body.username, 
                  password: req.body.password,
                  email:req.body.email,
                  role:'prof',
                  register_date:date,
                });
                newAccount.save(function(err,user){
                    if(err){
                        if(err.code==11000){
                          Account.findOne({
                            _id:decoded._id
                          }).exec(function(err,suc){
                            if(err)
                              return res.json({success:false,msg:'Errore nome utente'});
                            if(suc)
                              return res.json({success:false,msg:'Nome utente non disponibile'});
                            if(!suc)
                              return res.json({success:true,msg:'Email gia esistente'});  
                          })
                        }                         
                        else
                            return res.json({success:true,msg:'Errore creazione account'});
                    }if(user){
                      var timestamp=req.body.bod;
                      var date=moment.tz(timestamp,"Europe/Amsterdam");
                      var date=date.format();
                      var x = date.substr(0, 10); 
                      if(req.body.corso=='informatica'){
                        if(req.body.insegnamenti!='programmazione' && req.body.insegnamenti!='analisi' && req.body.insegnamenti!='logica' && req.body.insegnamenti!='algoritmi' && req.body.insegnamenti!='sistemi_operativi'){
                          deleteAccount(user._id);
                          res.json({success:false,msg:'Scegliere tra : programmazione,analisi,logica,algoritmi,sistemi operativi'});
                        }else{
                          var newProf = new Prof({
                            account_id:user._id,
                            firstname:req.body.firstname,
                            lastname:req.body.lastname,
                            bod:x,
                            gender:req.body.gender,
                            corso:req.body.corso,
                            email:user.email,
                            insegnamenti:req.body.insegnamenti,
                            cell:req.body.cell,
                          });
                          if(req.body.gender!=="maschio" && req.body.gender!=="femmina"){
                            deleteAccount(user._id);
                            return res.json({success: false, msg: 'Genere non corretto'});
                          }
                          newProf.save(function(err){
                            if (err){
                              if(err.code==11000){
                                return res.json({success:false,masg:'Profilo gia esistente'});
                              }
                              if(err.errors.bod.path=='bod'){
                                deleteAccount(user._id);
                                return res.json({success:false,msg:'Data di nascita non corretta'});
                              }else{
                                deleteAccount(user._id);
                                return res.json({success:false,msg:'Errore profilo studente'});
                              }
                            }else{
                              return res.json({success:true,msg:'Profilo creato'});      
                            }
                          })
                        }
                      }
                      if(req.body.corso=='fisica'){
                          if(req.body.insegnamenti!='fisica' && req.body.insegnamenti!='analisi' && req.body.insegnamenti!='logica' && req.body.insegnamenti!='geometria' && req.body.insegnamenti!='elettromagnetismo')
                            return res.json({success:false,msg:'Scegliere tra : fisica, analisi, logica, geometria, elettromagnetismo'});
                          else{
                            var newProf = new Prof({
                              account_id:user._id,
                              firstname:req.body.firstname,
                              lastname:req.body.lastname,
                              bod:date,
                              gender:req.body.gender,
                              corso:req.body.corso,
                              email:user.email,
                              insegnamenti:req.body.insegnamenti,
                              cell:req.body.cell,
                            });
                            if(req.body.gender!=="maschio" && req.body.gender!=="femmina"){
                              deleteAccount(user_id);
                              return res.json({success: false, msg: 'Genere non corretto'});
                            }
                            newProf.save(function(err){
                              if (err){
                                if(err.code==11000){
                                  return res.json({success:false,masg:'Profilo gia esistente'});
                                }
                                if(err.errors.bod.path=='bod'){
                                  deleteAccount(user._id);
                                  return res.json({success:false,msg:'Data di nascita non corretta'});
                                }else{
                                  deleteAccount(user._id);
                                  return res.json({success:false,msg:'Errore profilo studente'});
                                }
                              }else{
                                return res.json({success:true,msg:'Profilo creato'});      
                              }
                            })
                          }
                        }
                        if(req.body.corso=='chimica'){
                          if(req.body.insegnamenti!='biochimica' && req.body.insegnamenti!='analisi' && req.body.insegnamenti!='fisica' && req.body.insegnamenti!='inglese' && req.body.insegnamenti!='computer_science')
                              return res.json({success:false,msg:'Scegliere tra : biochimica, analisi, fisica, inglese, computer sience'});
                          else{
                            var newProf = new Prof({
                              account_id:user._id,
                              firstname:req.body.firstname,
                              lastname:req.body.lastname,
                              bod:date,
                              gender:req.body.gender,
                              corso:req.body.corso,
                              email:user.email,
                              insegnamenti:req.body.insegnamenti,
                              cell:req.body.cell,
                            });
                            if(req.body.gender!=="maschio" && req.body.gender!=="femmina"){
                              deleteAccount(user_id);
                              return res.json({success: false, msg: 'Genere non corretto'});
                            }
                            newProf.save(function(err){
                              if (err){
                                if(err.code==11000){
                                  return res.json({success:false,masg:'Profilo gia esistente'});
                                }
                                if(err.errors.bod.path=='bod'){
                                  deleteAccount(user._id);
                                  return res.json({success:false,msg:'Data di nascita non corretta'});
                                }else{
                                  deleteAccount(user._id);
                                  return res.json({success:false,msg:'Errore profilo studente'});
                                }
                              }else
                                return res.json({success:true,msg:'Profilo creato'});        
                            })
                          }
                        }
                      }
                  })
                }
            }else{
              return res.json({success:false,msg:'Dirirtti amministratore necessari'});
            }
          } 
      })
    }      
};                       

exports.verifyFeedback= function(req,res) {
    var token = getToken(req.headers);
      if (token) {
        var decoded = jwt.decode(token, process.env.SECRET);
        Account.findOne({
          _id:decoded._id
        }).exec(function (err, user){
          if (err) {
            return res.status(401).send({success: false, msg:'Non autorizzato'});
          }
          if (!user) {
            return res.status(404).send({success: false, msg:'Account admin' + decoded.name + 'non trovato.'});
          }else{
            if(user.role=='admin'){
              Feedback.find({
                prof_id:req.body.id
              }).exec(function(err,feed){
                if (err)
                  return res.status(400).send({success: false, msg:'Errore ricerca feedback'});
                if (!feed)
                  return res.status(404).send({success: false, msg:'Feedback non trovati'});
                if(feed){
                  return res.status(200).send({success:true,msg:feed});
                }
              })
            }else{
              res.status(400).send({success:false,msg:'Diritti amministratore richiesti'});
            }
          } 
      })
    }      
};                                                  

exports.ShowProf= function(req,res) {
    var token = getToken(req.headers);
      if (token) {
        var decoded = jwt.decode(token, process.env.SECRET);
        Account.findOne({
          _id:decoded._id
        }).exec(function (err, user){
          if (err) {
            return res.status(401).send({success: false, msg:'Non autorizzato'});
          }
          if (!user) {
            return res.status(404).send({success: false, msg:'Account admin' + decoded.name + 'non trovato.'});
          }else{
            if(user.role=='admin'){
              Prof.find().exec(function(err,prof){
                if (err)
                  return res.status(400).send({success: false, msg:'Errore ricerca feedback'});
                if (!prof)
                  return res.status(404).send({success: false, msg:'Feedback non trovati'});
                if(prof){
                  return res.status(200).send({success:true,msg:prof});
                }
              })
            }else{
              res.status(400).send({success:false,msg:'Diritti amministratore richiesti'});
            }
          } 
      })
    }      
};     

///######################################################## ALTRE FUNZIONI UTILIZZATE

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