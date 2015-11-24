<#escape x as jsonUtils.encodeJSONString(x)>
{
	"total": ${docs?size},
	"docs": [
		<#list docs as doc>
		{
			"noderef": "${doc.nodeRef.toString()}",
			"date": "${doc.properties["cm:created"]?string("dd MMMM yyyy 'alle' HH:mm")}"
		}<#if doc_has_next>,</#if>
		</#list>
	]
}
</#escape>