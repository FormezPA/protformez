package it.formez.formez.service;

import it.formez.model.FormezModel;
import it.formez.reg.model.RegModel;

import java.io.Serializable;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.alfresco.model.ContentModel;
import org.alfresco.repo.site.SiteModel;
import org.alfresco.service.ServiceRegistry;
import org.alfresco.service.cmr.model.FileInfo;
import org.alfresco.service.cmr.repository.AssociationRef;
import org.alfresco.service.cmr.repository.ChildAssociationRef;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.namespace.QName;


public class SecurityService {
	
	public static final String CAN_ADMIN = "canAdmin";
	public static final String CAN_PROTOCOL_READ_IN = "canProtocolReadEnt";
	public static final String CAN_PROTOCOL_READ_OUT = "canProtocolReadUsc";
	public static final String CAN_PROTOCOL_READ_INT = "canProtocolReadIn";
	public static final String CAN_PROTOCOL_CREATE_IN = "canProtocolCreateEnt";
	public static final String CAN_PROTOCOL_CREATE_OUT = "canProtocolCreateUsc";
	public static final String CAN_PROTOCOL_CREATE_INT = "canProtocolCreateIn";
	public static final String CAN_PROTOCOL_EDIT = "canProtocolEdit";
	public static final String CAN_PROTOCOL_CANCEL = "canProtocolCancel";
	public static final String CAN_PROTOCOL_PRENOTATION = "canProtocolPrenotation";
	public static final String CAN_PROTOCOL_REPORT = "canProtocolReport";
	public static final String CAN_PROTOCOL_AUDIT = "canProtocolAudit";
	public static final String CAN_TITOLARIO = "canTitolario";
	public static final String CAN_FASCICOLI = "canFascicoli";
	
	private SecurityService(){}
	
	// retrieve permission for current user
	public static Map<String, Boolean> getPermissions(String site){
		return getPermissions(FormezModel.getServiceRegistry().getAuthenticationService().getCurrentUserName(), site);
	}
	
	// retrieve permission by user
	public static Map<String, Boolean> getPermissions(String user, String site){
		ServiceRegistry serviceRegistry = FormezModel.getServiceRegistry();
		// creo la lista di permessi vuota
		Map<String, Boolean> perms = createEmptyPermissions();
		// caso particolare: se è un amministratore di alfresco, ha tutti i permessi
		if(serviceRegistry.getAuthorityService().isAdminAuthority(user)){
			for (String perm : perms.keySet()) {
				perms.put(perm, true);
			}
			return perms;
		}
		// recupero l'uo di appartenenza dell'utente
		NodeRef uo = getUo(user, site);
		// recupero i ruoli associati all'uo
		List<AssociationRef> roles = serviceRegistry.getNodeService().getTargetAssocs(uo, FormezModel.ASSOC_ORG_ROLES);
		// controllo se è attiva l'ereditarietà dei permessi dagli uo sottostanti
		Boolean inherit = (Boolean) serviceRegistry.getNodeService().getProperty(uo, FormezModel.PROP_UO_INHERIT);
		if(inherit){
			addRolesFromSubUo(uo, roles);
		}
		// per ogni ruolo setto i permessi del ruolo
		for (AssociationRef roleRef : roles) {
			NodeRef role = roleRef.getTargetRef();
			Map<QName, Serializable> roleProps = serviceRegistry.getNodeService().getProperties(role);
			for (QName propQ : roleProps.keySet()) {
				if(propQ.getNamespaceURI().equals(FormezModel.URI_ORG)){
					String prop = propQ.getLocalName();
					perms.put(prop, perms.get(prop) || (Boolean)roleProps.get(propQ)); 
				}
			}
		}
		return perms;
	}
	
	// get if current user has overall site titolario visibility
	public static boolean canSeeAllTitolario(String site){
		return canSeeAllTitolario(FormezModel.getServiceRegistry().getAuthenticationService().getCurrentUserName(), site);
	}
	
	// get if user has overall site titolario visibility
	public static boolean canSeeAllTitolario(String user, String site){
		ServiceRegistry serviceRegistry = FormezModel.getServiceRegistry();
		// caso particolare: se è un amministratore di alfresco, può vedere tutto
		if(serviceRegistry.getAuthorityService().isAdminAuthority(user)){
			return true;
		}
		NodeRef uo = getUo(user, site);
		// recupero la proprietà che indica se posso vedere tutto il titolario
		Boolean alltits = (Boolean) serviceRegistry.getNodeService().getProperty(uo, FormezModel.PROP_UO_ALL_TITS);
		if(alltits){
			return alltits;
		} else {
			Boolean inherit = (Boolean) serviceRegistry.getNodeService().getProperty(uo, FormezModel.PROP_UO_INHERIT);
			if(inherit){
				// se sto ereditando da sottounità, controllo se qualche sottounità ha la proprietà all_tits attiva
				return checkAlltitsFromSubUo(uo);
			} else {
				return alltits;
			}
		}
	}
	
	// get children by tits assocs
	public static NodeRef[] getChildren(NodeRef parent){
		return getChildren(FormezModel.getServiceRegistry().getAuthenticationService().getCurrentUserName(), parent);
	}
	
	// get children by tits assocs for current user
	public static NodeRef[] getChildren(String user, NodeRef parent){
		ServiceRegistry serviceRegistry = FormezModel.getServiceRegistry();
		String site = serviceRegistry.getSiteService().getSite(parent).getShortName();
		// recupero l'uo di appartenenza dell'utente
		NodeRef uo = getUo(user, site);
		// creo la lista che conterrà i figli su cui ho il permesso
		Set<NodeRef> okChildren = new HashSet<NodeRef>();
		// recupero i ruoli associati all'uo
		List<AssociationRef> titsAssocs = serviceRegistry.getNodeService().getTargetAssocs(uo, FormezModel.ASSOC_ORG_TITS);
		// controllo se è attiva l'ereditarietà dei permessi dagli uo sottostanti
		Boolean inherit = (Boolean) serviceRegistry.getNodeService().getProperty(uo, FormezModel.PROP_UO_INHERIT);
		if(inherit){
			// è attiva, aggiungo le voci di titolario dei figli
			addTitsFromSubUo(uo, titsAssocs);
		}
		if(titsAssocs.size()==0){
			return okChildren.toArray(new NodeRef[okChildren.size()]);
		}
		for (AssociationRef titAssoc : titsAssocs) {
			okChildren.addAll(getPossibleChild(parent, titAssoc.getTargetRef()));
		}
		return okChildren.toArray(new NodeRef[okChildren.size()]);
	}
	
	private static Set<NodeRef> getPossibleChild(NodeRef root, NodeRef tit) {
		ServiceRegistry serviceRegistry = FormezModel.getServiceRegistry();
		Set<NodeRef> children = new HashSet<NodeRef>();
		// controllo se tit è sopra root (o è root). in questo caso posso vedere tutti i figli di root
		NodeRef parent = root;
		boolean go = true;
		do {
			if(parent.equals(tit)){
				List<FileInfo> childrenInfo = serviceRegistry.getFileFolderService().list(root); 
				for (FileInfo childInfo : childrenInfo) {
					children.add(childInfo.getNodeRef());
				}
				return children;
			} else {
				if(serviceRegistry.getNodeService().hasAspect(parent, SiteModel.ASPECT_SITE_CONTAINER)){
					go = false;
				} else {
					parent = serviceRegistry.getNodeService().getPrimaryParent(parent).getParentRef();
				}
			}
		} while (go);
		// se tit non è sopra root, potrebbe essere sotto (e quindi devo recuperare il figlio apposito)
		NodeRef subParent = tit;
		parent = serviceRegistry.getNodeService().getPrimaryParent(tit).getParentRef();
		go = true;
		do {
			// parent e root sono uguali, allora il subparent è un children valido
			if(parent.equals(root)){
				children.add(subParent);
				return children;
			} else {
				// se ha l'aspetto st:siteContainer sono arrivato alla radice senza successo
				if(serviceRegistry.getNodeService().hasAspect(parent, SiteModel.ASPECT_SITE_CONTAINER)){
					go = false;
				} else {
					// salgo di un livello
					subParent = parent;
					parent = serviceRegistry.getNodeService().getPrimaryParent(parent).getParentRef();
				}
			}
		} while (go);
		return children; 
	}

	// get uo from user and site
	private static NodeRef getUo(String user, String site){
		ServiceRegistry serviceRegistry = FormezModel.getServiceRegistry();
		NodeRef person = serviceRegistry.getPersonService().getPerson(user);
		// recupero l'uo di appartenenza dell'utente
		NodeRef uo = null;
		List<AssociationRef> uos = serviceRegistry.getNodeService().getSourceAssocs(person, FormezModel.ASSOC_ORG_USERS);
		for (AssociationRef uoRef : uos) {
			uo = uoRef.getSourceRef();
			if(site.equals(serviceRegistry.getSiteService().getSite(uo).getShortName())){
				break;
			}
		}
		return uo;
	}
	
	// create an empty permissions map
	private static Map<String, Boolean> createEmptyPermissions(){
		Map<String, Boolean> perms = new HashMap<String, Boolean>();
		perms.put(CAN_ADMIN, false);
		perms.put(CAN_PROTOCOL_READ_IN, false);
		perms.put(CAN_PROTOCOL_READ_OUT, false);
		perms.put(CAN_PROTOCOL_READ_INT, false);
		perms.put(CAN_PROTOCOL_CREATE_IN, false);
		perms.put(CAN_PROTOCOL_CREATE_OUT, false);
		perms.put(CAN_PROTOCOL_CREATE_INT, false);
		perms.put(CAN_PROTOCOL_EDIT, false);
		perms.put(CAN_PROTOCOL_CANCEL, false);
		perms.put(CAN_PROTOCOL_PRENOTATION, false);
		perms.put(CAN_PROTOCOL_REPORT, false);
		perms.put(CAN_PROTOCOL_AUDIT, false);
		perms.put(CAN_TITOLARIO, false);
		perms.put(CAN_FASCICOLI, false);
		return perms;
	}
	
	// get roles from all sub uo
	private static void addRolesFromSubUo(NodeRef uo, List<AssociationRef> roles) {
		ServiceRegistry serviceRegistry = FormezModel.getServiceRegistry();
		List<FileInfo> children = serviceRegistry.getFileFolderService().listFolders(uo);
		for (FileInfo child : children) {
			roles.addAll(serviceRegistry.getNodeService().getTargetAssocs(child.getNodeRef(), FormezModel.ASSOC_ORG_ROLES));
			addRolesFromSubUo(child.getNodeRef(), roles);
		}
	}
	
	// get tits from all sub uo
	private static void addTitsFromSubUo(NodeRef uo, List<AssociationRef> tits) {
		ServiceRegistry serviceRegistry = FormezModel.getServiceRegistry();
		List<FileInfo> children = serviceRegistry.getFileFolderService().listFolders(uo);
		for (FileInfo child : children) {
			tits.addAll(serviceRegistry.getNodeService().getTargetAssocs(child.getNodeRef(), FormezModel.ASSOC_ORG_TITS));
			addTitsFromSubUo(child.getNodeRef(), tits);
		}
	}
	
	// check if sub uo has prop all_tits active
	private static boolean checkAlltitsFromSubUo(NodeRef uo){
		ServiceRegistry serviceRegistry = FormezModel.getServiceRegistry();
		List<FileInfo> children = serviceRegistry.getFileFolderService().listFolders(uo);
		if(children.size()>0){
			boolean can = false;
			for (FileInfo child : children) {
				Boolean alltits = (Boolean) serviceRegistry.getNodeService().getProperty(child.getNodeRef(), FormezModel.PROP_UO_ALL_TITS);
				if(alltits){
					can = alltits;
					break;
				} else {
					can = can || checkAlltitsFromSubUo(child.getNodeRef());
				}
			}
			return can;
		} else {
			return false;
		}
	}
	
	// check if current user has visibility for this node, based on titolario permission 
	public static boolean canUserSeeTitolarioNode(NodeRef node){
		ServiceRegistry serviceRegistry = FormezModel.getServiceRegistry();
		String site = serviceRegistry.getSiteService().getSite(node).getShortName();
		String user = FormezModel.getServiceRegistry().getAuthenticationService().getCurrentUserName();
		// recupero l'uo di appartenenza dell'utente
		NodeRef uo = getUo(user, site);
		if(serviceRegistry.getAuthorityService().isAdminAuthority(user)){
			return true;
		}
		// recupero i titoli associati all'uo
		List<AssociationRef> titsAssocs = serviceRegistry.getNodeService().getTargetAssocs(uo, FormezModel.ASSOC_ORG_TITS);
		//creo un set di titoli/permessi associati all'uo 
		Set<NodeRef> setTitsAssoc = new HashSet<>();
		for (Iterator iterator = titsAssocs.iterator(); iterator.hasNext();) {
			AssociationRef associationRef = (AssociationRef) iterator.next();
			setTitsAssoc.add(associationRef.getTargetRef());
		}
		//controllo i permessi dal basso verso l'alto
		List<ChildAssociationRef> listParent = serviceRegistry.getNodeService().getParentAssocs(node);
		for (Iterator iterator = listParent.iterator(); iterator.hasNext();) {
			ChildAssociationRef childAssociationRef = (ChildAssociationRef) iterator
					.next();
			NodeRef parent = childAssociationRef.getParentRef();
			NodeRef subParent = node;
			if(serviceRegistry.getNodeService().getType(parent).isMatch(RegModel.TYPE_TIT_FASCICOLO)){
				boolean go = true;
				do {
					// se parent è presente nel set allora user ha visibilità sul nodo
					if(setTitsAssoc.contains(parent)){
						return true;
					} else {
						// se è di tipo basefolder siamo alla radice del titolario
						if(serviceRegistry.getNodeService().getType(parent).isMatch(RegModel.TYPE_TIT_BASEFOLDER)){
							go = false;
						} else {
							// level up
							subParent = parent;
							parent = serviceRegistry.getNodeService().getPrimaryParent(parent).getParentRef();
						}
					}
				} while (go);
			}
		}
		return false;
	}


}
