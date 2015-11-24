package it.formez.reg.service;

import it.formez.model.FormezModel;
import it.formez.reg.model.RegModel;

import java.io.InputStream;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.alfresco.model.ContentModel;
import org.alfresco.service.ServiceRegistry;
import org.alfresco.service.cmr.model.FileExistsException;
import org.alfresco.service.cmr.model.FileInfo;
import org.alfresco.service.cmr.model.FileNotFoundException;
import org.alfresco.service.cmr.repository.AssociationRef;
import org.alfresco.service.cmr.repository.ChildAssociationRef;
import org.alfresco.service.cmr.repository.ContentReader;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.cmr.repository.StoreRef;
import org.alfresco.service.cmr.search.SearchService;
import org.alfresco.service.cmr.site.SiteInfo;
import org.alfresco.service.namespace.QName;
import org.apache.log4j.Logger;
import org.json.JSONObject;



public class ProtocolService {
	
	private static Logger logger = Logger.getLogger(ProtocolService.class);
	private static final int NUM_CIFRE_PROTOCOLLO = 7;
	
	private ProtocolService(){}
	
	/**
	 * create protocol from json submit
	 * @param params 
	 * @throws Exception 
	 */
	public static String createProtocol(JSONObject params) throws Exception{
		String siteName = params.getString("site");
		ServiceRegistry serviceRegistry = FormezModel.getServiceRegistry();
		NodeService nodeService = serviceRegistry.getNodeService();
		SiteInfo site = serviceRegistry.getSiteService().getSite(siteName);
				
		NodeRef protocolContainer = serviceRegistry.getSiteService().getContainer(siteName, RegModel.CONTAINER_PROTOCOL);
		
		NodeRef folderContainer = ProtocolService.checkStructureFolder(protocolContainer);
		
		boolean prenotation = false;
		String number = "";
		String noderef = params.getString("noderef");
		NodeRef protNode = null;
		if(noderef.trim().length()>0){
			prenotation = true;
			protNode = new NodeRef(noderef);
			number = nodeService.getProperty(protNode, RegModel.PROP_PROTOCOL_NUMBER).toString();
		} else {		
			number = ProtocolService.generateNumber(site.getShortName());
		}
		
		//Create Protocol Node
		Map<QName, Serializable> propsProt = new HashMap<QName, Serializable>(8);
		if(!prenotation){
			propsProt.put(ContentModel.PROP_NAME, number);
			propsProt.put(RegModel.PROP_PROTOCOL_NUMBER, number);
			propsProt.put(RegModel.PROP_PROTOCOL_DATE, new Date());
			propsProt.put(RegModel.PROP_PROTOCOL_DIRECTION_TYPE, params.getString("direction"));
		}
		propsProt.put(RegModel.PROP_PROTOCOL_SUBJECT, params.getString("subject"));
		propsProt.put(RegModel.PROP_PROTOCOL_NOTES, params.getString("notes"));
		propsProt.put(RegModel.PROP_PROTOCOL_STATUS, RegModel.REG_STATUS_PROTOCOLLATO);
		propsProt.put(RegModel.PROP_PROTOCOL_DELIVERY_MODE, params.getString("deliverymode"));
		
		if(prenotation){
			nodeService.addProperties(protNode, propsProt);
		} else {
			protNode = nodeService.createNode(folderContainer, ContentModel.ASSOC_CONTAINS,	QName.createQName(number),
					RegModel.TYPE_PROTOCOL, propsProt).getChildRef();
		}
		
		NodeRef docRef = null;
		List<AssociationRef> yetdoc = nodeService.getTargetAssocs(protNode, RegModel.ASSOC_PROTOCOL_DOCUMENT);
		if(yetdoc!=null && yetdoc.size()>0){
			docRef = yetdoc.get(0).getTargetRef();
		} else {
			String doc = params.getString("doc");
			if(doc.trim().length()>0){
				docRef = new NodeRef(doc);
				//calcolo e setto hash
				ContentReader reader = serviceRegistry.getContentService().getReader(docRef, ContentModel.PROP_CONTENT);
				String hash = DigestGenerator.sha2GenerateDigest(reader.getContentInputStream());
				nodeService.setProperty(protNode, RegModel.PROP_PROTOCOL_HASHCODE, hash);
				// aggiungo associazione tra doc e protocollo
				nodeService.addAspect(docRef, RegModel.ASPECT_RECORDABLE, null);
				nodeService.createAssociation(protNode, docRef,  RegModel.ASSOC_PROTOCOL_DOCUMENT);
				nodeService.createAssociation(docRef, protNode, RegModel.ASSOC_RECORDABLE_ITEM);
				nodeService.setProperty(docRef, RegModel.PROP_RECORDABLE_NUMBER, number);
				String docName = nodeService.getProperty(docRef, ContentModel.PROP_NAME).toString();
				NodeRef protParent = serviceRegistry.getNodeService().getPrimaryParent(protNode).getParentRef();
				// lo sposto nel container protocollo per questioni di sicurezza
				serviceRegistry.getFileFolderService().move(docRef, protParent, number+"-"+docName);
			}
		}
		
		// fascicoli
		String fascicoli = params.getString("fascicolo");
		if(fascicoli.trim().length()>0){
			String[] fascicoliRef = fascicoli.split(",");
			for (String ref : fascicoliRef) {
				NodeRef filing = new NodeRef(ref);
				nodeService.createAssociation(protNode, filing, RegModel.ASSOC_PROTOCOL_FILING);
				if(docRef!=null){
					String docName = nodeService.getProperty(docRef, ContentModel.PROP_NAME).toString();
					nodeService.addChild(filing, docRef, ContentModel.ASSOC_CONTAINS, QName.createQName(filing.getId()+" "+docName));
				}
			}
		}
		
		// mittenti
		String mittenti = params.getString("sender");
		if(mittenti.trim().length()>0){
			String[] mittentiRef = mittenti.split(",");
			for (String ref : mittentiRef) {
				nodeService.createAssociation(protNode, new NodeRef(ref), RegModel.ASSOC_PROTOCOL_SENDERS);
			}
		}
		
		// mittenti
		String destinatari = params.getString("receiver");
		if(destinatari.trim().length()>0){
			String[] destinatariRef = destinatari.split(",");
			for (String ref : destinatariRef) {
				nodeService.createAssociation(protNode, new NodeRef(ref), RegModel.ASSOC_PROTOCOL_RECEIVERS);
			}
		}
				
		// attachments
		String attachs = params.getString("attachs");
		if(attachs.trim().length()>0){
			String[] attachRefs = attachs.split(",");
			for (String attach : attachRefs) {
				nodeService.createAssociation(protNode, new NodeRef(attach), RegModel.ASSOC_PROTOCOL_ATTACHMENTS);
			}
		}
		
		// protocollo mittente
		String mittentedate = params.getString("mittentedate");
		String mittenteprot = params.getString("mittenteprot");
		if(mittentedate.trim().length()>0 && mittenteprot.trim().length()>0){
			nodeService.setProperty(protNode, RegModel.PROP_PROTOCOL_DOCUMENT_DATE, FormezModel.dateSimpleformatter.parse(mittentedate));
			nodeService.setProperty(protNode, RegModel.PROP_PROTOCOL_DOCUMENT_PROTOCOL_NUMBER, mittenteprot);
		}
		// protocollo emergenza
		String sosdate = params.getString("sosdate");
		String sosprot = params.getString("sosprot");
		if(sosdate.trim().length()>0 && sosprot.trim().length()>0){
			nodeService.setProperty(protNode, RegModel.PROP_PROTOCOL_REG_EMERGENCY_DATE, FormezModel.dateSimpleformatter.parse(sosdate));
			nodeService.setProperty(protNode, RegModel.PROP_PROTOCOL_REG_EMERGENCY_NUMBER, sosprot);
		}

		AuditService.auditProtocol(protNode);
		return number;
	}
	
	/**
	 * set metadata values for node just created (of type protocol)
	 * @param node of type protocol created with form post
	 * @return
	 * @throws FileExistsException
	 * @throws FileNotFoundException
	 */
	public static String fillProtocol(NodeRef node) throws FileExistsException, FileNotFoundException {
		ServiceRegistry serviceRegistry = FormezModel.getServiceRegistry();
		NodeService nodeService = serviceRegistry.getNodeService();

		if (nodeService.getProperty(node, RegModel.PROP_PROTOCOL_NUMBER) == null){
				
			SiteInfo site = serviceRegistry.getSiteService().getSite(node);
			// genero il numero di protocollo
			String number = ProtocolService.generateNumber(site.getShortName());
			nodeService.setProperty(node, RegModel.PROP_PROTOCOL_NUMBER, number);
			nodeService.setProperty(node, RegModel.PROP_PROTOCOL_DATE, new Date());
			// controllo se è presente il documento protocollato
			NodeRef parent = nodeService.getPrimaryParent(node).getParentRef();
			List<AssociationRef> documents = nodeService.getTargetAssocs(node, RegModel.ASSOC_PROTOCOL_DOCUMENT);
			if(documents.size()>0){
				// documento protocollato presente, calcolo l'hash
				NodeRef document = documents.get(0).getTargetRef();
				InputStream is = serviceRegistry.getContentService().getReader(document, ContentModel.PROP_CONTENT).getContentInputStream();
				String hash = DigestGenerator.sha2GenerateDigest(is);
				nodeService.setProperty(node, RegModel.PROP_PROTOCOL_HASHCODE, hash);
				Serializable docName = nodeService.getProperty(document, ContentModel.PROP_NAME);
				serviceRegistry.getFileFolderService().move(document, parent, number + "-" + docName);
				// aggiungo l'aspetto recordable al documento per riferirmi alla protocollazione
				nodeService.addAspect(document, RegModel.ASPECT_RECORDABLE, null);
				nodeService.createAssociation(document, node, RegModel.ASSOC_RECORDABLE_ITEM);
				nodeService.setProperty(document, RegModel.PROP_RECORDABLE_NUMBER, number);
			}
			// controllo gli allegati ed eventualmente li sposto
			List<AssociationRef> attachs = nodeService.getTargetAssocs(node, RegModel.ASSOC_PROTOCOL_ATTACHMENTS);
			if(attachs.size()>0){
				for (AssociationRef associationRef : attachs) {
					NodeRef attach = associationRef.getTargetRef();
					Serializable attName = nodeService.getProperty(attach, ContentModel.PROP_NAME);
					serviceRegistry.getFileFolderService().move(attach, parent, number + "-attach-" + attName);
				}
			}
			
			serviceRegistry.getFileFolderService().move(node, parent, number);
			
			AuditService.auditProtocol(node);
		}
		
		return "";
	}
	
	/**
	 * protocol .eml file
	 * @param eml
	 * @return
	 * @throws FileExistsException
	 * @throws FileNotFoundException
	 */
	public static String createProtocolFromPec(NodeRef eml) throws FileExistsException, FileNotFoundException {
		ServiceRegistry serviceRegistry = FormezModel.getServiceRegistry();
		NodeService nodeService = serviceRegistry.getNodeService();
		SiteInfo site = serviceRegistry.getSiteService().getSite(eml);
		Date now = new Date();

		NodeRef protocolContainer = serviceRegistry.getSiteService().getContainer(site.getShortName(), RegModel.CONTAINER_PROTOCOL);
		NodeRef folderContainer = ProtocolService.checkStructureFolder(protocolContainer);
		NodeRef rubricaFolder = serviceRegistry.getSearchService().query(StoreRef.STORE_REF_WORKSPACE_SPACESSTORE, 
				SearchService.LANGUAGE_XPATH, "/app:company_home/cm:Formez/cm:adb").getNodeRef(0);
				
		String number = ProtocolService.generateNumber(site.getShortName());

		String subject = nodeService.getProperty(eml,null).toString();
		String mittente = nodeService.getProperty(eml, null).toString();
		ArrayList<String> destinatari = (ArrayList<String>) nodeService.getProperty(eml,null);
		
		// creo o recupero il nodo del contatto mittente
		NodeRef mittenteNode = getContactNode(mittente, rubricaFolder);
		
		List<NodeRef> destinatariNodes = new ArrayList<NodeRef>();
		for (String destinatario : destinatari) {
			NodeRef destinatarioNode = getContactNode(destinatario, rubricaFolder);
			if(destinatarioNode!=null){
				destinatariNodes.add(destinatarioNode);
			}
		}
		
		//Create Protocol Node
		Map<QName, Serializable> properties = new HashMap<QName, Serializable>(8);
		properties.put(ContentModel.PROP_NAME, number);
		properties.put(RegModel.PROP_PROTOCOL_NUMBER, number);
		properties.put(RegModel.PROP_PROTOCOL_DATE, now);
		properties.put(RegModel.PROP_PROTOCOL_SUBJECT, subject);
		properties.put(RegModel.PROP_PROTOCOL_NOTES, "");
		properties.put(RegModel.PROP_PROTOCOL_STATUS, RegModel.REG_STATUS_PROTOCOLLATO);
		if(nodeService.getType(eml).equals(null)){
			properties.put(RegModel.PROP_PROTOCOL_DIRECTION_TYPE, RegModel.REG_DIRECTION_RECEIVED);
		} else {
			properties.put(RegModel.PROP_PROTOCOL_DIRECTION_TYPE, RegModel.REG_DIRECTION_SENT);
		}
		properties.put(RegModel.PROP_PROTOCOL_DELIVERY_MODE, null);
		
		NodeRef protNode = nodeService.createNode(folderContainer, ContentModel.ASSOC_CONTAINS,	QName.createQName(number), 
				RegModel.TYPE_PROTOCOL, properties).getChildRef();
		
		//ASSOC. sender receiver
		if (mittenteNode != null){
			nodeService.createAssociation(protNode, mittenteNode, RegModel.ASSOC_PROTOCOL_SENDERS);
		}
		for (NodeRef destinatarioNode : destinatariNodes) {
			nodeService.createAssociation(protNode, destinatarioNode, RegModel.ASSOC_PROTOCOL_RECEIVERS);
		}
							
		//hash e associazione aspect document
		ContentReader reader = serviceRegistry.getContentService().getReader(eml, ContentModel.PROP_CONTENT);
		String hash = DigestGenerator.sha2GenerateDigest(reader.getContentInputStream());
		nodeService.setProperty(protNode, RegModel.PROP_PROTOCOL_HASHCODE, hash);
		nodeService.addAspect(eml, RegModel.ASPECT_RECORDABLE, null);
		nodeService.createAssociation(protNode, eml,  RegModel.ASSOC_PROTOCOL_DOCUMENT);
		nodeService.createAssociation(eml, protNode, RegModel.ASSOC_RECORDABLE_ITEM);
		nodeService.setProperty(eml, RegModel.PROP_RECORDABLE_NUMBER, number);
		
		// gli attachments della mail diventano attachments
		List<AssociationRef> attachments = nodeService.getTargetAssocs(eml,null);
		for (AssociationRef attachment : attachments) {
			nodeService.createAssociation(protNode, attachment.getTargetRef(), RegModel.ASSOC_PROTOCOL_ATTACHMENTS);
		}
								
		AuditService.auditProtocol(protNode);

		return number;
	}
	
	/**
	 * create an empty protocol (for protocol prenotation funcionality)
	 * @param siteName
	 * @param now
	 * @return
	 */
	public static NodeRef createEmptyProtocol(String siteName, String direction, Date now){
		ServiceRegistry serviceRegistry = FormezModel.getServiceRegistry();
		NodeService nodeService = serviceRegistry.getNodeService();
		SiteInfo site = serviceRegistry.getSiteService().getSite(siteName);
				
		NodeRef protocolContainer = serviceRegistry.getSiteService().getContainer(siteName, RegModel.CONTAINER_PROTOCOL);
		
		NodeRef folderContainer = ProtocolService.checkStructureFolder(protocolContainer);
		
		String number = ProtocolService.generateNumber(site.getShortName());
		
		//Create Protocol Node
		Map<QName, Serializable> propsProt = new HashMap<QName, Serializable>(8);
		propsProt.put(ContentModel.PROP_NAME, number);
		propsProt.put(RegModel.PROP_PROTOCOL_NUMBER, number);
		propsProt.put(RegModel.PROP_PROTOCOL_DATE, now);
		propsProt.put(RegModel.PROP_PROTOCOL_SUBJECT, "");
		propsProt.put(RegModel.PROP_PROTOCOL_NOTES, "");
		propsProt.put(RegModel.PROP_PROTOCOL_STATUS, RegModel.REG_STATUS_PRENOTATO);
		propsProt.put(RegModel.PROP_PROTOCOL_DIRECTION_TYPE, direction);
		propsProt.put(RegModel.PROP_PROTOCOL_DELIVERY_MODE, RegModel.REG_DELIVERY_DIRECT);
		
		ChildAssociationRef protNode = nodeService.createNode(folderContainer, ContentModel.ASSOC_CONTAINS,	QName.createQName(number), 
				RegModel.TYPE_PROTOCOL, propsProt);
		
		NodeRef protNodeRef = protNode.getChildRef();
		AuditService.auditProtocol(protNodeRef);
		
		return protNodeRef;

	}
	
	/**
	 * cancel protocol
	 * @param nodeRef
	 * @param notes
	 * @return
	 */
	public static NodeRef cancelProtocol(NodeRef nodeRef, String notes) {
		
		String cancelReason = " ANNULLATO PER: ";
		NodeService nodeService = FormezModel.getServiceRegistry().getNodeService();
		
		logger.debug("Starting to cancel protocol with noderef: " + nodeRef);
		
		// set status property to "Annullato" on protocol item
		nodeService.setProperty(nodeRef, RegModel.PROP_PROTOCOL_STATUS, "Annullato");
		
		// append cancel notes to notes
		String oldNotes = (String) nodeService.getProperty(nodeRef, RegModel.PROP_PROTOCOL_NOTES);
		nodeService.setProperty(nodeRef, RegModel.PROP_PROTOCOL_NOTES, oldNotes+cancelReason+notes);
		
		AuditService.auditCancelProtocol(nodeRef, notes);
		
		logger.debug("Canceled protocol with noderef: " + nodeRef);
		
		return nodeRef;
	}

	/**
	 * generate next protocol number
	 * @param shortName name of the site
	 * @return
	 */
	public static String generateNumber(String shortName) {
		ServiceRegistry serviceRegistry = FormezModel.getServiceRegistry();
		NodeService nodeService = serviceRegistry.getNodeService();

		String numProtocollo = "";
		NodeRef container = serviceRegistry.getSiteService().getContainer(shortName, RegModel.CONTAINER_PROTOCOL);
		synchronized (container) {
			
			String cifreIniziali = "";
			// get contatore props
			int year = Integer.parseInt(nodeService.getProperty(container, RegModel.PROP_CONTATORE_YEAR).toString());
			long counter = Long.parseLong(nodeService.getProperty(container, RegModel.PROP_CONTATORE_COUNTER).toString());
			String prefix = nodeService.getProperty(container, RegModel.PROP_CONTATORE_PREFIX).toString();
			
			int currentYear = Calendar.getInstance().get(Calendar.YEAR);
			// setting new year if necessary
			if (currentYear > year) {
				counter = 1;
				logger.debug("Setting new year on protocol counter. Old year [" + year + "] new year [" + currentYear + "]");
				year = currentYear;
				nodeService.setProperty(container, RegModel.PROP_CONTATORE_YEAR, year);
			}
			
			// build protocol number
			int len = String.valueOf(counter).length();
			if (len < NUM_CIFRE_PROTOCOLLO) {
				for (int i = 0; i < NUM_CIFRE_PROTOCOLLO - len; i++) {
					cifreIniziali += "0";
				}
			}
			
			String cifreFinali = cifreIniziali + String.valueOf(counter);
			numProtocollo = prefix + "-" + year + "-" + cifreFinali;
			
			// inc the counter.
			counter += 1;
			nodeService.setProperty(container, RegModel.PROP_CONTATORE_COUNTER, counter);
			
			logger.debug("Generated protocol number: [" + numProtocollo + "]");
		}
		
		return numProtocollo;
	}

	/**
	 * create protocol container
	 * @return
	 */
	public static NodeRef createProtocolContainer(String siteName) {
		ServiceRegistry serviceRegistry = FormezModel.getServiceRegistry();
		NodeService nodeService = serviceRegistry.getNodeService();
		NodeRef container = serviceRegistry.getSiteService().createContainer(siteName, RegModel.CONTAINER_PROTOCOL, ContentModel.TYPE_FOLDER, null);
		Map<QName, Serializable> props = new HashMap<QName, Serializable>();
		props.put(RegModel.PROP_CONTATORE_COUNTER, 1);
		props.put(RegModel.PROP_CONTATORE_YEAR, Calendar.getInstance().get(Calendar.YEAR));
		props.put(RegModel.PROP_CONTATORE_PREFIX, siteName.toUpperCase());
		nodeService.addAspect(container, RegModel.ASPECT_CONTATORE, props);
		return container;
	}
	
	/**
	 * Create Structure YEAR-MONTH-DAY from a container
	 * @param container
	 * @return
	 */
	public static NodeRef checkStructureFolder(NodeRef container){
		ServiceRegistry serviceRegistry = FormezModel.getServiceRegistry();
		NodeService nodeService = serviceRegistry.getNodeService();

		Calendar calendar = Calendar.getInstance();
		calendar.setTime(new Date());
		String year = String.valueOf(calendar.get(Calendar.YEAR));
		String month = String.valueOf(calendar.get(Calendar.MONTH) + 1);
		
		NodeRef monthNode = null;		
		NodeRef yearNode = null;

		if (container != null){
			List<ChildAssociationRef> children2 = nodeService.getChildAssocs(container);

			for (Iterator<ChildAssociationRef> iterator2 = children2.iterator(); iterator2.hasNext();) {
				ChildAssociationRef childAssociationRef2 = iterator2.next();
				NodeRef childNode2 = childAssociationRef2.getChildRef();
				Serializable name2 = nodeService.getProperty(childNode2, ContentModel.PROP_NAME);
				if (name2.equals(year)){
					yearNode = childNode2;
					break;
				}
			}
			
			if (yearNode == null){
				// create container year
				FileInfo yearCreated = serviceRegistry.getFileFolderService().create(container, year, ContentModel.TYPE_FOLDER);
				yearNode = yearCreated.getNodeRef();
			}
			
			if (yearNode != null){
				List<ChildAssociationRef> children3 = nodeService.getChildAssocs(yearNode);

				for (Iterator<ChildAssociationRef> iterator3 = children3.iterator(); iterator3.hasNext();) {
					ChildAssociationRef childAssociationRef3 = iterator3.next();
					NodeRef childNode3 = childAssociationRef3.getChildRef();
					Serializable name3 = nodeService.getProperty(childNode3, ContentModel.PROP_NAME);
					if (name3.equals(month)){
						monthNode = childNode3;
						break;
					}
				}
				
				if (monthNode == null){
					// create container month
					FileInfo monthCreated = serviceRegistry.getFileFolderService().create(yearNode, month, ContentModel.TYPE_FOLDER);
					monthNode = monthCreated.getNodeRef();
				}

			}
		}
		
		return monthNode;
	};
		
	/**
	 * from an email, get/create a contact
	 * @param contact
	 * @param rubrica
	 * @return
	 */
	public static NodeRef getContactNode(String contact, NodeRef rubrica){
		ServiceRegistry serviceRegistry = FormezModel.getServiceRegistry();
		NodeRef contactNode = null;
		
		if (contact != null && !contact.equals("")){
			String contactName = contact.contains("<") ? contact.split("<")[0].trim() : contact;
			contactName = null;
			contactNode = serviceRegistry.getNodeService().getChildByName(rubrica, ContentModel.ASSOC_CONTAINS, contactName);
								
			if(contactNode==null){
				//create contact
				contactNode = serviceRegistry.getFileFolderService().create(rubrica, contactName, RegModel.TYPE_ADDRESS_BOOK_CONTACT).getNodeRef();
				serviceRegistry.getNodeService().setProperty(contactNode, RegModel.PROP_ADDRESS_BOOK_NAME, contactName);
				serviceRegistry.getNodeService().setProperty(contactNode, RegModel.PROP_ADDRESS_BOOK_EMAIL, contact);
			}
			return contactNode;
		} else {
			return null;
		}
	}
	
	/**
	 * set titolario counter 
	 * @param titFolderNode
	 * @return 
	 */
	public static void setTitolarioCounter(NodeRef titFolderNode){
		
		ServiceRegistry serviceRegistry = FormezModel.getServiceRegistry();
		NodeService nodeService = serviceRegistry.getNodeService();
		SiteInfo site = serviceRegistry.getSiteService().getSite(titFolderNode);
		NodeRef siteDocLib = serviceRegistry.getSiteService().getContainer(site.getShortName(), FormezModel.CONTAINER_DOCLIB);
		QName type = nodeService.getType(titFolderNode);
		int counter = 0;
		if (type.isMatch( RegModel.TYPE_TIT_TITOLO)) {
			counter = (Integer) nodeService.getProperty(siteDocLib, RegModel.PROP_TIT_COUNTER_TITOLO);
			counter++;
			nodeService.setProperty(siteDocLib, RegModel.PROP_TIT_COUNTER_TITOLO, counter);
		} else if (type.isMatch(RegModel.TYPE_TIT_CLASSE)) {
			counter = (Integer) nodeService.getProperty(siteDocLib, RegModel.PROP_TIT_COUNTER_CLASSE);
			counter++;
			nodeService.setProperty(siteDocLib, RegModel.PROP_TIT_COUNTER_CLASSE, counter);
		} else if (type.isMatch(RegModel.TYPE_TIT_FASCICOLO)) {
			counter = (Integer) nodeService.getProperty(siteDocLib, RegModel.PROP_TIT_COUNTER_FASCICOLO);
			counter++;
			nodeService.setProperty(siteDocLib, RegModel.PROP_TIT_COUNTER_FASCICOLO, counter);
		}
		nodeService.setProperty(titFolderNode, RegModel.PROP_BASEFOLDER_NUMBER, counter);
	}

	
}
