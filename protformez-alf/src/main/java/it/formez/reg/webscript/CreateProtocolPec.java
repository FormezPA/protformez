package it.formez.reg.webscript;

import it.formez.model.FormezModel;
import it.formez.reg.model.RegModel;
import it.formez.reg.service.ProtocolService;

import java.util.HashMap;
import java.util.Map;

import org.alfresco.service.cmr.model.FileExistsException;
import org.alfresco.service.cmr.model.FileNotFoundException;
import org.alfresco.service.cmr.repository.NodeRef;
import org.apache.log4j.Logger;
import org.springframework.extensions.webscripts.DeclarativeWebScript;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.WebScriptRequest;


public class CreateProtocolPec extends DeclarativeWebScript {
	
	private static Logger logger = Logger.getLogger(CreateProtocolPec.class);
	
	@Override
	public Map<String, Object> executeImpl(WebScriptRequest req, Status status){
		Map<String, Object> model = new HashMap<String, Object>();
		
		NodeRef nodeRef = new NodeRef(req.getParameter("noderef"));
		if(FormezModel.getServiceRegistry().getNodeService().hasAspect(nodeRef, RegModel.ASPECT_RECORDABLE)){
			model.put("success", false);
			model.put("message", "already");
			return model;
		}
		
		String protocolNumber = null;
		try {
			protocolNumber = ProtocolService.createProtocolFromPec(nodeRef);
		} catch (FileExistsException e) {
			logger.error("Error in protocol creation for node" + nodeRef.toString(),e);
		} catch (FileNotFoundException e) {
			logger.error("Error in protocol creation for node" + nodeRef.toString(),e);
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
