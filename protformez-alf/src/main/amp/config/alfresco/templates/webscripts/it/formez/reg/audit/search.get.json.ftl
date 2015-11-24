<#escape x as jsonUtils.encodeJSONString(x)>
{
	"audits": [
		<#list audits as audit>
		{
			<#if mode="reg">
			"dir": "${audit.properties["reg:directionType"]}",
			<#elseif mode="tit">
			"type": "${audit.typeShort}",
			</#if>
			"noderef": "${audit.nodeRef.toString()}",
			"name": "${audit.name}"
		}<#if audit_has_next>,</#if>
		</#list>
	]
}
</#escape>