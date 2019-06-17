{%=for variable in variables=%}
	{%=for variable2 in variable.prop=%}
		<a href="{%=variable2.href=%}">{%=variable2.text=%}</a>
	{%=endfor=%}
{%=endfor=%}