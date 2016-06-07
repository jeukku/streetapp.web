package streetapp.web;

import java.io.FileNotFoundException;
import java.io.IOException;

import javax.annotation.Resource;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

@Path("/")
@Resource
public class Index extends PageComponent {
	@GET
	@Produces("text/html")
	@Path("/index.html")
	public String indexhtml(@PathParam(value = "file") String file) throws FileNotFoundException, IOException {
		return getFile("org/index.html");
	}

	@GET
	@Produces("text/html")
	@Path("/")
	public String index(@PathParam(value = "file") String file) throws FileNotFoundException, IOException {
		return getFile("org/index.html");
	}

}
