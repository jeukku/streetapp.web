package streetapp.web;

import java.io.FileNotFoundException;
import java.io.IOException;

import javax.annotation.Resource;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

@Path("/js")
@Resource
public class Js extends PageComponent {
	@GET
	@Produces("application/x-javascript")
	@Path("/{file}")
	public String settingsjs(@PathParam(value = "file") String file) throws FileNotFoundException, IOException {
		return getFile("org/settings.js");
	}

}
