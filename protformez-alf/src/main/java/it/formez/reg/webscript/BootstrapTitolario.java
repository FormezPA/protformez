package it.formez.reg.webscript;

import it.formez.model.FormezModel;
import it.formez.reg.model.RegModel;
import it.formez.reg.service.AuditService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.alfresco.model.ContentModel;
import org.alfresco.service.ServiceRegistry;
import org.alfresco.service.cmr.model.FileFolderService;
import org.alfresco.service.cmr.model.FileInfo;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.cmr.site.SiteService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.extensions.webscripts.Cache;
import org.springframework.extensions.webscripts.DeclarativeWebScript;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.WebScriptRequest;

public class BootstrapTitolario  extends DeclarativeWebScript {
	
	private static Log logger = LogFactory.getLog(BootstrapTitolario.class);
    
    public Map<String, Object> executeImpl(WebScriptRequest req, Status status, Cache cache) {
    	
    	ServiceRegistry serviceRegistry = FormezModel.getServiceRegistry();
    	SiteService siteService = serviceRegistry.getSiteService();
    	FileFolderService fileFolderService = serviceRegistry.getFileFolderService();
    	NodeService nodeService = serviceRegistry.getNodeService();
    	        
        String siteName = req.getParameter("site");
        
        // resolve documentLibrary (Titolario) container
        NodeRef titolario = siteService.getContainer(siteName, FormezModel.CONTAINER_DOCLIB);
        // creo il titolario di default
        NodeRef docLib = siteService.getContainer(siteName, FormezModel.CONTAINER_DOCLIB);
        
        int counterTitolo = (Integer) nodeService.getProperty(docLib, RegModel.PROP_TIT_COUNTER_TITOLO);
		int counterClasse = (Integer) nodeService.getProperty(docLib, RegModel.PROP_TIT_COUNTER_CLASSE);
		int counterFascicolo = (Integer) nodeService.getProperty(docLib, RegModel.PROP_TIT_COUNTER_FASCICOLO);

        Map<String, String[]> map = getTitolarioMap();
        for (String titoloName : map.keySet()) {
        	counterTitolo++;
        	// creo il titolo
        	String[] titoloSplit = titoloName.split(" - ");
        	FileInfo titolo = fileFolderService.create(titolario, titoloName, RegModel.TYPE_TIT_TITOLO);
        	nodeService.setProperty(titolo.getNodeRef(), RegModel.PROP_TITOLO_PRESENZA_FASCICOLI, "Si");
            nodeService.setProperty(titolo.getNodeRef(), RegModel.PROP_TITOLO_NUMERO, titoloSplit[0]);
            nodeService.setProperty(titolo.getNodeRef(), ContentModel.PROP_DESCRIPTION, titoloSplit[1]);
            nodeService.setProperty(titolo.getNodeRef(), RegModel.PROP_BASEFOLDER_NUMBER, counterTitolo);
            // audit creazione titolo
            AuditService.createTit(titolo.getNodeRef());
            logger.debug("Creato titolo: " + titoloName);
            // prendo le classi
            String[] classiNames = map.get(titoloName);
            for (String classeName : classiNames) {
            	// creo le classi
            	counterClasse++;
            	String[] classeSplit = classeName.split(" - ");
				FileInfo classe = fileFolderService.create(titolo.getNodeRef(), classeName, RegModel.TYPE_TIT_CLASSE);
				nodeService.setProperty(classe.getNodeRef(), RegModel.PROP_CLASSE_NUMERO, classeSplit[0]);
				nodeService.setProperty(classe.getNodeRef(), ContentModel.PROP_DESCRIPTION, classeSplit[1]);
				nodeService.setProperty(classe.getNodeRef(), RegModel.PROP_BASEFOLDER_NUMBER, counterClasse);
				logger.debug("Creata classe: " + classeName);
				// audit creazione classe
	            AuditService.createTit(classe.getNodeRef());
				// creo un fascicolo temporaneo in ogni classe
	            counterFascicolo++;
				FileInfo fascicolo = fileFolderService.create(classe.getNodeRef(), "Fascicolo temporaneo", RegModel.TYPE_TIT_FASCICOLO);
				nodeService.setProperty(fascicolo.getNodeRef(), RegModel.PROP_FASCICOLO_NUMERO, "1");
				nodeService.setProperty(fascicolo.getNodeRef(), RegModel.PROP_BASEFOLDER_NUMBER, counterFascicolo);
				logger.debug("Creato fascicolo: Fascicolo temporaneo");
				// audit creazione fascicolo
	            AuditService.createTit(fascicolo.getNodeRef());
			}
		}
        
        nodeService.setProperty(docLib, RegModel.PROP_TIT_COUNTER_TITOLO, counterTitolo);
        nodeService.setProperty(docLib, RegModel.PROP_TIT_COUNTER_CLASSE, counterClasse);
        nodeService.setProperty(docLib, RegModel.PROP_TIT_COUNTER_FASCICOLO, counterFascicolo);
        
        Map<String, Object> model = new HashMap<String, Object>();
    	model.put("success", true);
    	
        return model;
    }
    
    private Map<String, String[]> getTitolarioMap(){
    	Map<String, String[]> map = new HashMap<String, String[]>();
    	// titolo 1    	
		map.put("I - Amministrazione generale", new String[]{
			"1 - Legislazione e circolari esplicative",
			"2 - Denominazione, territorio e confini, circoscrizioni di decentramento, toponomastica",
			"3 - Statuto",
			"4 - Regolamenti",
			"5 - Stemma, gonfalone, sigillo",
			"6 - Archivio generale",
			"7 - Sistema informativo",
			"8 - Informazioni e relazioni con il pubblico",
			"9 - Politica del personale; ordinamento degli uffici e dei servizi",
			"10 - Relazioni con le organizzazioni sindacali e di rappresentanza del personale",
			"11 - Controlli interni ed esterni",
			"12 - Editoria e attivita' informativo-promozionale interna ed esterna",
			"13 - Cerimoniale, attivita' di rappresentanza; onorificenze e riconoscimenti",
			"14 - Interventi di carattere politico e umanitario; rapporti istituzionali",
			"15 - Forme associative e partecipative per l'esercizio di funzioni e servizi e adesione del Comune ad Associazioni",
			"16 - Area e citta' metropolitana",
			"17 - Associazionismo e partecipazione"
		});
		// titolo 2
		map.put("II - Organi di governo, gestione, controllo, consulenza e garanzia", new String[]{
			"1 - Sindaco",
			"2 - Vice-Sindaco",
			"3 - Consiglio",
			"4 - Presidente del Consiglio",
			"5 - Conferenza dei capigruppo e Commissioni del Consiglio",
			"6 - Gruppi consiliari",
			"7 - Giunta",
			"8 - Commissario prefettizio e straordinario",
			"9 - Segretario e Vice-segretario",
			"10 - Direttore generale e dirigenza",
			"11 - Revisori dei conti",
			"12 - Difensore civico",
			"13 - Commissario ad acta",
			"14 - Organi di controllo interni",
			"15 - Organi consultivi",
			"16 - Consigli circoscrizionali",
			"17 - Presidente dei Consigli circoscrizionali",
			"18 - Organi esecutivi circoscrizionali",
			"19 - Commissioni dei Consigli circoscrizionali",
			"20 - Segretari delle circoscrizioni",
			"21 - Commissario ad acta delle circoscrizioni",
			"22 - Conferenza dei Presidenti di quartiere"
		});
		// titolo 3
		map.put("III - Risorse umane", new String[]{
			"1 - Concorsi, selezioni, colloqui",
			"2 - Assunzioni e cessazioni",
			"3 - Comandi e distacchi; mobilita'",
			"4 - Attribuzione di funzioni, ordini di servizio e missioni",
			"5 - Inquadramenti e applicazione contratti collettivi di lavoro",
			"6 - Retribuzioni e compensi",
			"7 - Trattamento fiscale, contributivo e assicurativo",
			"8 - Tutela della salute e sicurezza sul luogo di lavoro", 
			"9 - Dichiarazioni di infermita' ed equo indennizzo",
			"10 - Indennita' premio di servizio e trattamento di fine rapporto, quiescenza",
			"11 - Servizi al personale su richiesta",
			"12 - Orario di lavoro, presenze e assenze",
			"13 - Giudizi, responsabilita' e provvedimenti disciplinari",
			"14 - Formazione e aggiornamento professionale",
			"15 - Collaboratori esterni"
		});
		// titolo 4
		map.put("IV - Risorse finanziarie e patrimonio", new String[]{
			"1 - Bilancio preventivo e Piano esecutivo di gestione (PEG)",
			"2 - Gestione del bilancio e del PEG (con eventuali variazioni)",
			"3 - Gestione delle entrate; accertamento, riscossione, versamento",
			"4 - Gestione della spesa; impegno, liquidazione, ordinazione e pagamento",
			"5 - Partecipazioni finanziarie",
			"6 - Rendiconto della gestione; adempimenti e verifiche contabili",
			"7 - Adempimenti fiscali, contributivi e assicurativi",
			"8 - Beni immobili",
			"9 - Beni mobili",
			"10 - Economato",
			"11 - Oggetti smarriti e recuperati",
			"12 - Tesoreria",
			"13 - Concessionari ed altri incaricati della riscossione delle entrate",
			"14 - Pubblicita' e pubbliche affissioni"
		});
		// titolo 5
		map.put("V - Affari legali", new String[]{
			"1 - Contenzioso",
			"2 - Responsabilita' civile e patrimoniale verso terzi; assicurazioni",
			"3 - Pareri e consulenze"
		});
		// titolo 6
		map.put("VI - Pianificazione e gestione del territorio", new String[]{
			"1 - Urbanistica; piano regolatore generale e varianti",
			"2 - Urbanistica; strumenti di attuazione del piano regolatore generale",
			"3 - Edilizia privata",
			"4 - Edilizia pubblica",
			"5 - Opere pubbliche",
			"6 - Catasto",
			"7 - Viabilita'",
			"8 - Servizio idrico integrato, luce, gas, trasporti pubblici, gestione dei rifiuti e altri servizi",
			"9 - Ambiente; autorizzazioni, monitoraggio e controllo",
			"10 - Protezione civile ed emergenze"
		});
		// titolo 7
		map.put("VII - Servizi alla persona", new String[]{
			"1 - Diritto allo studio e servizi",
			"2 - Asili nido e scuola materna",
			"3 - Promozione e sostegno delle istituzioni di istruzione e della loro attivita'",
			"4 - Orientamento professionale; educazione degli adulti; mediazione culturale",
			"5 - Istituti culturali (Musei, Biblioteche, Teatri, Scuola comunale di musica, etc.)",
			"6 - Attivita' ed eventi culturali",
			"7 - Attivita' ed eventi sportivi",
			"8 - Pianificazione e accordi strategici con enti pubblici e privati e con il volontariato sociale",
			"9 - Prevenzione, recupero e reintegrazione dei soggetti a rischio",
			"10 - Informazione, consulenza ed educazione civica",
			"11 - Tutela e curatela di incapaci",
			"12 - Assistenza diretta e indiretta, benefici economici",
			"13 - Attivita' ricreativa e di socializzazione",
			"14 - Politiche per la casa",
			"15 - Politiche per il sociale"
		});
		// titolo 8
		map.put("VIII - Attivita' economiche", new String[]{
			"1 - Agricoltura e pesca",
			"2 - Artigianato",
			"3 - Industria",
			"4 - Commercio",
			"5 - Fiere e mercati",
			"6 - Esercizi turistici e strutture ricettive",
			"7 - Promozione e servizi"
		});
		// titolo 9
		map.put("IX - Polizia locale e sicurezza pubblica", new String[]{
			"1 - Prevenzione ed educazione stradale",
			"2 - Polizia stradale",
			"3 - Informative",
			"4 - Sicurezza e ordine pubblico"
		});
		// titolo 10
		map.put("X - Tutela della salute", new String[]{
			"1 - Salute e igiene pubblica",
			"2 - Trattamento Sanitario Obbligatorio",
			"3 - Farmacie",
			"4 - Zooprofilassi veterinaria",
			"5 - Randagismo animale e ricoveri"
		});
		// titolo 11
		map.put("XI - Servizi demografici", new String[]{
			"1 - Stato civile",
			"2 - Anagrafe e certificazioni",
			"3 - Censimenti",
			"4 - Polizia mortuaria e cimiteri"
		});
		// titolo 12
		map.put("XII - Elezioni ed iniziative popolari", new String[]{
			"1 - Albi elettorali",
			"2 - Liste elettorali",
			"3 - Elezioni",
			"4 - Referendum",
			"5 - Istanze, petizioni e iniziative popolari"
		});
		// titolo 13
		map.put("XIII - Affari militari", new String[]{
			"1 - Leva e servizio civile sostitutivo",
			"2 - Ruoli matricolari",
			"3 - Caserme, alloggi e servitu' militari",
			"4 - Requisizioni per utilita' militari"
		});
		// titolo 14
		map.put("XIV - Oggetti diversi", new String[]{});
		// titolo 15
		map.put("XV - Non classificati", new String[]{
			"1 - Temporanei"
		});
		return map ;
    }
	
}
