
package it.formez.reg.service;

import it.formez.model.FormezModel;
import it.formez.reg.model.RegModel;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.alfresco.model.ContentModel;
import org.alfresco.service.cmr.repository.AssociationRef;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.cmr.repository.Path;
import org.alfresco.service.cmr.security.PermissionService;
import org.alfresco.service.namespace.NamespaceService;
import org.alfresco.service.namespace.QName;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

public abstract class AuditService{
	
	public static final Logger logger = Logger.getLogger("AuditLogger");
	
	/**
	 * #####################################
	 *  AUDIT PROTOCOLLO
	 * #####################################
	 */
	
	/**
	 * Audit Create protocol
	 * @param nodeRef
	 */
	public static void auditProtocol(NodeRef nodeRef) {
		String ACTION_NAME = "Nuovo Protocollo";
		NodeService nodeService = FormezModel.getServiceRegistry().getNodeService();
		PermissionService permissionService = FormezModel.getServiceRegistry().getPermissionService();

		String username = FormezModel.getServiceRegistry().getAuthenticationService().getCurrentUserName();
		String siteName = FormezModel.getServiceRegistry().getSiteService().getSite(nodeRef).getShortName();
		
		Map<QName, Serializable> props = new HashMap<QName, Serializable>(nodeService.getProperties(nodeRef));
		String protocolNum = props.get(RegModel.PROP_PROTOCOL_NUMBER).toString();
		Date protocolDate = (Date) props.get(RegModel.PROP_PROTOCOL_DATE);
		String subject = props.get(RegModel.PROP_PROTOCOL_SUBJECT).toString();
		String directionType = props.get(RegModel.PROP_PROTOCOL_DIRECTION_TYPE).toString();
		String status = props.get(RegModel.PROP_PROTOCOL_STATUS).toString();
		String note = props.get(RegModel.PROP_PROTOCOL_NOTES).toString();
		
		// senders
		List<AssociationRef> senders = nodeService.getTargetAssocs(nodeRef, RegModel.ASSOC_PROTOCOL_SENDERS);
		String sendersDescription = "";
		for (AssociationRef associationRef : senders) {
			String name = nodeService.getProperty(associationRef.getTargetRef(), RegModel.PROP_ADDRESS_BOOK_NAME).toString();
			sendersDescription += name + "; ";
		}
		
		// receivers
		List<AssociationRef> receivers = nodeService.getTargetAssocs(nodeRef, RegModel.ASSOC_PROTOCOL_RECEIVERS);
		String receiversDescription = "";
		for (AssociationRef associationRef : receivers) {
			String name = nodeService.getProperty(associationRef.getTargetRef(), RegModel.PROP_ADDRESS_BOOK_NAME).toString();
			receiversDescription += name + "; ";
		}
		
		// classification
		List<AssociationRef> filling = nodeService.getTargetAssocs(nodeRef, RegModel.ASSOC_PROTOCOL_FILING);
		String classification = "";
		for (Iterator<AssociationRef> iterator = filling.iterator(); iterator.hasNext();) {
			AssociationRef associationRef = iterator.next();
			Path path = nodeService.getPath(associationRef.getTargetRef());
			path = path.subPath(5, path.size()-1);
			String displayPath = path.toDisplayPath(nodeService, permissionService);
			displayPath += "/"+nodeService.getProperty(associationRef.getTargetRef(), ContentModel.PROP_NAME).toString();
			classification += displayPath; // Titolo/Classe/Fascicolo
			if(iterator.hasNext()){
				classification += " - "; // Titolo/Classe/Fascicolo
			}
		}
		
		// Document
		List<AssociationRef> doc = nodeService.getTargetAssocs(nodeRef, RegModel.ASSOC_PROTOCOL_DOCUMENT);
		String docName = "";
		if(doc.size()>0){
			docName = nodeService.getProperty(doc.get(0).getTargetRef(), ContentModel.PROP_NAME).toString();
		}
				
		// Attachment
		List<AssociationRef> atts = nodeService.getTargetAssocs(nodeRef, RegModel.ASSOC_PROTOCOL_ATTACHMENTS);
		String attName = "";
		for (Iterator<AssociationRef> iterator = atts.iterator(); iterator.hasNext();) {
			AssociationRef associationRef = iterator.next();
			attName += nodeService.getProperty(associationRef.getTargetRef(), ContentModel.PROP_NAME).toString();
			if (iterator.hasNext()){
				attName += "; ";
			}
			
		}
		
		Date now = new Date();
		
		NodeRef auditContainer = FormezModel.getServiceRegistry().getSiteService().getContainer(siteName, RegModel.CONTAINER_AUDIT);
		
		NodeRef folderContainer = ProtocolService.checkStructureFolder(auditContainer);
		
		if (folderContainer != null){
			//Prepare props for auditEntity
			Map<QName, Serializable> propsAE = new HashMap<QName, Serializable>(9);
			propsAE.put(QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, "name"), String.valueOf(now.getTime()));
			propsAE.put(RegModel.PROPERTY_USER_OWNER, username);
			propsAE.put(RegModel.PROPERTY_SITE, siteName);
			propsAE.put(RegModel.PROPERTY_ACTION, ACTION_NAME);
			propsAE.put(RegModel.PROPERTY_DATE, now);
			propsAE.put(RegModel.PROPERTY_REF_NODE, nodeRef.toString());
			propsAE.put(RegModel.PROPERTY_REF_NAME, nodeService.getProperty(nodeRef, ContentModel.PROP_NAME));
			propsAE.put(RegModel.PROPERTY_REF_TYPE, "PROTOCOLLO");
			
			ArrayList<String> params = new ArrayList<String>();
			params.add("Numero|" + protocolNum);
			params.add("Data|" + FormezModel.dateFormatter.format(protocolDate));
			params.add("Oggetto|" + subject);
			params.add("Stato|" + status);
			params.add("Entrata/Uscita/Interno|" + directionType);
			params.add("Mittenti|" + sendersDescription);
			params.add("Destinatari|" + receiversDescription);
			params.add("Voce di titolario|" + classification);
			params.add("Documento|" + docName);
			params.add("Allegati|" + attName);
			params.add("Note|" + note);
			
			propsAE.put(RegModel.PROPERTY_PARAMS, params);
			
			nodeService.createNode(folderContainer, ContentModel.ASSOC_CONTAINS,
					QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, String.valueOf(now.getTime())), 
					RegModel.TYPE_AUDIT_ENTITY, propsAE);

		}
		else{
			logger.error("Error creating audit entity content!");
		}
	
	}
	
	/**
	 * Audit Cancel Protocol
	 * @param nodeRef
	 * @param notes
	 */
	public static void auditCancelProtocol(NodeRef nodeRef, String notes) {
		String ACTION_NAME = "Annullamento Protocollo";
		NodeService nodeService = FormezModel.getServiceRegistry().getNodeService();

		String username = FormezModel.getServiceRegistry().getAuthenticationService().getCurrentUserName();
		String siteName = FormezModel.getServiceRegistry().getSiteService().getSite(nodeRef).getShortName();
				
		Date now = new Date();
		
		NodeRef auditContainer = FormezModel.getServiceRegistry().getSiteService().getContainer(siteName, RegModel.CONTAINER_AUDIT);
		
		NodeRef folderContainer = ProtocolService.checkStructureFolder(auditContainer);
		
		if (folderContainer != null){
			//Prepare props for auditEntity
			Map<QName, Serializable> propsAE = new HashMap<QName, Serializable>(9);
			propsAE.put(QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, "name"), String.valueOf(now.getTime()));
			propsAE.put(RegModel.PROPERTY_USER_OWNER, username);
			propsAE.put(RegModel.PROPERTY_SITE, siteName);
			propsAE.put(RegModel.PROPERTY_ACTION, ACTION_NAME);
			propsAE.put(RegModel.PROPERTY_DATE, now);
			propsAE.put(RegModel.PROPERTY_REF_NODE, nodeRef.toString());
			propsAE.put(RegModel.PROPERTY_REF_NAME, nodeService.getProperty(nodeRef, ContentModel.PROP_NAME));
			propsAE.put(RegModel.PROPERTY_REF_TYPE, "PROTOCOLLO");
			propsAE.put(RegModel.PROPERTY_PARAMS, "Note|" + notes);
			
			nodeService.createNode(folderContainer, ContentModel.ASSOC_CONTAINS,
					QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, String.valueOf(now.getTime())), 
					RegModel.TYPE_AUDIT_ENTITY, propsAE);
		} else {
			logger.error("Error creating audit entity content!");
		}
		
	}
	
	/**
	 * Audit Print Signature
	 * @param nodeRef
	 */
	public static void auditPrintSignature(NodeRef nodeRef) {
		String ACTION_NAME = "Stampa segnatura";
		NodeService nodeService = FormezModel.getServiceRegistry().getNodeService();

		String username = FormezModel.getServiceRegistry().getAuthenticationService().getCurrentUserName();
		String siteName = FormezModel.getServiceRegistry().getSiteService().getSite(nodeRef).getShortName();
		
		Map<QName, Serializable> props = new HashMap<QName, Serializable>(nodeService.getProperties(nodeRef));
		String protocolNum = props.get(RegModel.PROP_PROTOCOL_NUMBER).toString();
				
		Date now = new Date();
		
		NodeRef auditContainer = FormezModel.getServiceRegistry().getSiteService().getContainer(siteName, RegModel.CONTAINER_AUDIT);
		
		NodeRef folderContainer = ProtocolService.checkStructureFolder(auditContainer);
		
		if (folderContainer != null){
			//Prepare props for auditEntity
			Map<QName, Serializable> propsAE = new HashMap<QName, Serializable>(9);
			propsAE.put(QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, "name"), String.valueOf(now.getTime()));
			propsAE.put(RegModel.PROPERTY_USER_OWNER, username);
			propsAE.put(RegModel.PROPERTY_SITE, siteName);
			propsAE.put(RegModel.PROPERTY_ACTION, ACTION_NAME);
			propsAE.put(RegModel.PROPERTY_DATE, now);
			propsAE.put(RegModel.PROPERTY_REF_NODE, nodeRef.toString());
			propsAE.put(RegModel.PROPERTY_REF_NAME, nodeService.getProperty(nodeRef, ContentModel.PROP_NAME));
			propsAE.put(RegModel.PROPERTY_REF_TYPE, "PROTOCOLLO");
			propsAE.put(RegModel.PROPERTY_PARAMS, "Numero|" + protocolNum);
			
			nodeService.createNode(folderContainer, ContentModel.ASSOC_CONTAINS,
					QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, String.valueOf(now.getTime())), 
					RegModel.TYPE_AUDIT_ENTITY, propsAE);

		}
		else{
			logger.error("Error creating audit entity content!");
		}
		
	}

	/**
	 * Audit Print XML Signature
	 * @param nodeRef
	 */
	public static void auditPrintXmlSignature(NodeRef nodeRef) {
		String ACTION_NAME = "Stampa segnatura xml per interoperabilità";
		NodeService nodeService = FormezModel.getServiceRegistry().getNodeService();

		String username = FormezModel.getServiceRegistry().getAuthenticationService().getCurrentUserName();
		String siteName = FormezModel.getServiceRegistry().getSiteService().getSite(nodeRef).getShortName();
		
		Map<QName, Serializable> props = new HashMap<QName, Serializable>(nodeService.getProperties(nodeRef));
		String protocolNum = props.get(RegModel.PROP_PROTOCOL_NUMBER).toString();
				
		Date now = new Date();
		
		NodeRef auditContainer = FormezModel.getServiceRegistry().getSiteService().getContainer(siteName, RegModel.CONTAINER_AUDIT);
		
		NodeRef folderContainer = ProtocolService.checkStructureFolder(auditContainer);
		
		if (folderContainer != null){
			//Prepare props for auditEntity
			Map<QName, Serializable> propsAE = new HashMap<QName, Serializable>(9);
			propsAE.put(QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, "name"), String.valueOf(now.getTime()));
			propsAE.put(RegModel.PROPERTY_USER_OWNER, username);
			propsAE.put(RegModel.PROPERTY_SITE, siteName);
			propsAE.put(RegModel.PROPERTY_ACTION, ACTION_NAME);
			propsAE.put(RegModel.PROPERTY_DATE, now);
			propsAE.put(RegModel.PROPERTY_REF_NODE, nodeRef.toString());
			propsAE.put(RegModel.PROPERTY_REF_NAME, nodeService.getProperty(nodeRef, ContentModel.PROP_NAME));
			propsAE.put(RegModel.PROPERTY_REF_TYPE, "PROTOCOLLO");
			propsAE.put(RegModel.PROPERTY_PARAMS, "Numero|" + protocolNum);
			
			nodeService.createNode(folderContainer, ContentModel.ASSOC_CONTAINS,
					QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, String.valueOf(now.getTime())), 
					RegModel.TYPE_AUDIT_ENTITY, propsAE);

		} else {
			logger.error("Error creating audit entity content!");
		}
		
	}
	
	/**
	 * Audit Print Receipt
	 * @param nodeRef
	 */
	public static void auditPrintReceipt(NodeRef nodeRef) {
		String ACTION_NAME = "Stampa ricevuta";
		NodeService nodeService = FormezModel.getServiceRegistry().getNodeService();

		String username = FormezModel.getServiceRegistry().getAuthenticationService().getCurrentUserName();
		String siteName = FormezModel.getServiceRegistry().getSiteService().getSite(nodeRef).getShortName();
		
		Map<QName, Serializable> props = new HashMap<QName, Serializable>(nodeService.getProperties(nodeRef));
		String protocolNum = props.get(RegModel.PROP_PROTOCOL_NUMBER).toString();
				
		Date now = new Date();
		
		NodeRef auditContainer = FormezModel.getServiceRegistry().getSiteService().getContainer(siteName, RegModel.CONTAINER_AUDIT);
		
		NodeRef folderContainer = ProtocolService.checkStructureFolder(auditContainer);
		
		if (folderContainer != null){
			//Prepare props for auditEntity
			Map<QName, Serializable> propsAE = new HashMap<QName, Serializable>(9);
			propsAE.put(QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, "name"), String.valueOf(now.getTime()));
			propsAE.put(RegModel.PROPERTY_USER_OWNER, username);
			propsAE.put(RegModel.PROPERTY_SITE, siteName);
			propsAE.put(RegModel.PROPERTY_ACTION, ACTION_NAME);
			propsAE.put(RegModel.PROPERTY_DATE, now);
			propsAE.put(RegModel.PROPERTY_REF_NODE, nodeRef.toString());
			propsAE.put(RegModel.PROPERTY_REF_NAME, nodeService.getProperty(nodeRef, ContentModel.PROP_NAME));
			propsAE.put(RegModel.PROPERTY_REF_TYPE, "PROTOCOLLO");
			propsAE.put(RegModel.PROPERTY_PARAMS, "Numero|" + protocolNum);
			
			nodeService.createNode(folderContainer, ContentModel.ASSOC_CONTAINS,
					QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, String.valueOf(now.getTime())), 
					RegModel.TYPE_AUDIT_ENTITY, propsAE);

		} else {
			logger.error("Error creating audit entity content!");
		}
		
	}
	
	public static void auditAddDocument(NodeRef nodeRef) {
		String ACTION_NAME = "Aggiungi Documento";
		NodeService nodeService = FormezModel.getServiceRegistry().getNodeService();

		String username = FormezModel.getServiceRegistry().getAuthenticationService().getCurrentUserName();
		String siteName = FormezModel.getServiceRegistry().getSiteService().getSite(nodeRef).getShortName();
		
		Map<QName, Serializable> props = new HashMap<QName, Serializable>(nodeService.getProperties(nodeRef));
		String protocolNum = props.get(RegModel.PROP_PROTOCOL_NUMBER).toString();
		
		// Document
		List<AssociationRef> doc = nodeService.getTargetAssocs(nodeRef, RegModel.ASSOC_PROTOCOL_DOCUMENT);
		String docName = "";
		docName += nodeService.getProperty(doc.get(0).getTargetRef(), ContentModel.PROP_NAME);
				
		Date now = new Date();
		
		NodeRef auditContainer = FormezModel.getServiceRegistry().getSiteService().getContainer(siteName, RegModel.CONTAINER_AUDIT);
		
		NodeRef folderContainer = ProtocolService.checkStructureFolder(auditContainer);
		
		if (folderContainer != null){
			//Prepare props for auditEntity
			Map<QName, Serializable> propsAE = new HashMap<QName, Serializable>(9);
			propsAE.put(QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, "name"), String.valueOf(now.getTime()));
			propsAE.put(RegModel.PROPERTY_USER_OWNER, username);
			propsAE.put(RegModel.PROPERTY_SITE, siteName);
			propsAE.put(RegModel.PROPERTY_ACTION, ACTION_NAME);
			propsAE.put(RegModel.PROPERTY_DATE, now);
			propsAE.put(RegModel.PROPERTY_REF_NODE, nodeRef.toString());
			propsAE.put(RegModel.PROPERTY_REF_NAME, nodeService.getProperty(nodeRef, ContentModel.PROP_NAME));
			propsAE.put(RegModel.PROPERTY_REF_TYPE, "PROTOCOLLO");
			
			ArrayList<String> params = new ArrayList<String>();
			params.add("Numero|" + protocolNum);
			params.add("Documento|" + docName);
			
			propsAE.put(RegModel.PROPERTY_PARAMS, params);
			
			nodeService.createNode(folderContainer, ContentModel.ASSOC_CONTAINS,
					QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, String.valueOf(now.getTime())), 
					RegModel.TYPE_AUDIT_ENTITY, propsAE);
		} else {
			logger.error("Error creating audit entity content!");
		}
	
	}
	
	public static void auditFilings(NodeRef nodeRef) {
		String ACTION_NAME = "Riclassificazione";
		NodeService nodeService = FormezModel.getServiceRegistry().getNodeService();
		PermissionService permissionService = FormezModel.getServiceRegistry().getPermissionService();
		List<AssociationRef> filings = nodeService.getTargetAssocs(nodeRef, RegModel.ASSOC_PROTOCOL_FILING);

		String username = FormezModel.getServiceRegistry().getAuthenticationService().getCurrentUserName();
		String siteName = FormezModel.getServiceRegistry().getSiteService().getSite(nodeRef).getShortName();
		
		String protocolNum = nodeService.getProperty(nodeRef, RegModel.PROP_PROTOCOL_NUMBER).toString();
				
		Date now = new Date();
		
		NodeRef auditContainer = FormezModel.getServiceRegistry().getSiteService().getContainer(siteName, RegModel.CONTAINER_AUDIT);
		
		NodeRef folderContainer = ProtocolService.checkStructureFolder(auditContainer);
		
		if (folderContainer != null){
			//Prepare props for auditEntity
			Map<QName, Serializable> propsAE = new HashMap<QName, Serializable>(9);
			propsAE.put(QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, "name"), String.valueOf(now.getTime()));
			propsAE.put(RegModel.PROPERTY_USER_OWNER, username);
			propsAE.put(RegModel.PROPERTY_SITE, siteName);
			propsAE.put(RegModel.PROPERTY_ACTION, ACTION_NAME);
			propsAE.put(RegModel.PROPERTY_DATE, now);
			propsAE.put(RegModel.PROPERTY_REF_NODE, nodeRef.toString());
			propsAE.put(RegModel.PROPERTY_REF_NAME, nodeService.getProperty(nodeRef, ContentModel.PROP_NAME));
			propsAE.put(RegModel.PROPERTY_REF_TYPE, "PROTOCOLLO");
			
			ArrayList<String> params = new ArrayList<String>();
			params.add("Numero|" + protocolNum);
			for (AssociationRef ref : filings) {
				NodeRef filing = ref.getTargetRef();
				Path path = nodeService.getPath(filing);
				path = path.subPath(5, path.size()-1);
				String displayPath = path.toDisplayPath(nodeService, permissionService);
				displayPath += "/"+nodeService.getProperty(filing, ContentModel.PROP_NAME);
				params.add("Classificazione|" + displayPath);
			}
			
			propsAE.put(RegModel.PROPERTY_PARAMS, params);
			
			nodeService.createNode(folderContainer, ContentModel.ASSOC_CONTAINS,
					QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, String.valueOf(now.getTime())), 
					RegModel.TYPE_AUDIT_ENTITY, propsAE);

		}
		else{
			logger.error("Error creating audit entity content!");
		}
		
	}
	
	public static void auditAssign(NodeRef nodeRef) {
		String ACTION_NAME = "Assegnamento";
		NodeService nodeService = FormezModel.getServiceRegistry().getNodeService();

		String username = FormezModel.getServiceRegistry().getAuthenticationService().getCurrentUserName();
		String siteName = FormezModel.getServiceRegistry().getSiteService().getSite(nodeRef).getShortName();
		
		String protocolNum = nodeService.getProperty(nodeRef, RegModel.PROP_PROTOCOL_NUMBER).toString();
				
		Date now = new Date();
		
		NodeRef auditContainer = FormezModel.getServiceRegistry().getSiteService().getContainer(siteName, RegModel.CONTAINER_AUDIT);
		
		NodeRef folderContainer = ProtocolService.checkStructureFolder(auditContainer);
		
		if (folderContainer != null){
			//Prepare props for auditEntity
			Map<QName, Serializable> propsAE = new HashMap<QName, Serializable>(9);
			propsAE.put(QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, "name"), String.valueOf(now.getTime()));
			propsAE.put(RegModel.PROPERTY_USER_OWNER, username);
			propsAE.put(RegModel.PROPERTY_SITE, siteName);
			propsAE.put(RegModel.PROPERTY_ACTION, ACTION_NAME);
			propsAE.put(RegModel.PROPERTY_DATE, now);
			propsAE.put(RegModel.PROPERTY_REF_NODE, nodeRef.toString());
			propsAE.put(RegModel.PROPERTY_REF_NAME, nodeService.getProperty(nodeRef, ContentModel.PROP_NAME));
			propsAE.put(RegModel.PROPERTY_REF_TYPE, "PROTOCOLLO");
			
			ArrayList<String> params = new ArrayList<String>();
			params.add("Numero|" + protocolNum);
			@SuppressWarnings("unchecked")
			ArrayList<String> users = (ArrayList<String>) nodeService.getProperty(nodeRef, RegModel.PROP_PROTOCOL_ASSIGN_USERS);
			params.add("Utenti|" + StringUtils.join(users.toArray(), ", "));
			params.add("Stato|" + nodeService.getProperty(nodeRef, RegModel.PROP_PROTOCOL_ASSIGN_STATE).toString());
			
			propsAE.put(RegModel.PROPERTY_PARAMS, params);
			
			nodeService.createNode(folderContainer, ContentModel.ASSOC_CONTAINS,
					QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, String.valueOf(now.getTime())), 
					RegModel.TYPE_AUDIT_ENTITY, propsAE);

		}
		else{
			logger.error("Error creating audit entity content!");
		}
		
	}
	
	public static void auditStepAssign(NodeRef nodeRef, String step) {
		String ACTION = "";
		if(step.equals("accept")){
			ACTION = "Presa in carico";
		} else if(step.equals("reject")){
			ACTION = "Rifiuto assegnamento";
		} else if(step.equals("complete")){
			ACTION = "Completamento attività di assegnamento";
		}
		NodeService nodeService = FormezModel.getServiceRegistry().getNodeService();

		String username = FormezModel.getServiceRegistry().getAuthenticationService().getCurrentUserName();
		String siteName = FormezModel.getServiceRegistry().getSiteService().getSite(nodeRef).getShortName();
		
		String protocolNum = nodeService.getProperty(nodeRef, RegModel.PROP_PROTOCOL_NUMBER).toString();
				
		Date now = new Date();
		
		NodeRef auditContainer = FormezModel.getServiceRegistry().getSiteService().getContainer(siteName, RegModel.CONTAINER_AUDIT);
		
		NodeRef folderContainer = ProtocolService.checkStructureFolder(auditContainer);
		
		if (folderContainer != null){
			//Prepare props for auditEntity
			Map<QName, Serializable> propsAE = new HashMap<QName, Serializable>(9);
			propsAE.put(QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, "name"), String.valueOf(now.getTime()));
			propsAE.put(RegModel.PROPERTY_USER_OWNER, username);
			propsAE.put(RegModel.PROPERTY_SITE, siteName);
			propsAE.put(RegModel.PROPERTY_ACTION, ACTION);
			propsAE.put(RegModel.PROPERTY_DATE, now);
			propsAE.put(RegModel.PROPERTY_REF_NODE, nodeRef.toString());
			propsAE.put(RegModel.PROPERTY_REF_NAME, nodeService.getProperty(nodeRef, ContentModel.PROP_NAME));
			propsAE.put(RegModel.PROPERTY_REF_TYPE, "PROTOCOLLO");
			
			ArrayList<String> params = new ArrayList<String>();
			params.add("Numero|" + protocolNum);
			params.add("Utente|" + username);
			if(!step.equals("reject")){
				params.add("Stato|" + nodeService.getProperty(nodeRef, RegModel.PROP_PROTOCOL_ASSIGN_STATE).toString());
			}
			
			propsAE.put(RegModel.PROPERTY_PARAMS, params);
			
			nodeService.createNode(folderContainer, ContentModel.ASSOC_CONTAINS,
					QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, String.valueOf(now.getTime())), 
					RegModel.TYPE_AUDIT_ENTITY, propsAE);

		}
		else{
			logger.error("Error creating audit entity content!");
		}
		
	}
	
	/**
	 * #####################################
	 *  AUDIT TITOLARIO
	 * #####################################
	 */
	// audit per la creazione di una voce di titolario
	public static void createTit(NodeRef noderef){
		String ACTION_NAME = "Creazione voce di titolario";
		NodeService nodeService = FormezModel.getServiceRegistry().getNodeService();
		PermissionService permissionService = FormezModel.getServiceRegistry().getPermissionService(); 

		String username = FormezModel.getServiceRegistry().getAuthenticationService().getCurrentUserName();
		String siteName = FormezModel.getServiceRegistry().getSiteService().getSite(noderef).getShortName();
		
		String type = nodeService.getType(noderef).getLocalName();
		String name = nodeService.getProperty(noderef, ContentModel.PROP_NAME).toString();
				
		Date now = new Date();
		
		NodeRef auditContainer = FormezModel.getServiceRegistry().getSiteService().getContainer(siteName, RegModel.CONTAINER_AUDIT);
		
		NodeRef folderContainer = ProtocolService.checkStructureFolder(auditContainer);
		
		if (folderContainer != null){
			//Prepare props for auditEntity
			Map<QName, Serializable> propsAE = new HashMap<QName, Serializable>(9);
			propsAE.put(QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, "name"), String.valueOf(now.getTime()));
			propsAE.put(RegModel.PROPERTY_USER_OWNER, username);
			propsAE.put(RegModel.PROPERTY_SITE, siteName);
			propsAE.put(RegModel.PROPERTY_ACTION, ACTION_NAME);
			propsAE.put(RegModel.PROPERTY_DATE, now);
			propsAE.put(RegModel.PROPERTY_REF_NODE, noderef.toString());
			propsAE.put(RegModel.PROPERTY_REF_NAME, name);
			propsAE.put(RegModel.PROPERTY_REF_TYPE, "TITOLARIO");
			
			ArrayList<String> params = new ArrayList<String>();
			params.add("Tipo voce|" + type);
			params.add("Nome|" + name);
			
			// calcolo path completo voce di titolario
			Path path = nodeService.getPath(noderef);
			path = path.subPath(5, path.size()-1);
			String displayPath = path.toDisplayPath(nodeService, permissionService) + "/" + name;
			params.add("Path|" + displayPath);
			
			propsAE.put(RegModel.PROPERTY_PARAMS, params);
			
			nodeService.createNode(folderContainer, ContentModel.ASSOC_CONTAINS,
					QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, String.valueOf(now.getTime())), 
					RegModel.TYPE_AUDIT_ENTITY, propsAE);

		} else {
			logger.error("Error creating audit entity content!");
		}
	}
	
	// audit per la storicizzazione di una voce di titolario
	public static void historify(NodeRef noderef){
		String ACTION_NAME = "Storicizzazione voce di titolario";
		NodeService nodeService = FormezModel.getServiceRegistry().getNodeService();

		String username = FormezModel.getServiceRegistry().getAuthenticationService().getCurrentUserName();
		String siteName = FormezModel.getServiceRegistry().getSiteService().getSite(noderef).getShortName();
		
		String type = nodeService.getType(noderef).getLocalName();
		String name = nodeService.getProperty(noderef, ContentModel.PROP_NAME).toString();
				
		Date now = new Date();
		
		NodeRef auditContainer = FormezModel.getServiceRegistry().getSiteService().getContainer(siteName, RegModel.CONTAINER_AUDIT);
		
		NodeRef folderContainer = ProtocolService.checkStructureFolder(auditContainer);
		
		if (folderContainer != null){
			//Prepare props for auditEntity
			Map<QName, Serializable> propsAE = new HashMap<QName, Serializable>(9);
			propsAE.put(QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, "name"), String.valueOf(now.getTime()));
			propsAE.put(RegModel.PROPERTY_USER_OWNER, username);
			propsAE.put(RegModel.PROPERTY_SITE, siteName);
			propsAE.put(RegModel.PROPERTY_ACTION, ACTION_NAME);
			propsAE.put(RegModel.PROPERTY_DATE, now);
			propsAE.put(RegModel.PROPERTY_REF_NODE, noderef.toString());
			propsAE.put(RegModel.PROPERTY_REF_NAME, name);
			propsAE.put(RegModel.PROPERTY_REF_TYPE, "TITOLARIO");
			
			ArrayList<String> params = new ArrayList<String>();
			params.add("Tipo voce|" + type);
			params.add("Nome|" + name);
			params.add("Data storicizzazione|" + FormezModel.dateFormatter.format(now));
			
			propsAE.put(RegModel.PROPERTY_PARAMS, params);
			
			nodeService.createNode(folderContainer, ContentModel.ASSOC_CONTAINS,
					QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, String.valueOf(now.getTime())), 
					RegModel.TYPE_AUDIT_ENTITY, propsAE);

		} else {
			logger.error("Error creating audit entity content!");
		}
	}
	
	// audit per il rename della voce di titolario
	public static void rename(NodeRef noderef){
		String ACTION_NAME = "Rinomina voce di titolario";
		NodeService nodeService = FormezModel.getServiceRegistry().getNodeService();

		String username = FormezModel.getServiceRegistry().getAuthenticationService().getCurrentUserName();
		String siteName = FormezModel.getServiceRegistry().getSiteService().getSite(noderef).getShortName();
		
		String type = nodeService.getType(noderef).getLocalName();
		String name = nodeService.getProperty(noderef, ContentModel.PROP_NAME).toString();
				
		Date now = new Date();
		
		NodeRef auditContainer = FormezModel.getServiceRegistry().getSiteService().getContainer(siteName, RegModel.CONTAINER_AUDIT);
		
		NodeRef folderContainer = ProtocolService.checkStructureFolder(auditContainer);
		
		if (folderContainer != null){
			//Prepare props for auditEntity
			Map<QName, Serializable> propsAE = new HashMap<QName, Serializable>(9);
			propsAE.put(QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, "name"), String.valueOf(now.getTime()));
			propsAE.put(RegModel.PROPERTY_USER_OWNER, username);
			propsAE.put(RegModel.PROPERTY_SITE, siteName);
			propsAE.put(RegModel.PROPERTY_ACTION, ACTION_NAME);
			propsAE.put(RegModel.PROPERTY_DATE, now);
			propsAE.put(RegModel.PROPERTY_REF_NODE, noderef.toString());
			propsAE.put(RegModel.PROPERTY_REF_NAME, name);
			propsAE.put(RegModel.PROPERTY_REF_TYPE, "TITOLARIO");
			
			ArrayList<String> params = new ArrayList<String>();
			params.add("Tipo voce|" + type);
			params.add("Nuovo Nome|" + name);
			
			propsAE.put(RegModel.PROPERTY_PARAMS, params);
			
			nodeService.createNode(folderContainer, ContentModel.ASSOC_CONTAINS,
					QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, String.valueOf(now.getTime())), 
					RegModel.TYPE_AUDIT_ENTITY, propsAE);

		} else {
			logger.error("Error creating audit entity content!");
		}
	}
	
	// audit per il rename della voce di titolario
	public static void statoFascicolo(NodeRef noderef){
		NodeService nodeService = FormezModel.getServiceRegistry().getNodeService();

		String username = FormezModel.getServiceRegistry().getAuthenticationService().getCurrentUserName();
		String siteName = FormezModel.getServiceRegistry().getSiteService().getSite(noderef).getShortName();
		
		String stato = nodeService.getProperty(noderef, RegModel.PROP_FASCICOLO_STATUS).toString();
		String name = nodeService.getProperty(noderef, ContentModel.PROP_NAME).toString();
		
		String ACTION_NAME = "";
		String paramName = "";
		Date now = new Date();
		if(stato.equals(RegModel.STATUS_FASCICOLO_OPEN)){
			ACTION_NAME = "Apertura Fascicolo";
			paramName = "Data Apertura";
		} else {
			ACTION_NAME = "Chiusura Fascicolo";
			paramName = "Data Chiusura";
			now = (Date) nodeService.getProperty(noderef, RegModel.PROP_FASCICOLO_CHIUSURA);
		}
		
		NodeRef auditContainer = FormezModel.getServiceRegistry().getSiteService().getContainer(siteName, RegModel.CONTAINER_AUDIT);
		
		NodeRef folderContainer = ProtocolService.checkStructureFolder(auditContainer);
		
		if (folderContainer != null){
			//Prepare props for auditEntity
			Map<QName, Serializable> propsAE = new HashMap<QName, Serializable>(9);
			propsAE.put(QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, "name"), String.valueOf(now.getTime()));
			propsAE.put(RegModel.PROPERTY_USER_OWNER, username);
			propsAE.put(RegModel.PROPERTY_SITE, siteName);
			propsAE.put(RegModel.PROPERTY_ACTION, ACTION_NAME);
			propsAE.put(RegModel.PROPERTY_DATE, now);
			propsAE.put(RegModel.PROPERTY_REF_NODE, noderef.toString());
			propsAE.put(RegModel.PROPERTY_REF_NAME, name);
			propsAE.put(RegModel.PROPERTY_REF_TYPE, "TITOLARIO");
			
			ArrayList<String> params = new ArrayList<String>();
			params.add(paramName + "|" + FormezModel.dateFormatter.format(now));
			
			propsAE.put(RegModel.PROPERTY_PARAMS, params);
			
			nodeService.createNode(folderContainer, ContentModel.ASSOC_CONTAINS,
					QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, String.valueOf(now.getTime())), 
					RegModel.TYPE_AUDIT_ENTITY, propsAE);

		} else {
			logger.error("Error creating audit entity content!");
		}
	}
	
	public static String getCurrentUsername() {
		return FormezModel.getServiceRegistry().getAuthenticationService().getCurrentUserName();
	}
	
	public static String getCurrentSitename(NodeRef noderef) {
		return FormezModel.getServiceRegistry().getSiteService().getSite(noderef).getShortName();
	}

}
