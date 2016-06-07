package streetapp.web;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.StringTokenizer;

import javax.ws.rs.container.ResourceInfo;
import javax.ws.rs.core.Context;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import streetapp.SALog;
import streetapp.web.settings.Settings;

@Component
public class PageComponent {
	private static final int DEFAULT_MAXAGE = 60 * 60 * 1000;

	private Map<String, CacheFile> files = new HashMap<String, CacheFile>();
	private SALog log = SALog.getLogger(this);

	@Context
	private ResourceInfo resourceInfo;

	@Autowired
	private Settings settings;

	protected String getFile(String filepath) throws IOException {
		log.info("File path " + new File(filepath).getAbsolutePath());
		CacheFile sfile = getCacheFile(filepath);

		if (sfile == null || sfile.isOld()) {
			log.info("creating cachefile " + filepath);
			CacheFile f = newCacheFile(filepath);

			String filecontent = f.getContent();
			filecontent = replaceTags(filepath, filecontent);
			f.setContent(filecontent);
			//
			sfile = f;
		}

		return sfile.getContent();
	}

	private CacheFile getCacheFile(String filepath) {
		return files.get(filepath);
	}

	private CacheFile newCacheFile(String path) {
		CacheFile file = files.get(path);
		if (file == null) {
			file = new CacheFile(path, settings.isDevServer() ? 1000 : DEFAULT_MAXAGE);
			files.put(path, file);
		}
		return file;
	}

	private String replaceTags(String path, String njs) {
		String tags = settings.getParameter("replace_" + path);
		log.info("tags " + tags);

		StringTokenizer st = new StringTokenizer(tags, ",");
		while (st.hasMoreTokens()) {
			String tag = st.nextToken();
			log.info("replacing tag " + tag);

			int i = njs.indexOf(tag);
			String nvalue = settings.getParameter(tag);

			log.info("replacing tag " + tag + " with value " + nvalue);

			njs = njs.replace(tag, "" + nvalue);
		}
		return njs;
	}

}
