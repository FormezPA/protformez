package it.formez.scripts;

import java.util.HashMap;
import java.util.Map;

import org.alfresco.web.extensibility.SlingshotEvaluatorUtil;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.extensions.surf.RequestContext;
import org.springframework.extensions.surf.ServletUtil;
import org.springframework.extensions.surf.support.ThreadLocalRequestContext;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.connector.Connector;
import org.springframework.extensions.webscripts.connector.Response;
import org.springframework.extensions.webscripts.processor.BaseProcessorExtension;

public class PermsQuery extends BaseProcessorExtension{
	
	private static Map<String, Map<String, JSONObject>> sites = new HashMap<String, Map<String, JSONObject>>();
	
	public boolean can(String perm){
		RequestContext rc = ThreadLocalRequestContext.getRequestContext();
		String user = rc.getUserId();
		String sitename = new SlingshotEvaluatorUtil().getSite(rc);
		JSONObject permissions = getPerms(user, sitename);
		try {
			return permissions.getBoolean(perm);
		} catch (JSONException e) {
			return false;
		}
	}
	
	public boolean clean(String site){
		try {
			sites.remove(site);
			return true;
		} catch (Exception e) {
			return false;
		}
	}
	
	public JSONObject getPerms(String user, String sitename) {
		try {
			Map<String, JSONObject> site = sites.get(sitename);
			if(site==null){
				site = new HashMap<String, JSONObject>();
				sites.put(sitename, site);
			}
			JSONObject permissions = site.get(user);
			if(permissions==null){
				RequestContext rc = ThreadLocalRequestContext.getRequestContext();
		        Connector conn = rc.getServiceRegistry().getConnectorService().getConnector("alfresco", user, ServletUtil.getSession());
		        Response response = conn.call("/formez/org/users/permissions?site="+sitename);
		        if (response.getStatus().getCode() == Status.STATUS_OK){
		        	permissions = new JSONObject(response.getResponse());
		        	sites.get(sitename).put(user, permissions);
		        	return permissions;
		        } else {
		        	return null;
		        }
			} else {
				return permissions;
			}
		} catch (Exception e) {
			return null;
		}
	}
}
