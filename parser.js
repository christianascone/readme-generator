const fs = require("fs");

/*
File di esempio:

1	Testo 
2	Testo2 {%=variabile=%}
3
4	{%=for variabile2 in variabili2 =%}
5		{%=variabile2.prop1=%} {%=variabile2.prop2=%}
6	{%=endfor=%}

Mi servono le variabili: 
- instructions[]: raccoglie la lista delle istruzioni
- variables[]: raccoglie una lista delle variabili
- (int)lastInstruction: 

1) Leggo il file
2) Splitto il file riga per riga in un array
3) Scorro l'array
4) Per ogni riga:
	- controllo se esiste tag di apertura di un FOR
	- controllo se esiste tag di chiusura di un FOR
	- controllo se esiste una variabile
	Se esiste tag di apertura di un FOR:
		- Aggiungo all'array instructions[]:
			- numero riga
			- numero colonna iniziale istruzione
			- numero colonna finale istruzione
			- 
	
*/
const PARSER_TOKENS = [
	{
		name  : 'FOR_LOOP_OPEN_REGEXP',
		value :  new RegExp('\{%=for[\\s]+[^\\s]+[\\s]+in[\\s]+[^=]+=%\}', "g")
	},
	{
		name  : 'FOR_LOOP_CLOSE_REGEXP',
		value :  new RegExp('\{%=endfor=%\}', "g")
	},
	{
		name  : 'VARIABLE_REGEXP',
		value :  new RegExp('\{%=(?!endfor|for[\\s]+[^\\s]+[\\s]+in[\\s]+[^\\s]+)[^=]+=%\}', "g")
	},
]


const data = fs.readFileSync('./readme-templates/README-placeholders.md').toString();

const parse = (text) => {
	let matches = {};

	for (let i = 0; i < PARSER_TOKENS.length; i++) {
		matches[PARSER_TOKENS[i].name] = text.match(PARSER_TOKENS[i].value);
	}
	console.log(matches);
}

parse(data);

/*
Parser = function (file, settings) {
	this.file       = file;
	this.settings   = settings || {};
	this.fileString = '';
	this.variables  = [];
}

Parser.TOKENS = {
	FOR_LOOP_OPEN_REGEXP  : new RegExp('\{%=endfor=%\}', "g"),
	FOR_LOOP_CLOSE_REGEXP : new RegExp('\{%=for[\s]+[^\s]+[\s]+in[\s]+[^=]+=%\}', "g");
	VARIABLE_REGEXP       : new RegExp('\{%=[^=]=%\}')
}

Parser.prototype.constructor = Parser;

Parser.prototype.parseVariables = */