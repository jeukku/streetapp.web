package streetapp.web;

import java.util.logging.LogManager;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import junit.framework.TestCase;
import streetapp.SALog;

@RunWith(SpringJUnit4ClassRunner.class)
@ComponentScan("streetapp.web")
@ContextConfiguration("ApplicationContext.xml")
public class ServiceTestCase extends TestCase {
	protected SALog log = SALog.getLogger(this);

	@Autowired
	private Index index;

	@Before
	public void init() throws Exception {
		LogManager.getLogManager().readConfiguration();

		log.info("---------- TEST -------------");
	}

	@Test
	public void testOK() {
		assertNotNull(index);
	}

}
