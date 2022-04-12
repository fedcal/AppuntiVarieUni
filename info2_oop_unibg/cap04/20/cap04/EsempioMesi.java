package cap04;

import prog.utili.MeseDellAnno;

// prendiamo il mese corrente (Marzo)
// e stampiano l'ordinal
public class EsempioMesi {
	
	
	public static void main(String[] args) {
		MeseDellAnno meseCorrente = MeseDellAnno.MARZO;
		System.out.println(meseCorrente.ordinal());
		stampaMoodMese(meseCorrente);
	}
	
	// metodo che chiamamo moodMese
	// a seconda del mese, stampa l'umore di quel mese
	
	public static void stampaMoodMese(MeseDellAnno m) {
		switch (m) {
		case GENNAIO: System.out.println("che bello � inverno");break;
		case AGOSTO: System.out.println("che bello � vacanza"); break;
		case MARZO: System.out.println("forza che presto � Pasqua!!!"); break;
		default:
			System.out.println("mese generico - no mood"); break;
		}
	}
	

}
