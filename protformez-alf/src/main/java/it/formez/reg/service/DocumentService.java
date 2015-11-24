package it.formez.reg.service;

import it.formez.model.FormezModel;
import it.formez.reg.model.RegModel;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.alfresco.model.ContentModel;
import org.alfresco.service.ServiceRegistry;
import org.alfresco.service.cmr.model.FileExistsException;
import org.alfresco.service.cmr.model.FileNotFoundException;
import org.alfresco.service.cmr.repository.AssociationRef;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.cmr.repository.Path;
import org.alfresco.service.cmr.repository.StoreRef;
import org.alfresco.service.cmr.search.ResultSet;
import org.alfresco.service.cmr.search.SearchService;
import org.alfresco.service.cmr.security.PermissionService;
import org.alfresco.service.cmr.site.SiteInfo;
import org.alfresco.service.namespace.QName;
import org.apache.log4j.Logger;
import org.w3c.dom.Attr;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.Image;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.ColumnText;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfPageEventHelper;
import com.itextpdf.text.pdf.PdfWriter;


public class DocumentService {
	
	private DocumentService(){}
	
	private static Logger logger = Logger.getLogger(DocumentService.class);
	private static int width = 58; //pixels
	private static int height = 58; //pixels
	private static final String DEFAULT_DATE_PATTERN = "dd-MM-yyyy HH:mm:ss";
	private static final String DEFAULT_DATE_PATTERN2 = "dd-MM-yyyy HH:mm";
	
	public static void signature(NodeRef noderef, OutputStream os){
		ServiceRegistry serviceRegistry = FormezModel.getServiceRegistry();
		PdfWriter writer = null;
		
		SiteInfo site = serviceRegistry.getSiteService().getSite(noderef);
		
		// retrieve protocol info
		String protocolNumber = serviceRegistry.getNodeService().getProperty(noderef, RegModel.PROP_PROTOCOL_NUMBER).toString();
		Date protocolDate = (Date) serviceRegistry.getNodeService().getProperty(noderef, RegModel.PROP_PROTOCOL_DATE);
		
		String[] elements = protocolNumber.split("-");
		String number = elements[1];
		
		logger.debug("Try to generate signature for protocol number: [" + number + "]");
		Rectangle rt = new Rectangle(144.56F, 53.85F);//FOR CUSTOM PAGE
		//Document document = new Document(PageSize.A8.rotate());
		Document document = new Document(rt);
		try {
			writer = PdfWriter.getInstance(document, os);
		} catch (DocumentException e) {
			logger.error("Unable to open pdf file: ", e);
		}
		//document.setMargins(2.83F, 2.83F, 2.83F, 2.83F);
		document.setMargins(0F, 0F, 0F, 0F);
		//document.setMarginMirroring(true);
		document.open();
		
		// create barcode image file with google zxing
		Image img = null;
		
		try{
		    BitMatrix bitMatrix = new QRCodeWriter().encode(protocolNumber,BarcodeFormat.QR_CODE, width, height);
			
		    ByteArrayOutputStream barcode = new ByteArrayOutputStream();
		    MatrixToImageWriter.writeToStream(bitMatrix, "png", barcode);
		    img = Image.getInstance(barcode.toByteArray());
			img.setAlignment(Image.LEFT);
			img.setAbsolutePosition(0, 0);
			//img.setAlignment(Image.LEFT | Image.TEXTWRAP);
		} catch (Exception e) {
			logger.debug("Errore durante la generazione del barcode");
			e.printStackTrace();
		}
		
		String aooName = site.getTitle();
		
		
		//Divido la stringa al max in tre righe
		List<String> splittedAooName = new ArrayList<String>();
		
		int firstindex = aooName.indexOf(" ",15);
		
		if (firstindex > 0){
			splittedAooName.add(aooName.substring(0, firstindex));
			String subString = aooName.substring(firstindex+1);
			
			int secondindex = subString.indexOf(" ",15);
						
			if (secondindex > 0){
				splittedAooName.add(subString.substring(0, secondindex));
				splittedAooName.add(subString.substring(secondindex+1));
			}
			else{
				splittedAooName.add(subString);
			}
			
		}
		else{
			splittedAooName.add(aooName);
		}
		
		try {
			// add barcode
			logger.debug("Adding barcode image to pdf file...");

			document.add(img);
			
			SimpleDateFormat df = new SimpleDateFormat(DEFAULT_DATE_PATTERN2);
			
//			absText(writer, aooName, 20, 45);
			int yPos = 30;
			int coeff = 0;
			for (Iterator<String> iterator = splittedAooName.iterator(); iterator.hasNext();) {
				String string = iterator.next();
				absText(writer, string, 53, yPos - coeff);
				coeff+=10;
			}
			absText(writer, protocolNumber, 53, yPos - coeff);
			coeff += 10;
			absText(writer, "del " + df.format(protocolDate), 53, yPos - coeff);

			/*document.add(new Paragraph(" "));
			document.add(new Paragraph(protocolNumber, courierFontBold));
			document.add(new Paragraph("del " + SimpleDateFormat.getDateTimeInstance().format(protocolDate), courierFontBold));
			document.add(new Paragraph("ID AOO: " + aooIdentifier, courierFontPlain));
			document.add(new Paragraph("AOO: " + aooName, courierFontPlain));*/
		} catch (DocumentException e) {
			logger.error("Unable to add element to pdf file: ", e);
		}
		
		document.close();
		writer.close();
		
		AuditService.auditPrintSignature(noderef);
		
		logger.debug("Succesfull generated signature for protocol [" + protocolNumber + "]");
	}
	
	public static void receipt(NodeRef nodeRef, OutputStream os) {
		ServiceRegistry serviceRegistry = FormezModel.getServiceRegistry();
		NodeService nodeService = serviceRegistry.getNodeService();
		PdfWriter writer = null;
		
		SiteInfo site = serviceRegistry.getSiteService().getSite(nodeRef);
		
		Map<QName, Serializable> props = new HashMap<QName, Serializable>(nodeService.getProperties(nodeRef));
		
		String protocolNumber = props.get(RegModel.PROP_PROTOCOL_NUMBER).toString();
		Date protocolDate = (Date)props.get(RegModel.PROP_PROTOCOL_DATE);
		String protocolSubject = props.get(RegModel.PROP_PROTOCOL_SUBJECT).toString();
		
		String[] elements = protocolNumber.split("-");
		String number = elements[1];
		
		logger.debug("Try to generate ticket for protocol number: [" + number + "]");
		
		Document document = new Document(PageSize.A4);
		try {
			writer = PdfWriter.getInstance(document, os);
		} catch (DocumentException e) {
			logger.error("Unable to open pdf file: ", e);
		}
		
		document.open();
		
		
		NodeRef aooNodeRef = serviceRegistry.getSiteService().getContainer(site.getShortName(), RegModel.CONTAINER_PROTOCOL);
		String aooIdentifier = serviceRegistry.getNodeService().getProperty(aooNodeRef, RegModel.PROP_CONTATORE_PREFIX).toString();
		String aooName = site.getTitle();
		
		
		logger.debug("Generating ticket for protocol [" + protocolNumber + "]");
		try {
			// add barcode
			logger.debug("Adding protocol number to pdf file...");
			
			Font courierFont = FontFactory.getFont(FontFactory.COURIER, 11, Font.BOLD, BaseColor.BLACK);
			document.add(new Paragraph("Protocollo numero: " + protocolNumber, courierFont));
			
			SimpleDateFormat dateFormat = new SimpleDateFormat(DEFAULT_DATE_PATTERN2);
			document.add(new Paragraph("Data di protocollo: " + dateFormat.format(protocolDate), courierFont));
			document.add(new Paragraph("Oggetto del protocollo: " + protocolSubject, courierFont));
			document.add(new Paragraph("Voce di titolario: " + getClassification(nodeRef), courierFont));
			document.add(new Paragraph("ID AOO: " + aooIdentifier, courierFont));
			document.add(new Paragraph("Denominazione AOO: " + aooName, courierFont));
		} catch (DocumentException e) {
			logger.error("Unable to add element to pdf file: ", e);
		}
		
		document.close();
		
		try {
			writer.close();
			os.close();
		} catch (IOException e) {}
		
		AuditService.auditPrintReceipt(nodeRef);

		logger.debug("Succesfull generated ticket for protocol [" + protocolNumber + "]");
	}
	
	public static void addDocument(NodeRef protocol, NodeRef document){
		ServiceRegistry serviceRegistry = FormezModel.getServiceRegistry();
		NodeService nodeService = serviceRegistry.getNodeService();
		
		// retrieve protocol info
		// add assoc to protocol
		nodeService.createAssociation(protocol, document, RegModel.ASSOC_PROTOCOL_DOCUMENT);
		String protocolNumber = serviceRegistry.getNodeService().getProperty(protocol, RegModel.PROP_PROTOCOL_NUMBER).toString();

		NodeRef parent = serviceRegistry.getNodeService().getPrimaryParent(protocol).getParentRef();

		try {
			InputStream is = serviceRegistry.getContentService().getReader(document, ContentModel.PROP_CONTENT).getContentInputStream();
			String hash = DigestGenerator.sha2GenerateDigest(is);
			nodeService.setProperty(protocol, RegModel.PROP_PROTOCOL_HASHCODE, hash);
			Serializable docName = nodeService.getProperty(document, ContentModel.PROP_NAME);
			
			serviceRegistry.getFileFolderService().move(document, parent, protocolNumber + "-" + docName);
			
			// controllo le classificazioni ed eventualmente aggiungo il parent
			List<AssociationRef> classers = nodeService.getTargetAssocs(protocol, RegModel.ASSOC_PROTOCOL_FILING);
			String documentName = nodeService.getProperty(document, ContentModel.PROP_NAME).toString();
			if(classers.size()>0){
				for (AssociationRef associationRef : classers) {
					NodeRef classer = associationRef.getTargetRef();
					nodeService.addChild(classer, document, ContentModel.ASSOC_CONTAINS, QName.createQName(documentName));
				}
			}
			// aggiungo l'aspetto recordable al documento per riferirmi alla protocollazione
			nodeService.addAspect(document, RegModel.ASPECT_RECORDABLE, null);
			nodeService.createAssociation(document, protocol, RegModel.ASSOC_RECORDABLE_ITEM);
			nodeService.setProperty(document, RegModel.PROP_RECORDABLE_NUMBER, protocolNumber);
					
			AuditService.auditAddDocument(protocol);
			
			logger.debug("Succesfull added document for protocol [" + protocolNumber + "]");
		} catch (FileExistsException e) {
			logger.error("Unable to add document to protocol: " + protocolNumber, e);
		} catch (FileNotFoundException e) {
			logger.error("Unable to add document to protocol: " + protocolNumber, e);
		}

	}
	
	public static void printProtocolRegistry(List<NodeRef> noderefs, OutputStream os, String siteName, boolean daily, String dailyDate) {
		ServiceRegistry serviceRegistry = FormezModel.getServiceRegistry();
		PdfWriter writer = null;
		
		logger.debug("Try to generate protocol registry...");
		
		Document document = new Document(PageSize.A4.rotate(), 10, 10, 10, 10);
		try {
			writer = PdfWriter.getInstance(document, os);
		} catch (DocumentException e) {
			logger.error("Unable to open pdf file: ", e);
		}
		
		writer.setBoxSize("art", new Rectangle(36, 54, 1550, 788));
		
		PageNumberFooter event = new PageNumberFooter();
		writer.setPageEvent(event);
		
		document.open();
		
		PdfPTable table = createTableHeader();
		
		for (NodeRef nodeRef : noderefs) {
			addInfoToProtocolRegistry(table, nodeRef);
		}
		
		SimpleDateFormat dateFormat = new SimpleDateFormat(DEFAULT_DATE_PATTERN);
		Font courierPlainFont = FontFactory.getFont(FontFactory.COURIER, 12,  BaseColor.BLACK);
		
		NodeRef aooNodeRef = serviceRegistry.getSiteService().getContainer(siteName, RegModel.CONTAINER_PROTOCOL);
		String aooIdentifier = serviceRegistry.getNodeService().getProperty(aooNodeRef, RegModel.PROP_CONTATORE_PREFIX).toString();
		String aooName = serviceRegistry.getSiteService().getSite(siteName).getTitle();
				
		try {
			// add title
			if(daily){
				Paragraph title = new Paragraph("Registro giornaliero del " + dailyDate, FontFactory.getFont(FontFactory.COURIER, 12, Font.BOLD, BaseColor.BLACK));
				title.setAlignment(Paragraph.ALIGN_CENTER);
				document.add(title);
			} else {
				Paragraph title = new Paragraph("Registro protocollo generato il " + dateFormat.format(new Date()), FontFactory.getFont(FontFactory.COURIER, 12, Font.BOLD, BaseColor.BLACK));
				title.setAlignment(Paragraph.ALIGN_CENTER);
				document.add(title);
			}
			Paragraph idAooParagraph = new Paragraph("ID AOO: " + aooIdentifier, courierPlainFont);
			idAooParagraph.setAlignment(Paragraph.ALIGN_CENTER);
			document.add(idAooParagraph);
			Paragraph nameAooParagraph = new Paragraph("Denominazione AOO: " + aooName, courierPlainFont);
			nameAooParagraph.setAlignment(Paragraph.ALIGN_CENTER);
			document.add(nameAooParagraph);
			Paragraph empty = new Paragraph(" ");
			document.add(empty);
			document.add(empty);
			document.add(table);
		} catch (DocumentException e1) {
			logger.error("Problem adding table to protocol registry: ", e1);
		}
		document.close();
		
		try {
			writer.close();
			os.close();
		} catch (IOException e) {}
		
		logger.debug("Protocol registry generated.");
	}
	
	public static String getClassification(NodeRef nodeRef) {
		NodeService nodeService = FormezModel.getServiceRegistry().getNodeService();
		PermissionService permissionService = FormezModel.getServiceRegistry().getPermissionService();

		List<AssociationRef> filling = nodeService.getTargetAssocs(nodeRef, RegModel.ASSOC_PROTOCOL_FILING);
		String classification = "";
		for (Iterator<AssociationRef> iterator = filling.iterator(); iterator.hasNext();) {
			AssociationRef associationRef = iterator.next();
			Path path = nodeService.getPath(associationRef.getTargetRef());
			path = path.subPath(5, path.size()-1);
			String displayPath = path.toDisplayPath(nodeService, permissionService);
			displayPath += "/"+nodeService.getProperty(associationRef.getTargetRef(), ContentModel.PROP_NAME).toString();
			
			classification += displayPath; // Titolo/Classe/Fascicolo

			if (iterator.hasNext()){
				classification += "; ";
			}
		}
		
		
		return classification;
	}
		
	public static void xmlSignature(NodeRef noderef, OutputStream os){
		ServiceRegistry serviceRegistry = FormezModel.getServiceRegistry();
		NodeService nodeService = serviceRegistry.getNodeService();
		PermissionService permissionService = serviceRegistry.getPermissionService();
		SearchService searchService = serviceRegistry.getSearchService();
		SiteInfo site = serviceRegistry.getSiteService().getSite(noderef);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-mm-dd");
		String tipoRiferimento = "MIME";
		
		// retrieve protocol info
		String protocolNumber = serviceRegistry.getNodeService().getProperty(noderef, RegModel.PROP_PROTOCOL_NUMBER).toString();
		
		String[] elements = protocolNumber.split("-");
		String number = elements[2];
		
		Date protocolDate = (Date) serviceRegistry.getNodeService().getProperty(noderef, RegModel.PROP_PROTOCOL_DATE);
		String dataR = sdf.format(protocolDate);		
		
		// filing
		List<AssociationRef> filing = nodeService.getTargetAssocs(noderef, RegModel.ASSOC_PROTOCOL_FILING);

		// REG DOCUMENT
		List<AssociationRef> document = nodeService.getTargetAssocs(noderef, RegModel.ASSOC_PROTOCOL_DOCUMENT);
		
		// ATTACHMENTS
		List<AssociationRef> attach = nodeService.getTargetAssocs(noderef, RegModel.ASSOC_PROTOCOL_ATTACHMENTS);
		
		// AMMINISTRAZIONE
		ResultSet res = searchService.query(StoreRef.STORE_REF_WORKSPACE_SPACESSTORE, SearchService.LANGUAGE_XPATH, "/app:company_home");
		NodeRef chome = res.getNodeRef(0);
		String govName = nodeService.getProperty(chome, FormezModel.PROP_GOV_NAME).toString();
		String govCode = nodeService.getProperty(chome, FormezModel.PROP_GOV_CODE).toString();
		
		// AOO
		NodeRef aooNodeRef = serviceRegistry.getSiteService().getContainer(site.getShortName(), RegModel.CONTAINER_PROTOCOL);
		
		String aooIdentifier = serviceRegistry.getNodeService().getProperty(aooNodeRef, RegModel.PROP_CONTATORE_PREFIX).toString();
		String aooName = site.getTitle();
		
		String indirizzoTelematico = nodeService.getProperty(site.getNodeRef(), FormezModel.PROP_CFG_AOO_EMAIL).toString();
		String typeIndTel = "smtp";
		String confermaRic = "si";
		String typeIndTelDest = "smtp";
		String typeIndTelRisp = "uri";
		String indirizzoTelematicoRisp = "";
		String riserv = "N";
		String ogg = serviceRegistry.getNodeService().getProperty(noderef, RegModel.PROP_PROTOCOL_SUBJECT).toString();
		String notes = serviceRegistry.getNodeService().getProperty(noderef, RegModel.PROP_PROTOCOL_NOTES).toString();;
								
		try {
			 
			DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
			DocumentBuilder docBuilder = docFactory.newDocumentBuilder();
			org.w3c.dom.Document doc = docBuilder.newDocument();

			// root
			org.w3c.dom.Element rootElement = doc.createElement("Segnatura");
			doc.appendChild(rootElement);
			
			Attr attr = doc.createAttribute("xml:lang");
			attr.setValue("it");
			rootElement.setAttributeNode(attr);
	 
				// Intestazione
				org.w3c.dom.Element intest = doc.createElement("Intestazione");
				rootElement.appendChild(intest);
				
					// Identificatore
					org.w3c.dom.Element identif = doc.createElement("Identificatore");
					intest.appendChild(identif);
					
						// CodiceAmministrazione
						org.w3c.dom.Element codeAmm = doc.createElement("CodiceAmministrazione");
						codeAmm.appendChild(doc.createTextNode(govCode));
						identif.appendChild(codeAmm);
						
						// CodiceAOO
						org.w3c.dom.Element codeAOO = doc.createElement("CodiceAOO");
						codeAOO.appendChild(doc.createTextNode(aooIdentifier));
						identif.appendChild(codeAOO);
						
						// NumeroRegistrazione
						org.w3c.dom.Element numReg = doc.createElement("NumeroRegistrazione");
						numReg.appendChild(doc.createTextNode(number));
						identif.appendChild(numReg);
						
						// DataRegistrazione
						org.w3c.dom.Element dataReg = doc.createElement("DataRegistrazione");
						dataReg.appendChild(doc.createTextNode(dataR));
						identif.appendChild(dataReg);
						
					// Origine
					org.w3c.dom.Element origine = doc.createElement("Origine");
					intest.appendChild(origine);
						
						// Indirizzo telematico
						org.w3c.dom.Element indirTelem = doc.createElement("IndirizzoTelematico");
						indirTelem.appendChild(doc.createTextNode(indirizzoTelematico));
						origine.appendChild(indirTelem);
						
						Attr attr2 = doc.createAttribute("tipo");
						attr2.setValue(typeIndTel);
						origine.setAttributeNode(attr2);
						
						// Mittente
						org.w3c.dom.Element mittente = doc.createElement("Mittente");
						origine.appendChild(mittente);
						
							// Amministrazione
							org.w3c.dom.Element amministrazione = doc.createElement("Amministrazione");
							mittente.appendChild(amministrazione);
							
								// Denominazione
								org.w3c.dom.Element denominazione = doc.createElement("Denominazione");
								denominazione.appendChild(doc.createTextNode(govName));
								amministrazione.appendChild(denominazione);

								// Unita organizativa
								org.w3c.dom.Element uniOrg = doc.createElement("UnitaOrganizzativa");
								amministrazione.appendChild(uniOrg);
								
									// Denominazione2
									org.w3c.dom.Element denominazione2 = doc.createElement("Denominazione");
									denominazione2.appendChild(doc.createTextNode(aooName));
									uniOrg.appendChild(denominazione2);
									
									// Indirizzo Postale
									org.w3c.dom.Element indPost = doc.createElement("IndirizzoPostale");
									uniOrg.appendChild(indPost);
									
										// Toponimo
										org.w3c.dom.Element toponimo = doc.createElement("Toponimo");
										String toponimoVal = nodeService.getProperty(site.getNodeRef(), FormezModel.PROP_CFG_AOO_TOPONIMO).toString();
										toponimo.setAttribute("dug", toponimoVal);
										String address = nodeService.getProperty(site.getNodeRef(), FormezModel.PROP_CFG_AOO_INDIRIZZO).toString();
										toponimo.appendChild(doc.createTextNode(address));
										indPost.appendChild(toponimo);
										
										// Civico
										org.w3c.dom.Element civico = doc.createElement("Civico");
										String civicoVal = nodeService.getProperty(site.getNodeRef(), FormezModel.PROP_CFG_AOO_CIVICO).toString();
										civico.appendChild(doc.createTextNode(civicoVal));
										indPost.appendChild(civico);
										
										// CAP
										org.w3c.dom.Element cap = doc.createElement("CAP");
										String capVal = nodeService.getProperty(site.getNodeRef(), FormezModel.PROP_CFG_AOO_CAP).toString();
										cap.appendChild(doc.createTextNode(capVal));
										indPost.appendChild(cap);

										// Comune
										org.w3c.dom.Element comune = doc.createElement("Comune");
										String comuneVal = nodeService.getProperty(site.getNodeRef(), FormezModel.PROP_CFG_AOO_COMUNE).toString();
										comune.appendChild(doc.createTextNode(comuneVal));
										indPost.appendChild(comune);
										
										// Provincia
										org.w3c.dom.Element provincia = doc.createElement("Provincia");
										String provinciaVal = nodeService.getProperty(site.getNodeRef(), FormezModel.PROP_CFG_AOO_PROVINCIA).toString();
										provincia.appendChild(doc.createTextNode(provinciaVal));
										indPost.appendChild(provincia);
									
									// Telefono
									org.w3c.dom.Element telefono = doc.createElement("Telefono");
									String telefonoVal = nodeService.getProperty(site.getNodeRef(), FormezModel.PROP_CFG_AOO_TEL).toString();
									telefono.appendChild(doc.createTextNode(telefonoVal));
									uniOrg.appendChild(telefono);
									
									// Fax
									org.w3c.dom.Element fax = doc.createElement("Fax");
									String faxVal = nodeService.getProperty(site.getNodeRef(), FormezModel.PROP_CFG_AOO_FAX).toString();
									fax.appendChild(doc.createTextNode(faxVal));
									uniOrg.appendChild(fax);
										
							// AOO
							org.w3c.dom.Element aoo = doc.createElement("AOO");
							mittente.appendChild(aoo);
							
								// Denominazione3
								org.w3c.dom.Element denominazione3 = doc.createElement("Denominazione");
								denominazione3.appendChild(doc.createTextNode(aooName));
								aoo.appendChild(denominazione3);
								
					// Destinazione
					org.w3c.dom.Element destinazione = doc.createElement("Destinazione");
					intest.appendChild(destinazione);
					
					Attr attr3 = doc.createAttribute("confermaRicezione");
					attr3.setValue(confermaRic);
					destinazione.setAttributeNode(attr3);
					
						// Indirizzo telematico dest
						org.w3c.dom.Element indirTelemDest = doc.createElement("IndirizzoTelematico");
						destinazione.appendChild(indirTelemDest);
						
						Attr attr4 = doc.createAttribute("tipo");
						attr4.setValue(typeIndTelDest);
						indirTelemDest.setAttributeNode(attr4);
						
					// Risposta
					org.w3c.dom.Element risposta = doc.createElement("Risposta");
					intest.appendChild(risposta);
					
						// Indirizzo telematico risp
						org.w3c.dom.Element indirTelemRisp = doc.createElement("IndirizzoTelematico");
						indirTelemRisp.appendChild(doc.createTextNode(indirizzoTelematicoRisp));
						risposta.appendChild(indirTelemRisp);
						
						Attr attr5 = doc.createAttribute("tipo");
						attr5.setValue(typeIndTelRisp);
						indirTelemRisp.setAttributeNode(attr5);

					// Riservato
					org.w3c.dom.Element riservato = doc.createElement("Riservato");
					riservato.appendChild(doc.createTextNode(riserv));
					intest.appendChild(riservato);
					
					// Oggetto
					org.w3c.dom.Element oggetto = doc.createElement("Oggetto");
					oggetto.appendChild(doc.createTextNode(ogg));
					intest.appendChild(oggetto);

					// Note
					org.w3c.dom.Element note = doc.createElement("Note");
					note.appendChild(doc.createTextNode(notes));
					intest.appendChild(note);
	 
			if (!filing.isEmpty()){	
				// Riferimenti
				org.w3c.dom.Element riferimenti = doc.createElement("Riferimenti");
				rootElement.appendChild(riferimenti);
				
					// ContestoProcedurale
					org.w3c.dom.Element contProd = doc.createElement("ContestoProcedurale");
					riferimenti.appendChild(contProd);
					
						// CodiceAmministrazione
						org.w3c.dom.Element codeAmm2 = doc.createElement("CodiceAmministrazione");
						codeAmm2.appendChild(doc.createTextNode(govCode));
						riferimenti.appendChild(codeAmm2);
						
						// CodiceAOO
						org.w3c.dom.Element codeAOO2 = doc.createElement("CodiceAOO");
						codeAOO2.appendChild(doc.createTextNode(aooIdentifier));
						riferimenti.appendChild(codeAOO2);
						
						// Identificativo
						org.w3c.dom.Element identifElement = doc.createElement("Identificativo");
						identifElement.appendChild(doc.createTextNode(aooName));
						riferimenti.appendChild(identifElement);
						
						// Tipo Contesto Procedurale
						org.w3c.dom.Element tipoContProc = doc.createElement("TipoContestoProcedurale");
						tipoContProc.appendChild(doc.createTextNode("IndicazioneClassificazione"));
						riferimenti.appendChild(tipoContProc);
						
						for (Iterator<AssociationRef> iterator = filing.iterator(); iterator.hasNext();) {
							AssociationRef associationRef = iterator.next();
							Path path = nodeService.getPath(associationRef.getTargetRef());
							path = path.subPath(5, path.size()-1);
							String displayPath = path.toDisplayPath(nodeService, permissionService);
							displayPath += "/"+nodeService.getProperty(associationRef.getTargetRef(), ContentModel.PROP_NAME).toString();
							String[] titClass = displayPath.split("/");

							// Classifica
							org.w3c.dom.Element classifica = doc.createElement("Classifica");
							riferimenti.appendChild(classifica);
							
								// aggiungo la classificazione (titolo, classe, [sottoclassi], fascicolo, [sottofascicoli]
								for(int i=1;i<titClass.length;i++){
									org.w3c.dom.Element level = doc.createElement("Livello");
									level.appendChild(doc.createTextNode(titClass[i]));
									classifica.appendChild(level);
								}
							
						}
			}
			
			if (!document.isEmpty() || !attach.isEmpty()){
			// Descrizione
				org.w3c.dom.Element descrizione = doc.createElement("Descrizione");
				rootElement.appendChild(descrizione);
				
				if (!document.isEmpty()){
					String documentName = nodeService.getProperty(document.get(0).getTargetRef(), ContentModel.PROP_NAME).toString();
					//Numero Pagine se Necessario
					
					// Documento
					org.w3c.dom.Element documento = doc.createElement("Documento");
					descrizione.appendChild(documento);
					
					Attr attr6 = doc.createAttribute("nome");
					attr6.setValue(documentName);
					documento.setAttributeNode(attr6);
					
					Attr attr7 = doc.createAttribute("tipoRiferimento");
					attr7.setValue(tipoRiferimento);
					documento.setAttributeNode(attr7);
					
//					// Oggetto
//					org.w3c.dom.Element oggettoDoc = doc.createElement("Oggetto"); //Da Valorizzare
//					descrizione.appendChild(oggettoDoc);
//					
//					// Num Pag Doc
//					org.w3c.dom.Element numPagDoc = doc.createElement("NumeroPagine"); //Da Valorizzare
//					descrizione.appendChild(numPagDoc);
				}
				
				if (!attach.isEmpty()){

					// Allegati
					org.w3c.dom.Element allegati = doc.createElement("Allegati");
					descrizione.appendChild(allegati);
					
					for (Iterator<AssociationRef> iterator = attach.iterator(); iterator.hasNext();) {
						AssociationRef associationRef = iterator.next();
						
						String documentName = nodeService.getProperty(associationRef.getTargetRef(), ContentModel.PROP_NAME).toString();
						//Numero Pagine se Necessario
						
						// Documento
						org.w3c.dom.Element documento = doc.createElement("Documento");
						allegati.appendChild(documento);
						
						Attr attr8 = doc.createAttribute("nome");
						attr8.setValue(documentName);
						documento.setAttributeNode(attr8);
						
						Attr attr9 = doc.createAttribute("tipoRiferimento");
						attr9.setValue(tipoRiferimento);
						documento.setAttributeNode(attr9);
						
//						// TipoDocumento
//						org.w3c.dom.Element oggettoDoc = doc.createElement("TipoDocumento"); //Da Valorizzare
//						allegati.appendChild(oggettoDoc);
//						
//						// Oggetto
//						org.w3c.dom.Element oggettoDoc = doc.createElement("Oggetto"); //Da Valorizzare
//						allegati.appendChild(oggettoDoc);
//						
//						// Num Pag Doc
//						org.w3c.dom.Element numPagDoc = doc.createElement("NumeroPagine"); //Da Valorizzare
//						allegati.appendChild(numPagDoc);
					}
				}
			
			}
								
			// write the content into xml file
			TransformerFactory transformerFactory = TransformerFactory.newInstance();
			Transformer transformer = transformerFactory.newTransformer();
			transformer.setOutputProperty(OutputKeys.ENCODING, "ISO-8859-1");
			transformer.setOutputProperty(OutputKeys.INDENT, "yes");
			transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "3");
			transformer.setOutputProperty(OutputKeys.DOCTYPE_SYSTEM, "Segnatura.dtd");

			DOMSource source = new DOMSource(doc);
			StreamResult result = new StreamResult(os);
	 
			transformer.transform(source, result);
	 
		  } catch (ParserConfigurationException pce) {
			pce.printStackTrace();
		  } catch (TransformerException tfe) {
			tfe.printStackTrace();
		  }
		
		AuditService.auditPrintXmlSignature(noderef);
		
		logger.debug("Succesfull generated XML signature for protocol [" + protocolNumber + "]");
	}
	
	
	//PRIVATE METHOD
	/**
	 * Add a header to table for protocol registry report
	 */
	private static PdfPTable createTableHeader() {
		PdfPTable table = null;
		PdfPCell c1;
		table = new PdfPTable(RegModel.HEADER_TABLE.size());
		
		table.setTotalWidth(PageSize.A4.rotate().getWidth()); //Celle non divise dalla pagina
		table.setLockedWidth(true);
		
		Font courierPlainFont = FontFactory.getFont(FontFactory.COURIER, 9, Font.BOLD, BaseColor.BLACK);
		
		for (String header : RegModel.HEADER_TABLE) {
			c1 = new PdfPCell(new Phrase(header, courierPlainFont));
			c1.setHorizontalAlignment(Element.ALIGN_CENTER);
			c1.setBorderColor(BaseColor.GRAY);
			c1.setBackgroundColor(BaseColor.LIGHT_GRAY);
			table.addCell(c1);
		}
		return table;
	}
	
	private static void addInfoToProtocolRegistry(PdfPTable table, NodeRef nodeRef) {
		NodeService nodeService = FormezModel.getServiceRegistry().getNodeService();
		Map<QName, Serializable> props = new HashMap<QName, Serializable>(nodeService.getProperties(nodeRef));
		
		PdfPCell c1;
		Font courierPlainFont = FontFactory.getFont(FontFactory.COURIER, 7, Font.NORMAL, BaseColor.BLACK);
		
		// protocol number
		String protocolNum = props.get(RegModel.PROP_PROTOCOL_NUMBER).toString();
		c1 = new PdfPCell(new Phrase(protocolNum, courierPlainFont));
		c1.setHorizontalAlignment(Element.ALIGN_CENTER);
		table.addCell(c1);
		
		SimpleDateFormat dateFormat = new SimpleDateFormat(DEFAULT_DATE_PATTERN);
		
		// protocol date
		Date protocolDate = (Date) props.get(RegModel.PROP_PROTOCOL_DATE);
		c1 = new PdfPCell(new Phrase(protocolDate != null ? dateFormat.format(protocolDate) : "", courierPlainFont));
		c1.setHorizontalAlignment(Element.ALIGN_CENTER);
		table.addCell(c1);
		
		// direction type
		String directionType = props.get(RegModel.PROP_PROTOCOL_DIRECTION_TYPE).toString();
		if(directionType.equals(RegModel.REG_DIRECTION_SENT)){
			directionType = "In Uscita";
		} else if(directionType.equals(RegModel.REG_DIRECTION_RECEIVED)){
			directionType = "In Entrata";
		} else {
			directionType = "Interno";
		}
		c1 = new PdfPCell(new Phrase(directionType, courierPlainFont));
		c1.setHorizontalAlignment(Element.ALIGN_CENTER);
		table.addCell(c1);
		
		// status
		String status = props.get(RegModel.PROP_PROTOCOL_STATUS).toString();
		c1 = new PdfPCell(new Phrase(status, courierPlainFont));
		c1.setHorizontalAlignment(Element.ALIGN_CENTER);
		table.addCell(c1);
		
		// delivery mode
		String deliveryMode = props.get(RegModel.PROP_PROTOCOL_DELIVERY_MODE).toString();
		c1 = new PdfPCell(new Phrase(deliveryMode, courierPlainFont));
		c1.setHorizontalAlignment(Element.ALIGN_CENTER);
		table.addCell(c1);

		// subject
		String subject = props.get(RegModel.PROP_PROTOCOL_SUBJECT).toString();
		c1 = new PdfPCell(new Phrase(subject, courierPlainFont));
		c1.setHorizontalAlignment(Element.ALIGN_CENTER);
		table.addCell(c1);
		
		// filing
		String classification = getClassification(nodeRef);
		c1 = new PdfPCell(new Phrase(classification, courierPlainFont));
		c1.setHorizontalAlignment(Element.ALIGN_CENTER);
		table.addCell(c1);
		
		// senders
		List<AssociationRef> senders = nodeService.getTargetAssocs(nodeRef, RegModel.ASSOC_PROTOCOL_SENDERS);
		String sendersDescription = "";
		int i = 0;
		for (AssociationRef associationRef : senders) {
			i++;
			Map<QName, Serializable> senderProps = new HashMap<QName, Serializable>(nodeService.getProperties(associationRef.getTargetRef()));
			
			String name = senderProps.get(RegModel.PROP_ADDRESS_BOOK_NAME).toString();
			
			sendersDescription += name;
			if (i < senders.size()) {
				sendersDescription += "- ";
			}
		}
		
		c1 = new PdfPCell(new Phrase(sendersDescription, courierPlainFont));
		c1.setHorizontalAlignment(Element.ALIGN_CENTER);
		table.addCell(c1);
		
		// receivers
		List<AssociationRef> receivers = nodeService.getTargetAssocs(nodeRef, RegModel.ASSOC_PROTOCOL_RECEIVERS);
		String receiversDescription = "";
		int k = 0;
		for (AssociationRef associationRef : receivers) {
			k++;
			Map<QName, Serializable> receiversProps = new HashMap<QName, Serializable>(nodeService.getProperties(associationRef.getTargetRef()));
			
			String name = receiversProps.get(RegModel.PROP_ADDRESS_BOOK_NAME).toString();
			
			receiversDescription += name;
			if (k < receivers.size()) {
				receiversDescription += "- ";
			}
		}
		
		c1 = new PdfPCell(new Phrase(receiversDescription, courierPlainFont));
		c1.setHorizontalAlignment(Element.ALIGN_CENTER);
		table.addCell(c1);
		
		// document date
		Date docDate = (Date) props.get(RegModel.PROP_PROTOCOL_DOCUMENT_DATE);
		c1 = new PdfPCell(new Phrase(docDate != null ? dateFormat.format(docDate) : "", courierPlainFont));
		c1.setHorizontalAlignment(Element.ALIGN_CENTER);
		table.addCell(c1);
		
		// protocol doc number
		String protocolDocNumber = "";
		Object prDocNumber = props.get(RegModel.PROP_PROTOCOL_DOCUMENT_PROTOCOL_NUMBER);
		if (prDocNumber != null) {
			protocolDocNumber = prDocNumber.toString();
		}
		// String protocolDocNumber =
		// props.get(RegModel.PROP_PROTOCOL_DOCUMENT_PROTOCOL_NUMBER).toString();
		c1 = new PdfPCell(new Phrase(protocolDocNumber, courierPlainFont));
		c1.setHorizontalAlignment(Element.ALIGN_CENTER);
		table.addCell(c1);
		
		// emergency reg number
		String regEmergencyNumber = "";
		Object regEmerNumber = props.get(RegModel.PROP_PROTOCOL_REG_EMERGENCY_NUMBER);
		if (regEmerNumber != null) {
			regEmergencyNumber = regEmerNumber.toString();
		}
		// String regEmergencyNumber =
		// props.get(RegModel.PROP_PROTOCOL_REG_EMERGENCY_NUMBER).toString();
		c1 = new PdfPCell(new Phrase(regEmergencyNumber, courierPlainFont));
		c1.setHorizontalAlignment(Element.ALIGN_CENTER);
		table.addCell(c1);
		
		// emergency reg date
		Date emergencyRegDate = (Date) props.get(RegModel.PROP_PROTOCOL_REG_EMERGENCY_DATE);
		c1 = new PdfPCell(new Phrase(emergencyRegDate != null ? dateFormat.format(emergencyRegDate) : "", courierPlainFont));
		c1.setHorizontalAlignment(Element.ALIGN_CENTER);
		table.addCell(c1);
		
	}
	
	private static PdfWriter absText(PdfWriter writer, String text, int x, int y) {
		try {
			PdfContentByte cb = writer.getDirectContent();
			BaseFont bf = BaseFont.createFont(BaseFont.COURIER, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
			cb.saveState();
			cb.beginText();
			cb.moveText(x, y);
			cb.setFontAndSize(bf, 6);
			cb.showText(text);
			cb.endText();
			cb.restoreState();
		} catch (DocumentException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		return writer;
	}
	
	/**
	 * class for page footer event
	 */
	static class PageNumberFooter extends PdfPageEventHelper {
		
		@Override
		public void onEndPage(PdfWriter pdfWriter, Document document) {
			Rectangle rect = pdfWriter.getBoxSize("art");
			
			ColumnText.showTextAligned(pdfWriter.getDirectContent(),
					Element.ALIGN_LEFT, new Phrase(String.format("Pag. %d", pdfWriter.getPageNumber())),
					(rect.getLeft() + rect.getRight()) / 2, rect.getBottom() - 40, 0);
		}

	}
}
