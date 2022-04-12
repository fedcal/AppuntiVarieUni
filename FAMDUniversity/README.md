# FAMDUniversity
Progetto di Programmazione Web - UNICAM (Università degli Studi di Camerino)

Il progetto consiste nella realizzazione di un sito web riguardante il piano di studi di un'Università. All'interno sono presenti tre facoltà: Informatica, Chimica e Fisica.

Nel complesso sono presenti tre attori principali, ciascuno con funzioni differenti:

-studente;

-admin;

-professore.

# Realizzato da
-Cingolani Filippo - filippo.cingolani@studenti.unicam.it

-Nepi Alessandro - alessandro.nepi@studenti.unicam.it

-Pecorari Matteo - matteo.pecorari@studenti.unicam.it

-Verdecchia Davide - davide.verdecchia@studenti.unicam.it

# User story obbligatorie
-Come utente voglio poter accedere ad un’area privata tramite username e password;

-Come admin voglio poter modificare il piano di studio;

-Come studente voglio potermi iscrivere ad un esame;

-Come professore voglio poter caricare ed inviare i risultati degli esami agli studenti;

-Come studente voglio visualizzare la mia carriera universitaria anche con l’ausilio di grafici.

# User story aggiuntive - Studente
-Come studente voglio poter accedere ad un’area privata e successivamente visualizzare/modificare il profilo;

-Come studente voglio poter visualizzare la carriera;

-Come studente voglio potermi iscrivere e cancellare da un appello d’esame;

-Come studente voglio poter inviare un feedback ai professori.

# User story aggiuntive - Admin
-Come admin voglio poter accedere alla mia area privata;

-Come admin voglio poter registrare un professore e visualizzare i relativi feedback.

N.B: Esiste un account admin per creare il profilo professori. I dati d'accesso sono i seguenti:

-username: amministratore

-password: amministratore

# User story aggiuntive - Professore
-Come professore voglio poter accedere alla mia area privata;

-Come professore voglio poter creare/modificare/cancellare/chiudere un appello;

-Come professore voglio poter inserire i voti agli studenti iscritti ad un appello;

-Come professore voglio poter visualizzare gli studenti scritti ad un appello.

# Installazione

# Node.js

Dal sito ufficiale è possibile scaricare l’installer di Node.js per Windows e per Mac e il codice sorgente (https://nodejs.org/it/).

# MongoDB

Per installare MongoDB basta cliccare sul seguente link https://www.mongodb.com/download-center?jmp=nav#atlas.

# Utilizzo

# In locale

1. Scaricare e aprire la cartella contenente il progetto

2. Se si vuole utilizzare il proprio database aprire il file .env e sostituire a DB_URI il percorso del proprio server (DB_URI=”mongodb://FAMD:UniCam1996@ds251807.mlab.com:51807/famduniversityPORT=”27017)

3. Aprire il terminale node.js come amministratore e posizionarsi nel percorso della cartella del progetto (cd...)

4. Eseguire il comando “nodemon server.js” per avviare il server

5. Connettersi a http://localhost... per visualizzare il sito 

In caso di problemi

6. Eliminare la cartella “node_modules”

7. Aprire il terminale node.js come amministratore e posizionarsi nel percorso della cartella del progetto (cd...)

8. Eseguire i seguenti comandi in ordine:

   a) npm --add-python-to-path='true' --debug install --global windows-build-tools

   b) npm install node-gyp -g

   c) npm install bcrypt -g

   d) npm install bcrypt -save

   e) npm install

9. Eseguire il comando “nodemon server.js” per avviare il server

10. Connettersi a http://localhost... per visualizzare il sito

# Heroku

-Installare Heroku CLI

$ heroku login

-Clonare il repository

$ heroku git:clone -a famduniversity

$ cd famduniversity

-Deploy

$ git add

$ git commit -am 

$ git push heroku master

# Link

App deployata su Heroku: https://famduniversity.herokuapp.com

Video Youtube: https://youtu.be/Aq7jV5Uz4Hw

Testo progetto/slides: https://drive.google.com/drive/folders/1OjN2A_wrk5R4NlJlYOlp0wktIbgRZ1qk




