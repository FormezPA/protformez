package it.formez.scripts;

import java.util.HashMap;
import java.util.Map;

import org.alfresco.web.extensibility.SlingshotEvaluatorUtil;
import org.json.JSONObject;
import org.springframework.extensions.surf.RequestContext;
import org.springframework.extensions.surf.ServletUtil;
import org.springframework.extensions.surf.support.ThreadLocalRequestContext;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.connector.Connector;
import org.springframework.extensions.webscripts.connector.Response;
import org.springframework.extensions.webscripts.processor.BaseProcessorExtension;

public class CfgQuery extends BaseProcessorExtension{
	
	private static Map<String, JSONObject> sites = new HashMap<String, JSONObject>();
	
	public JSONObject get(){
		return get(new SlingshotEvaluatorUtil().getSite(ThreadLocalRequestContext.getRequestContext()));
	}
	
	public boolean clean(String site){
		try {
			sites.remove(site);
			return true;
		} catch (Exception e) {
			return false;
		}
	}
	
	public JSONObject get(String sitename) {
		try {
			JSONObject site = sites.get(sitename);
			if(site==null){
				RequestContext rc = ThreadLocalRequestContext.getRequestContext();
				String user = rc.getUserId();
				Connector conn = rc.getServiceRegistry().getConnectorService().getConnector("alfresco", user, ServletUtil.getSession());
		        Response response = conn.call("/formez/org/aoo/config?site="+sitename);
		        if (response.getStatus().getCode() == Status.STATUS_OK){
		        	site = new JSONObject(response.getResponse());
		        	sites.put(sitename, site);
		        	return site;
		        } else {
		        	return null;
		        }
			} else{
				return site;
			}
		} catch (Exception e) {
			return null;
		}
	}
}
