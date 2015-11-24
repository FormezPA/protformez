package it.formez.reg.webscript;

import it.formez.model.FormezModel;
import it.formez.reg.model.RegModel;
import it.formez.reg.service.ProtocolService;

import java.io.IOException;

import org.alfresco.repo.web.scripts.content.StreamContent;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
import org.apache.log4j.Logger;
import org.springframework.extensions.webscripts.WebScriptRequest;
import org.springframework.extensions.webscripts.WebScriptResponse;


public class CancelProtocol extends StreamContent {
	
	private static Logger logger = Logger.getLogger(CancelProtocol.class);
	
	private static String STATUS_ANN = "Annullato";
	private static String STATUS_ASS = "Assegnato";
	private static String STATUS_PIC = "Preso in carico";
	
	@Override
	public void execute(WebScriptRequest req, WebScriptResponse res) throws IOException {
		
		NodeRef nodeRef = new NodeRef(req.getParameter("noderef"));
		String notes = req.getParameter("note");
		
		NodeService nodeService = FormezModel.getServiceRegistry().getNodeService();
		String protocolNum = nodeService.getProperty(nodeRef, RegModel.PROP_PROTOCOL_NUMBER).toString();
		String status = nodeService.getProperty(nodeRef, RegModel.PROP_PROTOCOL_STATUS).toString();
		
		if (status.equals(STATUS_ANN) || status.equals(STATUS_ASS) || status.equals(STATUS_PIC)){
			throw new IOException("Impossibile cambiare lo stato");
		} else {
		
			logger.debug("Cancel protocol: " + protocolNum );
	
			ProtocolService.cancelProtocol(nodeRef, notes);
		}
	}
	
}
