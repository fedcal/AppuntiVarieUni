package cap11_egi;

class Coppia<G,K>{
	G primo;
	K secondo;
	Coppia(G p, K s){
		primo =p; 
		secondo = s;
	}
}

class MioArray<T>{}

public class UsoGenerics {
	public static void main(String[] args) {
		Coppia<String,Integer> c1; 
		// c1-> primo � una String, c1->secondo � un integer
		c1 = new Coppia<>("analisi II", 27);
		MioArray<String> lo;
		MioArray<Integer> lo2;
	}
	
}
