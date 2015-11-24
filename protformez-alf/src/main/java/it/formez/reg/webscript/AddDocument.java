package it.formez.reg.webscript;

import it.formez.model.FormezModel;
import it.formez.reg.model.RegModel;
import it.formez.reg.service.DocumentService;

import java.util.HashMap;
import java.util.Map;

import org.alfresco.service.cmr.repository.NodeRef;
import org.apache.log4j.Logger;
import org.springframework.extensions.webscripts.Cache;
import org.springframework.extensions.webscripts.DeclarativeWebScript;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.WebScriptRequest;


public class AddDocument extends DeclarativeWebScript {
	
	private static Logger logger = Logger.getLogger(AddDocument.class);
	
	public Map<String, Object> executeImpl(WebScriptRequest req, Status status, Cache cache) {
		
		NodeRef protocol = new NodeRef(req.getParameter("noderef"));
		NodeRef document = new NodeRef(req.getParameter("doc"));
		
		String protocolNum = FormezModel.getServiceRegistry().getNodeService().getProperty(protocol, RegModel.PROP_PROTOCOL_NUMBER).toString();
				
		logger.debug("Add Document to protocol: " + protocolNum );
	
		DocumentService.addDocument(protocol, document);
		
		Map<String, Object> model = new HashMap<String, Object>();
    	model.put("success", true);
    	
        return model;
		
	}
	
}
