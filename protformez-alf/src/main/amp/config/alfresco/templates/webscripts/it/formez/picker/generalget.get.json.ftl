<#escape x as jsonUtils.encodeJSONString(x)>
{"elements":{
	<#list elements as element>
	"${element.nodeRef.toString()}": {
		"name": <#if element.typeShort == 'addbook:contact'>"${element.properties["addbook:name"]}"<#else>"${element.properties["cm:name"]}"</#if>
	}<#if element_has_next>,</#if>
	</#list>
}}
</#escape>