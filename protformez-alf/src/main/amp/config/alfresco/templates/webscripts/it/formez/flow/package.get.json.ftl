<#escape x as jsonUtils.encodeJSONString(x)>
{
	"total": ${nodes?size},
	"nodes": [
		<#list nodes as node>
		{
			"name": "${node.name}",
			"noderef": "${node.nodeRef.toString()}"
		}<#if node_has_next>,</#if>
		</#list>
	]
}
</#escape>