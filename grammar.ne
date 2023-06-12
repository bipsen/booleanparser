@{%
const moo = require("moo");

const lexer = moo.compile({
  ws:     /[ \t\v\f]/,
  lparen:  '(',
  rparen:  ')',
  quote: '"',
  IDEN: {match: /[^()\s"]+/, type: moo.keywords({
	'AND': 'AND',
	'OR': 'OR',
	'NOT': 'NOT',
  })},
});
%}

@lexer lexer

start -> seq {% id %}

seq ->
	  expr {% id %}
	| expr (__ notExpr):+ {% ([first, rest]) => [first, ...rest.map(item => item[1])].join(' ') %}

expr -> 
	andExpr {% id %}
	| orExpr {% id %}
	| notExpr {% id %}
	| atomicExpr {% id %}

andExpr -> 
    atomicExpr __ %AND __ atomicExpr {% ([a, , , , b]) => { return `+${a} +${b}` } %}

orExpr -> 
    atomicExpr __ %OR __ atomicExpr {% ([a, , , , b]) => { return `${a} ${b}` } %}

notExpr ->
    %NOT __ atomicExpr {% ([not, , d]) => { return `-${d}` } %}

atomicExpr -> 
      wordSeq {% id %}
    | _ %quote expr %quote _ {% function(d) { return d.join(""); } %}
    | _ %lparen expr %rparen _ {% function(d) { return d.join(""); } %}
	
wordSeq ->
	%IDEN (__ %IDEN):* {% function(d) { return [d[0].value, ...d[1].map(item => item[1].value)].join(' '); } %}

	
_  -> %ws:* {% function(d) {return null;} %}
__ -> %ws:+ {% function(d) {return null;} %}

