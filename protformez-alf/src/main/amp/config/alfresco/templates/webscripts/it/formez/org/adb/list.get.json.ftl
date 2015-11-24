<#escape x as jsonUtils.encodeJSONString(x)>
{"contacts":{
	<#list contacts as contact>
	"${contact.nodeRef.toString()}": {
		"name": "${contact.properties["addbook:name"]}",
		"address": "${contact.properties["addbook:address"]!""}",
		"city": "${contact.properties["addbook:city"]!""}",
		"cap": "${contact.properties["addbook:cap"]!""}",
		"district": "${contact.properties["addbook:district"]!""}",
		"email": "${contact.properties["addbook:email"]!""}",
		"tel": "${contact.properties["addbook:telephone"]!""}",
		"piva": "${contact.properties["addbook:vatNumber"]!""}",
		"note": "${contact.properties["addbook:notes"]!""}"
	}<#if contact_has_next>,</#if>
	</#list>
}}
</#escape>