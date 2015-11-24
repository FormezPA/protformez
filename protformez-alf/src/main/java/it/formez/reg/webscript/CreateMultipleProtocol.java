package it.formez.reg.webscript;

import it.formez.model.FormezModel;
import it.formez.reg.model.RegModel;
import it.formez.reg.service.ProtocolService;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.alfresco.service.cmr.repository.NodeRef;
import org.apache.log4j.Logger;
import org.springframework.extensions.webscripts.DeclarativeWebScript;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.WebScriptRequest;


public class CreateMultipleProtocol extends DeclarativeWebScript {
	
	@SuppressWarnings("unused")
	private static Logger logger = Logger.getLogger(CreateMultipleProtocol.class);
	
	@Override
	public Map<String, Object> executeImpl(WebScriptRequest req, Status status){
		Date now = new Date();
		Map<String, Object> model = new HashMap<String, Object>();
		Map<String,String> items = new HashMap<String,String>();
		SimpleDateFormat df = new SimpleDateFormat("dd.MM.yyyy HH:mm:ss");
		String siteName = req.getParameter("site");
		Integer number = Integer.valueOf(req.getParameter("number"));
		String dir = req.getParameter("dir");
		if (number > 0){

			for (int i = 0; i < number; i++) {
				NodeRef nodeRef = ProtocolService.createEmptyProtocol(siteName, dir, now);

				String protocolNum = FormezModel.getServiceRegistry().getNodeService().getProperty(nodeRef, RegModel.PROP_PROTOCOL_NUMBER).toString();
						
				items.put(nodeRef.toString(), protocolNum);
				
			}
			model.put("items", items);
			model.put("date", df.format(now));
			model.put("success", "true");
		}
		else {
			model.put("items", items);
			model.put("date", df.format(now));
			model.put("success", "false");
		}
				
		return model;
	
	}
	
}
