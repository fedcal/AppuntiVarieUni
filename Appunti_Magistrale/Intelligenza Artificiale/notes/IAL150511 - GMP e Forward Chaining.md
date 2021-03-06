#Lezione 15 - GMP e Forward Chaining

##Modus Ponens Generalizzato

![](./immagini/l15-gmp.png)

Se i vari *p'<sub>i</sub>π* sono uguali ai *p<sub>i</sub>π* per una determinata sostituzione π allora si possono ridurre ad un unico *qπ*, in modo simile a come avviene nella logica proposizionale, utilizzando una base di conoscenza in clausole definite.

Le **clausole definite** del primo ordine sono le clausole di Horn riportate nella logica proposizionale, con la differenza che possono includere delle variabili, le quali vengono considerate quantificate universalmente, dal momento che quelle quantificate esistenzialmente vengono sostituite con una costante di Skolem.

Come sostituzione conviene utilizzare quella piΓΉ generale possibile in modo da trovare il maggior numero possibile di soluzioni ground.

###Correttezza di GMP

Bisogna dimostrare che se *p'<sub>1</sub>...p'<sub>n</sub>* e *p<sub>1</sub> β ... β p<sub>n</sub> => q* allora si puΓ² inferire *qπ*, dato che *p'<sub>i</sub>π = p<sub>i</sub>π* per ogni *i*.

Lemma: per ogni clausola definita *p* abbiamo *p |= pπ* per mezzo di UI:

1. *p<sub>1</sub> β ... β p<sub>n</sub> => q |= (p<sub>1</sub> β ... β p<sub>n</sub> => q)π **=** p<sub>1</sub>π β ... β p<sub>n</sub>π => qπ*
2. *p'<sub>1</sub> ... p'<sub>n</sub> |= p'<sub>1</sub> β ... β p'<sub>n</sub> |= p'<sub>1</sub>π β ... β p'<sub>n</sub>π*

Dal momento che per ipotesi *p'<sub>i</sub>π = p<sub>i</sub>π*, sfruttando i risultati dei punti 1 e 2 si riesce a ricarvare *qπ* usando il Modus Ponens ordinario.

###Esempio di base di conoscenza

![](./immagini/l15-esempio-1.png)

![](./immagini/l15-esempio-2.png)

##Forward Chaining in FOL

L'algoritmo Γ¨ analogo a quello utilizzato nella logica proposizionale con la differenza che c'Γ¨ da tener conto della presenza delle variabili e che queste vengono istanziate il piΓΉ tardi possibile.

Partendo dai fatti noti si fanno scattare tutte le regole presenti nella KB le cui premesse sono soddisfatte, aggiungendo le varie conclusioni ai fatti noti. Si ripete il processo finchΓ© non si trova una risposta oppure non Γ¨ piΓΉ possibile aggiungere fatti.

La base di conoscenza Γ¨ in forma di Horn, con i quantificatori esistenziali istanziati e i quantificatori universali non ancora istanziati.

![](./immagini/l15-folfc.png)

**Standardizzazione separata**: serve per evitare conflitti con i nomi delle variabili.

###Esempio di applicazione

![](./immagini/l15-folfc-alb.png)

###Considerazioni

L'algoritmo Γ¨ **corretto** e **completo** per le clausole definite di primo ordine, questo perchΓ© essendo clausole definite l'esecuzione dell'algoritmo termina sempre.

La correttezza deriva dal fatto che viene semple applicato il Modus Ponens Generalizzato che Γ¨ corretto.

Se ci sono solo clausole definite del primo ordine e non c'Γ¨ nessuna funzione (**datalog**) allora FC termina in un numero poninomiale di iterazioni: _p\*n<sup>k</sup>_ che coincide con il massimo numero di fatti ground distinti che possono essere presenti nella KB. (*p* predicati *k*-ari e *n* costanti).

In generale l'algoritmo puΓ² non terminare se πΆ non Γ¨ una conseguenza logica e questo Γ¨ inevitabile perchΓ© il problema Γ¨ semi-decidibile.
Inoltre, la presenza di funzioni porta a generare un numero possibilmente infinito di clausole.

Si puΓ² osservare che non c'Γ¨ bisogno di matchare una regola alla iterazione *k* se non Γ¨ stata aggiunta una premessa alla iterazione *k-1*.

Quindi conviene matchare ogni regola le cui premesse contengono un letterale appena aggiunto, questo per ridurre il numero di operazioni di match, dal momento che si tratta di un'operazione costosa.

Per velocizzare il match si puΓ² **indicizzare** la base di conoscenza in modo da permette il recupero di fatti conosciuti in *O(1)*.

Il matching di premesse congiuntive rispetto a fatti conosciuti Γ¨ un problema NP-hard.

Da questo ne segue che FC Γ¨ lagarmente utilizzato in basi di conoscenza deduttive (cioΓ¨ che non hanno funzioni).

