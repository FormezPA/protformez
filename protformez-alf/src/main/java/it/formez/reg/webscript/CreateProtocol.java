package it.formez.reg.webscript;

import it.formez.model.FormezModel;
import it.formez.reg.model.RegModel;
import it.formez.reg.service.ProtocolService;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.alfresco.error.AlfrescoRuntimeException;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.extensions.webscripts.DeclarativeWebScript;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.WebScriptRequest;


public class CreateProtocol extends DeclarativeWebScript {
	
	private static Logger logger = Logger.getLogger(CreateProtocol.class);
	
	@Override
	public Map<String, Object> executeImpl(WebScriptRequest req, Status status){
		NodeService nodeService = FormezModel.getServiceRegistry().getNodeService();
		Map<String, Object> model = new HashMap<String, Object>();
		
		JSONObject params = null;
		try {
			params = new JSONObject(req.getContent().getContent());
		} catch (JSONException | IOException e) {
			e.printStackTrace();
		}
		
		if(params==null){
			throw new AlfrescoRuntimeException("params is malformed");
		}
		
		String ref = null;
		try {
			ref =  params.getString("doc");
		} catch (JSONException e1) {
			e1.printStackTrace();
		}
		
		if(ref.trim().length()>1){
			NodeRef nodeRef = new NodeRef(ref);
			if(nodeService.hasAspect(nodeRef, RegModel.ASPECT_RECORDABLE)){
				NodeRef protNode = nodeService.getTargetAssocs(nodeRef, RegModel.ASSOC_RECORDABLE_ITEM).get(0).getTargetRef();
				if(!nodeService.getProperty(protNode, RegModel.PROP_PROTOCOL_STATUS).equals(RegModel.REG_STATUS_PRENOTATO)){
					model.put("success", false);
					model.put("message", "already");
					return model;
				}				
			}
		}
		
		String protocolNumber = null;
		try {
			protocolNumber = ProtocolService.createProtocol(params);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		if (protocolNumber==null){
			model.put("success", false);
			model.put("message", "error");
		}
		else{
			model.put("protocolNumber", protocolNumber);
			model.put("success", true);
		}
		
		return model;
	
	}
	
}
