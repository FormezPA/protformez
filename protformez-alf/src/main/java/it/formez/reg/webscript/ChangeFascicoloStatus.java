package it.formez.reg.webscript;

import it.formez.model.FormezModel;
import it.formez.reg.model.RegModel;
import it.formez.reg.service.AuditService;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.alfresco.service.ServiceRegistry;
import org.alfresco.service.cmr.repository.NodeRef;
import org.apache.log4j.Logger;
import org.springframework.extensions.webscripts.DeclarativeWebScript;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.WebScriptRequest;


public class ChangeFascicoloStatus extends DeclarativeWebScript {
	
	private static Logger logger = Logger.getLogger(ChangeFascicoloStatus.class);
	
	@Override
	public Map<String, Object> executeImpl(WebScriptRequest req, Status status){
		Map<String, Object> model = new HashMap<String, Object>();
		ServiceRegistry serviceRegistry = FormezModel.getServiceRegistry();
		
		NodeRef noderef = new NodeRef(req.getParameter("noderef"));
		String state = serviceRegistry.getNodeService().getProperty(noderef, RegModel.PROP_FASCICOLO_STATUS).toString();
		if(state.equals(RegModel.STATUS_FASCICOLO_CLOSED)){
			serviceRegistry.getNodeService().setProperty(noderef, RegModel.PROP_FASCICOLO_STATUS, RegModel.STATUS_FASCICOLO_OPEN);
			serviceRegistry.getNodeService().setProperty(noderef, RegModel.PROP_FASCICOLO_CHIUSURA, null);
		} else if(state.equals(RegModel.STATUS_FASCICOLO_OPEN)){
			serviceRegistry.getNodeService().setProperty(noderef, RegModel.PROP_FASCICOLO_STATUS, RegModel.STATUS_FASCICOLO_CLOSED);
			serviceRegistry.getNodeService().setProperty(noderef, RegModel.PROP_FASCICOLO_CHIUSURA, new Date());
		} else {
			model.put("success", false);
			return model;
		}
		
		// audit status change
		AuditService.statoFascicolo(noderef);
		logger.info("Fascicolo status changed success");
		model.put("success", true);
		return model;
	
	}
	
}
