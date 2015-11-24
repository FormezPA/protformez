package it.formez.model;

import java.text.SimpleDateFormat;

import org.alfresco.repo.policy.PolicyComponent;
import org.alfresco.service.ServiceRegistry;
import org.alfresco.service.namespace.QName;

public class FormezModel {
	
	// Global service registry and policy component
	private static ServiceRegistry serviceRegistry;
	private static PolicyComponent policyComponent;
	// Formez Offices
	public static final String Formez_SITE_PRESET = "formez-site";
	
	// Formez site containers
	public static final String CONTAINER_ORG = "org";
	public static final String CONTAINER_ROLES = "roles";
	public static final String CONTAINER_DOCLIB = "documentLibrary";
	
	// Formez model uri
	public static final String URI_ORG = "http://www.org.it/model/org/1.0";
	public static final String URI_AE = "http://www.ae.it/model/ae/1.0";
	// Formez model prefix
	public static final String PREFIX_AE = "ae";
	
	// Formez aspects
	//Org aspects 
	public static QName ASPECT_ORG_COUNTER = QName.createQName(URI_ORG, "counters");
	// Ldi aspects
	public static QName ASPECT_AE_BASE = QName.createQName(URI_AE, "base");
	
	// Formez association
	// Org association
	public static final QName ASSOC_ORG_USERS = QName.createQName(URI_ORG, "usersAssoc");
	public static final QName ASSOC_ORG_ROLES = QName.createQName(URI_ORG, "rolesAssoc");
	public static final QName ASSOC_ORG_TITS = QName.createQName(URI_ORG, "titAssoc");
	
	// Formez Properties
	// Org Properties
	public static final QName PROP_UO_INHERIT = QName.createQName(URI_ORG, "nodeUoInherit");
	public static final QName PROP_UO_ALL_TITS = QName.createQName(URI_ORG, "nodeUoAlltits");
	public static final QName PROP_GOV_NAME = QName.createQName(URI_ORG, "govName");
	public static final QName PROP_GOV_CODE = QName.createQName(URI_ORG, "govCode");
	// Cfg properties
	public static final QName PROP_CFG_AOO_TOPONIMO = QName.createQName(null, "aooToponimo");
	public static final QName PROP_CFG_AOO_INDIRIZZO = QName.createQName(null, "aooIndirizzo");
	public static final QName PROP_CFG_AOO_CIVICO = QName.createQName(null, "aooCivico");
	public static final QName PROP_CFG_AOO_CAP = QName.createQName(null, "aooCAP");
	public static final QName PROP_CFG_AOO_COMUNE = QName.createQName(null, "aooComune");
	public static final QName PROP_CFG_AOO_PROVINCIA = QName.createQName(null, "aooProvincia");
	public static final QName PROP_CFG_AOO_EMAIL = QName.createQName(null, "aooEmail");
	public static final QName PROP_CFG_AOO_TEL = QName.createQName(null, "aooTel");
	public static final QName PROP_CFG_AOO_FAX = QName.createQName(null, "aooFax");
	
	// java date formatters
	public static SimpleDateFormat dateSimpleformatter = new SimpleDateFormat("dd/MM/yyyy");
	public static SimpleDateFormat dateFormatter = new SimpleDateFormat("dd.MMM.yyyy HH:mm:ss");
	
	/**
	 * @return the serviceRegistry
	 */
	public static ServiceRegistry getServiceRegistry() {
		return serviceRegistry;
	}

	/**
	 * @param serviceRegistry the serviceRegistry to set
	 */
	public void setServiceRegistry(ServiceRegistry serviceRegistry) {
		FormezModel.serviceRegistry = serviceRegistry;
	}
	
	/**
	 * @return the serviceRegistry
	 */
	public static PolicyComponent getPolicyComponent() {
		return policyComponent;
	}

	/**
	 * @param serviceRegistry the serviceRegistry to set
	 */
	public void setPolicyComponent(PolicyComponent policyComponent) {
		FormezModel.policyComponent = policyComponent;
	}

	private FormezModel(){}
}
