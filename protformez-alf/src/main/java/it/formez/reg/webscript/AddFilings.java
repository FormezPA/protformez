package it.formez.reg.webscript;

import it.formez.model.FormezModel;
import it.formez.reg.model.RegModel;
import it.formez.reg.service.AuditService;
import it.formez.reg.service.DocumentService;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.alfresco.error.AlfrescoRuntimeException;
import org.alfresco.model.ContentModel;
import org.alfresco.repo.web.scripts.content.StreamContent;
import org.alfresco.service.cmr.repository.AssociationRef;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.namespace.QName;
import org.apache.chemistry.opencmis.server.support.query.CmisQlExtParser_CmisBaseGrammar.boolean_factor_return;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.extensions.webscripts.Cache;
import org.springframework.extensions.webscripts.DeclarativeWebScript;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.WebScriptRequest;
import org.springframework.extensions.webscripts.WebScriptResponse;


public class AddFilings extends DeclarativeWebScript {
	
	private static Logger logger = Logger.getLogger(AddFilings.class);
	
	public Map<String, Object> executeImpl(WebScriptRequest req, Status status, Cache cache) {
		NodeService nodeService = FormezModel.getServiceRegistry().getNodeService();
		
		JSONObject params = null;
		try {
			params = new JSONObject(req.getContent().getContent());
		} catch (JSONException | IOException e) {
			e.printStackTrace();
		}
		
		if(params==null){
			throw new AlfrescoRuntimeException("params is malformed");
		}
		
		NodeRef protocol = null;
		JSONArray filings = null;
		try {
			protocol = new NodeRef(params.getString("protocol"));
			filings = params.getJSONArray("filings");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		// controllo se il protocollo ha un documento associato
		boolean withDoc = false;
		NodeRef document = null;
		String docName = "";
		List<AssociationRef> documents = nodeService.getTargetAssocs(protocol, RegModel.ASSOC_PROTOCOL_DOCUMENT);
		if(!documents.isEmpty()){
			withDoc = true;
			document = documents.get(0).getTargetRef();
			docName = nodeService.getProperty(document, ContentModel.PROP_NAME).toString();
		}
		
		// rimuovo i vecchi filing
		List<AssociationRef> oldFilings = nodeService.getTargetAssocs(protocol, RegModel.ASSOC_PROTOCOL_FILING);
		for (AssociationRef ref : oldFilings) {
			NodeRef oldFiling = ref.getTargetRef();
			nodeService.removeAssociation(protocol, oldFiling, RegModel.ASSOC_PROTOCOL_FILING);
			if(withDoc){
				nodeService.removeChild(oldFiling, document);
			}
		}
		
		// aggiungo i filing
		for(int i=0;i<filings.length();i++){
			NodeRef filing = null;
			try {
				filing = new NodeRef(filings.get(i).toString());
			} catch (JSONException e) {
				e.printStackTrace();
			}
			nodeService.createAssociation(protocol, filing, RegModel.ASSOC_PROTOCOL_FILING);
			if(withDoc){
				nodeService.addChild(filing, document, ContentModel.ASSOC_CONTAINS, QName.createQName(filing.getId()+" "+docName));
			}
		}
		
		// audit
		AuditService.auditFilings(protocol);
		
		Map<String, Object> model = new HashMap<String, Object>();
    	model.put("success", true);
    	
        return model;
		
	}
	
}
