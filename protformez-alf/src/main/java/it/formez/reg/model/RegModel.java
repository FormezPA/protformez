package it.formez.reg.model;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.alfresco.service.namespace.QName;

public class RegModel {
	
	public static SimpleDateFormat formatter = new SimpleDateFormat("dd.MMM.yyyy HH:mm:ss");
	public static final List<String> HEADER_TABLE = new ArrayList<String>(Arrays.asList("Numero", "Data", "Ricevuto/Spedito", "Stato", "Cons/recapito", "Oggetto", "Pos. Titolario", "Mittente/i", "Destinatario/i", "Data Doc.", "Protocollo Doc.", "Num. Reg. Emergenza", "Data Reg. Emergenza"));
	
	// site constants
	public static final String CONTAINER_PROTOCOL = "protocol";
	public static final String CONTAINER_ADDRESS = "addressBookLists";
	public static final String CONTAINER_AUDIT = "auditLists";
	public static final String CONTAINER_DAILY = "daily";
	
	// protocol constants
	public static final String REG_URI = "http://www.reg.it/model/reg/1.0";
    public static final String REG_PREFIX = "reg";
    public static final String REG_STATUS_PRENOTATO = "Prenotato";
    public static final String REG_STATUS_PROTOCOLLATO = "Protocollato";
    public static final String REG_DIRECTION_RECEIVED = "in";
    public static final String REG_DIRECTION_SENT = "out";
    public static final String REG_DIRECTION_INTERNO = "int";
    public static final String REG_DELIVERY_PEC = "PEC";
    public static final String REG_DELIVERY_DIRECT = "Consegna diretta";
    
	public static final QName TYPE_PROTOCOL = QName.createQName(REG_URI, "protocol");
	public static final QName ASSOC_PROTOCOL_DOCUMENT = QName.createQName(REG_URI, "protocolDocument");
	public static final QName ASSOC_PROTOCOL_FILING = QName.createQName(REG_URI, "filing");
	public static final QName ASSOC_PROTOCOL_SENDERS = QName.createQName(REG_URI, "sender");
    public static final QName ASSOC_PROTOCOL_RECEIVERS = QName.createQName(REG_URI, "receiver");
    public static final QName ASSOC_PROTOCOL_ATTACHMENTS = QName.createQName(REG_URI, "attachments");
	public static final QName PROP_PROTOCOL_NUMBER = QName.createQName(REG_URI, "protocolNumber");
    public static final QName PROP_PROTOCOL_DATE = QName.createQName(REG_URI, "protocolDate");
    public static final QName PROP_PROTOCOL_DIRECTION_TYPE = QName.createQName(REG_URI, "directionType");
    public static final QName PROP_PROTOCOL_STATUS = QName.createQName(REG_URI, "status");
	public static final QName PROP_PROTOCOL_DELIVERY_MODE = QName.createQName(REG_URI, "deliveryMode");
    public static final QName PROP_PROTOCOL_SUBJECT = QName.createQName(REG_URI, "subject");
    public static final QName PROP_PROTOCOL_DOCUMENT_DATE = QName.createQName(REG_URI, "documentDate");
    public static final QName PROP_PROTOCOL_DOCUMENT_PROTOCOL_NUMBER = QName.createQName(REG_URI, "documentProtocolNumber");
    public static final QName PROP_PROTOCOL_REG_EMERGENCY_DATE = QName.createQName(REG_URI, "emergencyProtocolDate");
    public static final QName PROP_PROTOCOL_REG_EMERGENCY_NUMBER = QName.createQName(REG_URI, "emergencyProtocolNumber");
	public static final QName PROP_PROTOCOL_HASHCODE = QName.createQName(REG_URI, "hashCode");
	public static final QName PROP_PROTOCOL_NOTES = QName.createQName(REG_URI, "notes");
	public static final QName PROP_PROTOCOL_ASSIGN_USERS = QName.createQName(REG_URI, "assignUsers");
	public static final QName PROP_PROTOCOL_ASSIGN_STATE = QName.createQName(REG_URI, "assignState");
	
	public static final QName ASPECT_RECORDABLE = QName.createQName(REG_URI, "recordable");
	public static final QName ASSOC_RECORDABLE_ITEM = QName.createQName(REG_URI, "protocolItem");
	public static final QName PROP_RECORDABLE_NUMBER = QName.createQName(REG_URI, "protocolNumberRecordable");
	
	// contatore constants
	public static final QName ASPECT_CONTATORE = QName.createQName(REG_URI, "contatore");
	public static final QName PROP_CONTATORE_COUNTER = QName.createQName(REG_URI, "counter");
	public static final QName PROP_CONTATORE_YEAR = QName.createQName(REG_URI, "year");
	public static final QName PROP_CONTATORE_PREFIX = QName.createQName(REG_URI, "prefix");
	
	// titolario constants
	public static final String TIT_URI = "http://www.reg.it/model/tit/1.0";
    public static final String TIT_PREFIX = "tit";
    public static final QName TYPE_TIT_BASEFOLDER = QName.createQName(TIT_URI, "baseFolder");
    public static final QName TYPE_TIT_TITOLO = QName.createQName(TIT_URI, "titolo");
    public static final QName TYPE_TIT_CLASSE = QName.createQName(TIT_URI, "classe");
    public static final QName TYPE_TIT_FASCICOLO = QName.createQName(TIT_URI, "fascicolo");
    public static final QName PROP_BASEFOLDER_NUMBER= QName.createQName(TIT_URI, "baseFolderNumber");
    public static final QName PROP_TITOLO_STATUS = QName.createQName(TIT_URI, "titoloStato");
    public static final QName PROP_TITOLO_NUMERO = QName.createQName(TIT_URI, "titoloNumero");
    public static final QName PROP_TITOLO_PRESENZA_FASCICOLI = QName.createQName(TIT_URI, "titoloPresenzaFascicoli");
    public static final QName PROP_CLASSE_NUMERO = QName.createQName(TIT_URI, "classeNumero");
    public static final QName PROP_FASCICOLO_STATUS = QName.createQName(TIT_URI, "fascicoloStato");
    public static final QName PROP_FASCICOLO_NUMERO = QName.createQName(TIT_URI, "fascicoloNumero");
    public static final QName PROP_FASCICOLO_CHIUSURA = QName.createQName(TIT_URI, "fascicoloDataChiusura");
	public static final QName PROP_TIT_COUNTER_TITOLO = QName.createQName(TIT_URI, "counterTitolo");
	public static final QName PROP_TIT_COUNTER_CLASSE = QName.createQName(TIT_URI, "counterClasse");
	public static final QName PROP_TIT_COUNTER_FASCICOLO = QName.createQName(TIT_URI, "counterFascicolo");
    public static final String STATUS_FASCICOLO_CLOSED = "Chiuso";
	public static final String STATUS_FASCICOLO_OPEN = "Aperto";
    
    // address-book constants
    public static final String ADDRESS_BOOK_URI = "http://www.reg.it/model/addbook/1.0";
    public static final String ADDRESS_BOOK_PREFIX = "addbook";
    public static final QName TYPE_ADDRESS_BOOK_CONTACT = QName.createQName(ADDRESS_BOOK_URI, "contact");
    
    // qnames address book properties
    public static QName PROP_ADDRESS_BOOK_NAME = QName.createQName(ADDRESS_BOOK_URI, "name");
	public static QName PROP_ADDRESS_BOOK_EMAIL = QName.createQName(ADDRESS_BOOK_URI, "email");
    public static QName PROP_ADDRESS_BOOK_CAP = QName.createQName(ADDRESS_BOOK_URI, "cap");
	public static QName PROP_ADDRESS_BOOK_CITY = QName.createQName(ADDRESS_BOOK_URI, "city");
	public static QName PROP_ADDRESS_BOOK_ADDRESS = QName.createQName(ADDRESS_BOOK_URI, "address");
	public static QName PROP_ADDRESS_BOOK_DISTRICT = QName.createQName(ADDRESS_BOOK_URI, "district");
	public static QName PROP_ADDRESS_BOOK_VATNUMBER = QName.createQName(ADDRESS_BOOK_URI, "vatNumber");
	
	// Namespace details
    public static final String AUDIT_URI = "http://www.reg.it/model/audit/1.0";
    public static final String AUDIT_PREFIX = "audit";

    // qnames audit
    public static final QName TYPE_AUDIT_ENTITY = QName.createQName(AUDIT_URI, "auditEntity");
	
	// qnames audit entity properties
	public static final QName PROPERTY_USER_OWNER = QName.createQName(AUDIT_URI, "userOwner");
	public static final QName PROPERTY_SITE = QName.createQName(AUDIT_URI, "site");
	public static final QName PROPERTY_ACTION = QName.createQName(AUDIT_URI, "action");
	public static final QName PROPERTY_DATE = QName.createQName(AUDIT_URI, "date");
	public static final QName PROPERTY_REF_NODE = QName.createQName(AUDIT_URI, "referenceNodeRef");
	public static final QName PROPERTY_REF_NAME = QName.createQName(AUDIT_URI, "referenceName");
	public static final QName PROPERTY_REF_TYPE = QName.createQName(AUDIT_URI, "referenceType");
	public static final QName PROPERTY_PARAMS = QName.createQName(AUDIT_URI, "params");
	
	// gruppi
	public static final String REG_PROTOCOLLATORI = "_prot";
	public static final String REG_ARCHIVISTI = "_arch";
	
	private RegModel(){}
	
}