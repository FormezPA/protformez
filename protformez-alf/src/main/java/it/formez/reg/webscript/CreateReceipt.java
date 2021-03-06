package it.formez.reg.webscript;

import it.formez.model.FormezModel;
import it.formez.reg.model.RegModel;
import it.formez.reg.service.DocumentService;

import java.io.IOException;

import org.alfresco.repo.content.MimetypeMap;
import org.alfresco.repo.web.scripts.content.StreamContent;
import org.alfresco.service.cmr.repository.NodeRef;
import org.apache.log4j.Logger;
import org.springframework.extensions.webscripts.WebScriptRequest;
import org.springframework.extensions.webscripts.WebScriptResponse;


public class CreateReceipt extends StreamContent {
	
	private static Logger logger = Logger.getLogger(CreateReceipt.class);
	
	@Override
	public void execute(WebScriptRequest req, WebScriptResponse res) throws IOException {
		
		NodeRef nodeRef = new NodeRef(req.getParameter("noderef"));
		
		String protocolNum = FormezModel.getServiceRegistry().getNodeService().getProperty(nodeRef, RegModel.PROP_PROTOCOL_NUMBER).toString();
		logger.debug("Genarated protocol receipt for protocol: " + protocolNum );
		
		res.setContentType(MimetypeMap.MIMETYPE_PDF);
		res.setHeader("Content-Disposition", "attachment; filename=\"Ricevuta-" + protocolNum + ".pdf\"");
		DocumentService.receipt(nodeRef, res.getOutputStream());
	}
	
}
