import prog.io.ConsoleInputManager;
import prog.io.ConsoleOutputManager;

public class Es9C {

		public static void main(String[] args) {
			ConsoleOutputManager out = new ConsoleOutputManager();
			ConsoleInputManager in  = new ConsoleInputManager();
			String s = in.readLine("inserisci la stringa");
			int countVocali = 0;
			//converto tutto in minuscolo cos? controllo solo le vocali minuscole
			s=s.toLowerCase();
			countVocali = contaVocali(s);
			out.println("la parola "+ "\"" + s + "\"" + " ha "+ countVocali + " vocali");

		}

		private static int contaVocali(String s) {
			int countVocali=0;
			for(int i = 0; i <= s.length() -1; i++){
				char c = s.charAt(i);
				if (isVocale(c)){ 
					countVocali ++;
				}
			}
			return countVocali;
		}

		static boolean isVocale(char c) {
			switch (c) {
			case 'a':
			case 'e':
			case 'i':
			case 'o':
			case 'u':
				return true;
			}
			return false;

		}
	}
