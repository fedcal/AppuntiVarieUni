package voli_Es34;

public class ExceedingPassengersCapacityException extends BoardingException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 9169914539512401381L;

	public ExceedingPassengersCapacityException() {
		super("Superata capacit� massima passeggeri");
	}

	public ExceedingPassengersCapacityException(String msg) {
		super(msg);
	}

	public ExceedingPassengersCapacityException(Volo v, char classe) {
		super("Superata capacit� massima passeggeri nella classe "+classe+" per il volo "+v);
	}
}
