<#if args.site??>
${perms.clean(args.site)?string}
<#else>
site?
</#if>