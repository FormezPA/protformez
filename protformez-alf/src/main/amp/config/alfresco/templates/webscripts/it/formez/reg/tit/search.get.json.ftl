<#escape x as jsonUtils.encodeJSONString(x)>
{
	"total": ${items?size},
	"items": [
		<#list items as item>
		{
	        "nodeRef": "${item.nodeRef}",
	        "type": "${item.type}",
	        "isContainer": ${item.isContainer?string},
	        "name": "${item.name!''}",
	        "displayName": "${item.displayName!''}",
	        <#if item.title??>
	        "title": "${item.title}",
	        </#if>
	        "description": "${item.description!''}",
	        "size": ${item.size?c},
	        <#if item.path??>
	        "path": "${item.path}",
	        </#if>
	        "mimetype": "${item.mimetype!''}"
		}<#if item_has_next>,</#if>
		</#list>
	]
}
</#escape>