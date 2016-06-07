package streetapp;

import java.util.logging.Level;
import java.util.logging.Logger;

public class SALog {

	private final Object o;
	private final Logger l;

	public SALog(Object o) {
		this.o = o;
		l = Logger.getLogger("" + o);
	}

	public static SALog getLogger(Object o) {
		return new SALog(o);
	}

	public void info(String string) {
		l.info(getMessage(string));
	}

	private String getMessage(String string) {
		return "" + this.o + " -- " + string;
	}

	public void error(Exception e) {
		l.log(Level.SEVERE, "Exception", e);
	}

}
