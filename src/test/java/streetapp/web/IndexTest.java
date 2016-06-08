package streetapp.web;

import java.io.FileNotFoundException;
import java.io.IOException;

import org.junit.Test;

public class IndexTest extends WebTestCase {

	@Test
	public void testIndex() throws FileNotFoundException, IOException {
		assertNotNull(getIndex());
		String i = getIndex().index();
		assertNotNull(i);
	}
}
