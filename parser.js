const fs = require("fs");
/*
const PARSER_TOKENS = [
	{
		name  : 'FOR_LOOP_OPEN_REGEXP',
		value :  new RegExp('\{%=for[\\s]+[^\\s]+[\\s]+in[\\s]+[^=]+=%\}')
	},
	{
		name  : 'FOR_LOOP_CLOSE_REGEXP',
		value :  new RegExp('\{%=endfor=%\}')
	},
	{
		name  : 'VARIABLE_REGEXP',
		value :  new RegExp('\{%=(?!endfor|for[\\s]+[^\\s]+[\\s]+in[\\s]+[^\\s]+)[^=]+=%\}')
	}
]

const VARIABLES_TOKEN = [
	{
		name  : 'VARS_FOR_LOOP',
		value : new RegExp("\{%=for[\\s]+([^\\s])+[\\s]+in([\\s])+[^=]+=%\}")
	},
	{
		name  : 'VARS_VARIABLE',
		value : new RegExp("\{%=(?!endfor|for[\\s]+[^\\s]+[\\s]+in[\\s]+[^\\s]+)[^=]+=%\}")
	},
]*/

const PARSER_TOKENS = {
	'FOR_LOOP_OPEN_REGEXP' : new RegExp('\{%=for[\\s]+[^\\s]+[\\s]+in[\\s]+[^=]+=%\}'),
	'FOR_LOOP_CLOSE_REGEXP': new RegExp('\{%=endfor=%\}'),
	'VARIABLE_REGEXP'      : new RegExp('\{%=(?!endfor|for[\\s]+[^\\s]+[\\s]+in[\\s]+[^\\s]+)[^=]+=%\}')
}

const VARIABLES_TOKEN = {
	'VARS_FOR_LOOP' : new RegExp("\{%=for[\\s]+([^\\s]+)[\\s]+in[\\s]+([^=]+)=%\}"),
	'VARS_VARIABLE' : new RegExp("\{%=(?!endfor|for[\\s]+[^\\s]+[\\s]+in[\\s]+[^\\s]+)([^=]+)=%\}", "g")
}

const data = fs.readFileSync('./readme-templates/README-placeholders.md').toString();

const parse = (text) => {
	let textArr  = text.split(/\r\n|\n/);
	let scope    = {
		childProps : {},
		lineStart  : 0,
		parent     : null
	};
	let curScope = scope;

	for (let i=0;i<textArr.length; i++) {
		let line  = textArr[i]; 
		let match = null;
		switch (true) {
			case line.match(PARSER_TOKENS['FOR_LOOP_OPEN_REGEXP']) !== null:
				match = line.match(VARIABLES_TOKEN['VARS_FOR_LOOP']);
				if (match) {
					//console.log('FOR OPEN at line', i, match);
					curScope.childProps[match[2]] = {
						instruction : 'for',
						alias       : match[1],
						childProps  : {},
						lineStart   : i,
						lineEnd     : null,
						parent      : curScope,
						type        : 'object'
					}
					curScope = curScope.childProps[match[2]];
				}
				break;
			case line.match(PARSER_TOKENS['FOR_LOOP_CLOSE_REGEXP']) !== null:
				curScope.lineEnd = i;
				curScope         = curScope.parent;
				break;
			case line.match(PARSER_TOKENS['VARIABLE_REGEXP']) !== null:
				match          = null;
				let _tempScope = curScope;
				let aliases    = {};
				let noAliases  = true;
				do {
					if (_tempScope.alias) {
						aliases[_tempScope.alias] = _tempScope;
					}
					noAliases = false;
				}
				while (_tempScope = _tempScope.parent);

				while (match = VARIABLES_TOKEN['VARS_VARIABLE'].exec(line)) {
					console.log(match[1], match[1].match(/\./));
					if (!match[1].match(/\./)) {
						_tempScope = aliases[match[1]];
						if (_tempScope) {
							_tempScope.type = 'string';
							delete _tempScope.childProps;
						} else {
							scope.childProps[match[1]] = {
								instruction : 'variable',
								lineStart   : i,
								lineEnd     : i,
								type        : 'string',
								parent      : scope
							}
						}
					} else {
						let matchArray = match[1].split('.');
						_tempScope = aliases[matchArray[0]];
						for (let j=0; j<matchArray.length; j++) {
							if (
								_tempScope.alias == matchArray[j]
								&& j < matchArray.length - 1
							) {
								continue;
							} else {
								if (!_tempScope.childProps[matchArray[j]]) {
									_tempScope.childProps[matchArray[j]] = {
										instruction : 'variable',
										lineStart   : i,
										lineEnd     : i,
										parent      : _tempScope,
										childProps  : {
										}
									}
								}
							}
							/*if (aliases[matchArray[j]]) {
								_tempScope            = aliases[matchArray[j]];
								_tempScope.type       = 'object';
								_tempScope.childProps = _tempScope.childProps || {childProps : {}, parent : _tempScope};
								_tempScope            = _tempScope.childProps[''];
							} else {
								console.log(_tempScope, matchArray[j]);
								_tempScope.childProps[matchArray[j]] = {
									instruction : 'variable',
									lineStart   : i,
									lineEnd     : i,
									parent      : _tempScope.parent,
									childProps  : {}
								}

								if (j == matchArray.length - 1) {
									_tempScope.childProps[matchArray[j]].type = 'string';
								} else {
									_tempScope.childProps[matchArray[j]].type = 'object';
								}
							}*/
						}
					}
				}
				
				break;
			default:

				break; 
		}
	}

	console.log(curScope);
	for (let prop in curScope) {
		console.log(curScope[prop])
	}
	return;
	let matches = {};



	for (let i = 0; i < PARSER_TOKENS.length; i++) {
		matches[PARSER_TOKENS[i].name] = text.match(PARSER_TOKENS[i].value);
	}
	console.log(matches);
}

parse(data);