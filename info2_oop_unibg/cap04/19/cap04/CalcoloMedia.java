package cap04;

import prog.io.ConsoleInputManager;

// due esami -> quale � a mia media???
public class CalcoloMedia {

	public static void main(String[] args) {
		ConsoleInputManager in = new ConsoleInputManager();
		int i1 = in.readInt("voto info1?");
		int i2 = in.readInt("voto info2?");
		System.out.println("i tuoi voti sono:" + i1 + "" + i2);
		// 
		float media = (i1 +i2) /2.0f;
		System.out.println("la media � ".concat(String.valueOf(media)));
		// -> concat == +
		System.out.println("la media � " + String.valueOf(media));
		// conversione implicita a stringa
		System.out.println("la media � " + media);
		
		
		
	}
	
	
}
