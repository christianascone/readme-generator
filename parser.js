const fs = require("fs");

const PARSER_TOKENS = {
	'FOR_LOOP_OPEN_REGEXP' : new RegExp('\{%=for[\\s]+[^\\s]+[\\s]+in[\\s]+[^=]+=%\}'),
	'FOR_LOOP_CLOSE_REGEXP': new RegExp('\{%=endfor=%\}'),
	'VARIABLE_REGEXP'      : new RegExp('\{%=(?!endfor|for[\\s]+[^\\s]+[\\s]+in[\\s]+[^\\s]+)[^=]+=%\}')
}

const VARIABLES_TOKEN = {
	'VARS_FOR_LOOP' : new RegExp("\{%=for[\\s]+([^\\s]+)[\\s]+in[\\s]+([^=]+)=%\}"),
	'VARS_VARIABLE' : new RegExp("\{%=(?!endfor|for[\\s]+[^\\s]+[\\s]+in[\\s]+[^\\s]+)([^=]+)=%\}", "g")
}

//const data = fs.readFileSync('./readme-templates/README-placeholders.md').toString();
const data = fs.readFileSync('./readme-templates/nesting-test.md').toString();

const parseDots = (variableName) => {
	return variableName.split('.');	
}

const getAliasesChain = (scope) => {
	let curScope  = scope; 
	let aliases   = []; 
	do {
		if (curScope.alias) {
			aliases[curScope.alias] = curScope;
		}
	} while (curScope = curScope.parent);
	return aliases;
}

const openForTag = (scope, curScope, line, fullVariableName, alias) => {
	//console.log(scope, curScope, line, fullVariableName, alias);
	if (fullVariableName.indexOf('.') === -1) {
		curScope.childProps[fullVariableName] = {
			instruction : 'for',
			alias       : alias,
			childProps  : {},
			lineStart   : line,
			lineEnd     : null,
			parent      : curScope,
			type        : 'object'
		}
		return curScope.childProps[fullVariableName];
	} else {
		const aliases        = getAliasesChain(curScope);
		const splitVariable  = parseDots(fullVariableName);
		console.log(splitVariable);
	}
}

const parse = (text) => {
	let textArr  = text.split(/\r\n|\n/);
	let scope    = {
		childProps : {},
		lineStart  : 0,
		lineEnd    : (textArr.length - 1),
		parent     : null
	}
	let curScope = scope;
	
	for (let i=0;i<textArr.length; i++) {
		let line  = textArr[i]; 
		let match = null;

		if (line.match(PARSER_TOKENS['FOR_LOOP_OPEN_REGEXP']) !== null) {
			match = line.match(VARIABLES_TOKEN['VARS_FOR_LOOP']);
			curScope = openForTag(scope, curScope, i, match[2], match[1])
		}
	}
	console.log(scope);
	return scope;
}

/*
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
		let ppp = null;
		if (curScope[prop] && curScope[prop].childProps) {
			ppp = curScope[prop].childProps
		}
		console.log(curScope[prop], ppp)
	}
	return;
}*/

parse(data);