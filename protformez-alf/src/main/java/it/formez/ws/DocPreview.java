package it.formez.formez.ws;

import it.formez.model.FormezModel;


import java.io.IOException;

import org.alfresco.model.ContentModel;
import org.alfresco.repo.content.MimetypeMap;
import org.alfresco.repo.web.scripts.content.StreamContent;
import org.alfresco.service.ServiceRegistry;
import org.alfresco.service.cmr.repository.ContentReader;
import org.alfresco.service.cmr.repository.ContentService;
import org.alfresco.service.cmr.repository.NodeRef;
import org.apache.commons.io.IOUtils;
import org.springframework.extensions.webscripts.WebScriptRequest;
import org.springframework.extensions.webscripts.WebScriptResponse;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Font;
import com.itextpdf.text.Font.FontFamily;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import java.io.FileInputStream;
import java.io.InputStream;


public class DocPreview extends StreamContent {

	/**
	 * @see org.alfresco.repo.web.scripts.content.StreamContent#execute(org.springframework.extensions.webscripts.WebScriptRequest, org.springframework.extensions.webscripts.WebScriptResponse)
	 */
	@Override
	public void execute(WebScriptRequest req, WebScriptResponse res) throws IOException {
		NodeRef node = new NodeRef(req.getParameter("noderef"));
		ServiceRegistry serviceRegistry = FormezModel.getServiceRegistry();
		ContentService contentService = serviceRegistry.getContentService();
		
		String name = serviceRegistry.getNodeService().getProperty(node, ContentModel.PROP_NAME).toString(); 
		res.setContentType(MimetypeMap.MIMETYPE_PDF);
		res.setHeader("Content-Disposition", "attachment; filename=\""+name+"\"");
		
		ContentReader reader = contentService.getReader(node, ContentModel.PROP_CONTENT);
		
		try {
			InputStream is = new FileInputStream("");
			IOUtils.copy(is, res.getOutputStream());
		} catch (Exception e) {
	        try {
	        	Document document = new Document();
				PdfWriter.getInstance(document, res.getOutputStream());
				document.open();
		        document.add(new Paragraph("Anteprima non disponibile per questo tipo di documento!", new Font(FontFamily.HELVETICA, 20, Font.BOLD)));
		        document.close();
			} catch (DocumentException e1) {
				e.printStackTrace();
			}
		}
	}
}
