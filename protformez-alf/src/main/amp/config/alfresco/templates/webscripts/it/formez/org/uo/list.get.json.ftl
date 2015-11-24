<#escape x as jsonUtils.encodeJSONString(x)>
{
	"root": "${root}",
	"uos": {
		<#list uos as uo>
		"${uo.nodeRef.toString()}": {
			<#if uo.nodeRef.toString()=root>
			"name": "${title}",
			<#else>
			"name": "${uo.name}",
			</#if>
			"inherit": ${uo.properties["org:nodeUoInherit"]?string},
			"alltits": ${uo.properties["org:nodeUoAlltits"]?string},
			"roles": [
				<#if uo.assocs["org:rolesAssoc"]??>
				<#list uo.assocs["org:rolesAssoc"] as role>
				{
					"name": "${role.name}",
					"noderef": "${role.nodeRef.toString()}"
				}<#if role_has_next>,</#if>
				</#list>
				</#if>
			],
			"users": [
				<#if uo.assocs["org:usersAssoc"]??>
				<#list uo.assocs["org:usersAssoc"] as user>
				{
					"name": "${user.properties["cm:firstName"]} ${user.properties["cm:lastName"]}",
					"username": "${user.properties["cm:userName"]}"
				}<#if user_has_next>,</#if>
				</#list>
				</#if>
			],
			"tits": [
				<#if uo.assocs["org:titAssoc"]??>
				<#list uo.assocs["org:titAssoc"] as tit>
				{
					"name": "${tit.name}",
					"noderef": "${tit.nodeRef.toString()}",
					"path": "${tit.displayPath?split("/documentLibrary")[1]}"
				}<#if tit_has_next>,</#if>
				</#list>
				</#if>
			],
			"children": [
				<#if uo.children??>
				<#list uo.children as child>
				"${child.nodeRef.toString()}"<#if child_has_next>,</#if>
				</#list>
				</#if>
			]
		}<#if uo_has_next>,</#if>
		</#list>
	}
}
</#escape>