package streetapp.web.settings;

import java.util.HashMap;
import java.util.Map;

import streetapp.SALog;

public class Settings {
	private static final String REPLACE_ORG_INDEX_HTML = "replace_org_index.html";
	private static final String ISDEVSERVER = "isdevserver";

	private Map<String, String> p = new HashMap<>();
	private SALog log = SALog.getLogger(this);

	public Settings() {
		// getParameter("start");
		p.put(ISDEVSERVER, "false");
		p.put(REPLACE_ORG_INDEX_HTML, "");
	}

	public String getParameter(String name) {
		name = name.replace("/", "_");
		String value = System.getenv("streetapp.web." + name);
		if (value == null) {
			value = p.get(name);
		}

		if (value == null) {
			throw new RuntimeException("requesting unknown parameter " + name);
		}

		return value;
	}

	public boolean isDevServer() {
		return getParameter(ISDEVSERVER).equals("true");
	}

}
