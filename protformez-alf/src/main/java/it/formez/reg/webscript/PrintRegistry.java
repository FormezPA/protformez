package it.formez.reg.webscript;

import it.formez.model.FormezModel;
import it.formez.reg.model.RegModel;
import it.formez.reg.service.DocumentService;
import it.formez.reg.service.ProtocolService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.alfresco.model.ContentModel;
import org.alfresco.repo.content.MimetypeMap;
import org.alfresco.repo.web.scripts.content.StreamContent;
import org.alfresco.service.ServiceRegistry;
import org.alfresco.service.cmr.model.FileInfo;
import org.alfresco.service.cmr.repository.ContentReader;
import org.alfresco.service.cmr.repository.ContentWriter;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.StoreRef;
import org.alfresco.service.cmr.search.ResultSet;
import org.alfresco.service.cmr.search.SearchService;
import org.apache.commons.io.IOUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.extensions.webscripts.WebScriptRequest;
import org.springframework.extensions.webscripts.WebScriptResponse;


public class PrintRegistry extends StreamContent {
	
	/** Logger */
    private static Log logger = LogFactory.getLog(PrintRegistry.class);
    
    private static final String PARAM_SITE = "site";
    private static final String PARAM_FROM = "from";
    private static final String PARAM_TO = "to";
    private static final String PARAM_SUBJECT = "subject";
    private static final String PARAM_DIRECTION = "dir";
    private static final String PARAM_STATUS = "state";
	private static final String PARAM_NUMBER = "number";
	private static final String PARAM_DAILY = "daily";
	private static final String PARAM_FILING = "filing";
    private static final String HEADER_FILE_NAME = "Registro-di-protocollo";
    private static final String FILE_EXTENSION = ".pdf";

	@Override
	public void execute(WebScriptRequest req, WebScriptResponse res) throws IOException {
		ServiceRegistry serviceRegistry = FormezModel.getServiceRegistry();
		logger.debug("Starting to print protocol registry...");
		
		res.setContentType(MimetypeMap.MIMETYPE_PDF);
		res.setHeader("Content-Disposition", "attachment; filename=\"" + HEADER_FILE_NAME + FILE_EXTENSION + "\"");
		
		List<NodeRef> noderefs = queryFromRequest(req);
		if(req.getParameter(PARAM_DAILY)!=null){
			// creo e salvo il registro giornaliero
			String site = req.getParameter(PARAM_SITE);
			NodeRef folder = ProtocolService.checkStructureFolder(serviceRegistry.getSiteService().getContainer(site, RegModel.CONTAINER_DAILY));
			String[] froms = req.getParameter(PARAM_FROM).split("/");
			String filename = froms[2] + "-" + froms[1] + "-" + froms[0] + "-" + new Date().getTime() + FILE_EXTENSION;
			FileInfo file = serviceRegistry.getFileFolderService().create(folder, filename, ContentModel.TYPE_CONTENT);
			ContentWriter writer = serviceRegistry.getContentService().getWriter(file.getNodeRef(), ContentModel.PROP_CONTENT, true);
			writer.setMimetype(MimetypeMap.MIMETYPE_PDF);
			// genero il pdf
			DocumentService.printProtocolRegistry(noderefs, writer.getContentOutputStream(), site, true, req.getParameter(PARAM_FROM));
			// ritorno il pdf
			ContentReader reader = serviceRegistry.getContentService().getReader(file.getNodeRef(), ContentModel.PROP_CONTENT);
			IOUtils.copy(reader.getContentInputStream(), res.getOutputStream());
		} else {
			// creo il registro senza salvarlo
			DocumentService.printProtocolRegistry(noderefs, res.getOutputStream(), req.getParameter(PARAM_SITE), false, null);
		}
		
		logger.debug("Generated protocol registry...");

	}
	
	private List<NodeRef> queryFromRequest(WebScriptRequest req){
		ServiceRegistry serviceRegistry = FormezModel.getServiceRegistry();
		String site = req.getParameter(PARAM_SITE);
		String from = req.getParameter(PARAM_FROM);
		String to = req.getParameter(PARAM_TO);
		String number = req.getParameter(PARAM_NUMBER);
		String subject = req.getParameter(PARAM_SUBJECT);
		String state = req.getParameter(PARAM_STATUS);
		String dir = req.getParameter(PARAM_DIRECTION);
		String filing = req.getParameter(PARAM_FILING);
		
		NodeRef container = serviceRegistry.getSiteService().getContainer(site, RegModel.CONTAINER_PROTOCOL);
		String query; 
		
		if (filing!=null && !filing.equals("")){
			
			query = "select cmis:objectId from reg:recordable where in_tree('"+filing+"') order by reg:protocolNumberRecordable desc";
			
			// execute query
			ResultSet res = serviceRegistry.getSearchService().query(StoreRef.STORE_REF_WORKSPACE_SPACESSTORE, SearchService.LANGUAGE_CMIS_ALFRESCO, query);
			List<NodeRef> docs = res.getNodeRefs();
			List<NodeRef> prot = new ArrayList<NodeRef>();
			for (NodeRef nodeRef : docs) {
				prot.add(serviceRegistry.getNodeService().getTargetAssocs(nodeRef, RegModel.ASSOC_RECORDABLE_ITEM).get(0).getTargetRef());
			}
			return prot;
			
		} else {
			
			query = "select cmis:objectId from reg:protocol where in_tree('"+container.toString()+"')";
			
			//filters
			if(state!=null && !state.equals("")){
				query += " and reg:status='"+state+"'";
			}

			if(number!=null && !number.equals("")){
				query += " and reg:protocolNumber='*"+number+"'";
			}

			if(subject!=null && !subject.equals("")){
				query += " and reg:subject='*"+subject+"*'";
			}

			if(from!=null && !from.equals("")){
				String[] froms = from.split("/");
				String fromParsed = froms[2] + "-" + froms[1] + "-" + froms[0];
				query += " and reg:protocolDate > TIMESTAMP '"+fromParsed+"T00:00:00.000Z'";
			}

			if(to!=null && !to.equals("")){
				String[] tos = to.split("/");
				String toParsed = tos[2] + "-" + tos[1] + "-" + tos[0];
				query += " and reg:protocolDate < TIMESTAMP '"+toParsed+"T23:59:00.000Z'";
			}

			if(dir!=null && !dir.equals("")){
				query += " and reg:directionType='"+dir+"'";
			}

			query += " order by reg:protocolNumber desc";
			
			// execute query
			ResultSet res = serviceRegistry.getSearchService().query(StoreRef.STORE_REF_WORKSPACE_SPACESSTORE, SearchService.LANGUAGE_CMIS_ALFRESCO, query);
			return res.getNodeRefs();
			
		}
		

	}

}
