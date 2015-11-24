<#escape x as jsonUtils.encodeJSONString(x)>
{
	<#if success>
	"number":"${protocolNumber}",
	<#else>
	"message":"${message}",
	</#if>
	"success":${success?string}
}
</#escape>