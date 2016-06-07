package streetapp.web.settings;

import java.io.FileReader;
import java.io.IOException;
import java.util.Properties;

import streetapp.SALog;

public class Settings {
	private Properties p;
	private SALog log = SALog.getLogger(this);

	public Settings() {
		// getParameter("start");
	}

	public String getParameter(String name) {
		name = name.replace("/", "_");
		return getProperties().getProperty(name);
	}

	private Properties getProperties() {
		if (p == null) {
			p = new Properties();
			try {
				p.load(getClass().getResourceAsStream("dev.ini"));
			} catch (IOException e) {
				log.error(e);
			}
		}
		return p;
	}

	private String getProperty(String name) {
		Properties p = new Properties();
		try {
			p.load(new FileReader("WEB-INF/defaultvalues.ini"));
			return p.getProperty(name);
		} catch (IOException e) {
			SALog.getLogger(this).error(e);
			return null;
		}
	}

	public boolean isDevServer() {
		return getParameter("isdevserver").equals("true");
	}

}
