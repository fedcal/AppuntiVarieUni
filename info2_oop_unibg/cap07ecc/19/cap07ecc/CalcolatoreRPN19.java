package cap07ecc;

import java.util.EmptyStackException;
import java.util.Stack;

public class CalcolatoreRPN19 {
	
	public static void main(String[] args) {
		System.out.println(valuta("3 4 +"));
		System.out.println(valuta("3 0 /"));
		System.out.println(valuta("a b *"));
		System.out.println(valuta("10 9 + *"));
	}

	/**
	 * 
	 * @param expr expression in notazione postfissa
	 * se non ?p valida stampa errore e restituisce -1
	 * @return il valore
	 */
	public static double valuta(String expr) {
		String[] tokens = expr.split(" ");
		Stack<Integer> pila = new Stack<>();
		//
		for(String t: tokens) {
			// ? una operazione???
			if (t.equals("*") ||t.equals("+")|| t.equals("-")
					|| t.equals("/")) {
				System.out.print(" op " + t);
				// prendo gli ultimi due elementi
				try{
					int e2 = pila.pop();
				int e1 = pila.pop();
				// faccio l'operazione
				switch (t) {
				case "*": pila.push(e1*e2); break;
				case "+": pila.push(e1+e2); break;
				case "-": pila.push(e1-e2); break;
				case "/": 
					try{
						pila.push(e1/e2); 
						break;
					} catch (ArithmeticException e) {
						System.err.println(" divisione per 0");
						return -1;
					}
				}
				} catch(EmptyStackException e) {
					System.err.println("troppi operatori");
					return -1;
				}
			} else {
				// ? un numero
				try{
					pila.push(Integer.parseInt(t));
				} catch(NumberFormatException e) {
					System.err.println("contiene un non numero");
					return -1;
				}
			}
			System.out.println("pila: " + pila);
		}
		return pila.pop();
	}
	
	
}
