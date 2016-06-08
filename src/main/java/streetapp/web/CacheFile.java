package streetapp.web;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

import streetapp.SALog;

public class CacheFile {

	private final int maxtime;
	private long creationtime = System.currentTimeMillis();
	private String filename;
	//
	private String content;

	public CacheFile(String nfilename, int nmaxtime) {
		this.maxtime = nmaxtime;
		this.filename = nfilename;
	}

	public boolean isOld() {
		return (System.currentTimeMillis() - creationtime) > maxtime;
	}

	public String getContent() throws IOException {
		if (content == null) {
			StringBuilder sb = new StringBuilder();
			appendFile(sb);
			content = sb.toString();
		}
		return content;
	}

	private void appendFile(StringBuilder sb) throws IOException {
		BufferedReader fr = new BufferedReader(new FileReader(findFilePath()));
		while (true) {
			String line = fr.readLine();
			if (line == null) {
				break;
			}
			//
			sb.append(line);
			sb.append("\n");
		}
		fr.close();

	}

	private String findFilePath() {
		File f = new File(filename);
		if (f.exists()) {
			return filename;
		}

		String nf = "app" + File.separator + filename;
		if (new File(nf).exists()) {
			return nf;
		}

		SALog.getLogger(this).info("unknown file " + filename + " " + new File(".").getAbsolutePath());

		return "unknown";
	}

	public void setContent(String ncontent) {
		this.content = ncontent;
	}

}
