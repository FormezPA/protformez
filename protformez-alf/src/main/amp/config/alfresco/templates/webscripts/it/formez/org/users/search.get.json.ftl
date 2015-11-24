<#escape x as jsonUtils.encodeJSONString(x)>
{"users":[
	<#list users as user>
	{
		<#if uo>
		"uo": {
			<#if user.sourceAssocs["org:usersAssoc"]??>
			<#list user.sourceAssocs["org:usersAssoc"] as uo>
			<#if uo.hasPermission("Read")>
			"${uo.getSiteShortName()}": "${uo.nodeRef.toString()}",
			</#if>
			</#list>
			<#-- aggiungo un elemento vuoto alla fine perchè potrebbe esserci una virgola finale -->
			"":""
			</#if>
		},
		</#if>
		"username": "${user.properties["cm:userName"]}",
		"name": "${user.properties["cm:firstName"]!""}",
		"surname": "${user.properties["cm:lastName"]!""}",
		"mail": "${user.properties["cm:email"]!""}"
	}<#if user_has_next>,</#if>
	</#list>
]}
</#escape>