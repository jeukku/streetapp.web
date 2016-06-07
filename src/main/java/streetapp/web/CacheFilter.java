package streetapp.web;

import java.io.IOException;
import java.lang.reflect.Method;
import java.util.logging.Logger;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.container.ResourceInfo;
import javax.ws.rs.core.Context;
import javax.ws.rs.ext.Provider;

import org.springframework.beans.factory.annotation.Autowired;

import streetapp.web.settings.Settings;

@Provider
public class CacheFilter extends PageComponent implements ContainerResponseFilter {
	private final Logger log = Logger.getLogger("" + this);

	@Context
	private ResourceInfo resourceInfo;

	@Autowired
	private Settings settings;

	@Override
	public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext)
			throws IOException {
		log.fine("filtering " + requestContext);
		String key = "Cache-Control";
		addHeader(responseContext, key);
	}

	private void addHeader(ContainerResponseContext responseContext, String key) {
		Method resourceMethod = resourceInfo.getResourceMethod();
		if (resourceMethod != null) {
			responseContext.getHeaders().add(key, settings.getParameter("" + resourceMethod.getName() + "-" + key));
		}
	}
}
