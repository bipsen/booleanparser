@{%
const moo = require("moo");

const lexer = moo.compile({
  ws:     /[ \t\v\f]/,
  lparen:  '(',
  rparen:  ')',
  quote:   /"[^"]*"/, // Matches strings enclosed in quotes
  IDEN: {match: /[^()\s"]+/, type: moo.keywords({
    'AND': 'AND',
    'OR': 'OR',
    'NOT': 'NOT',
  })},
});
%}

@lexer lexer

start -> seq {% id %}

# Sequences are expressions that may be seperated only by a whitespace
seq ->
      expr {% id %} # Matches single expression
    | expr (__ notExpr):+ {% ([first, rest]) => [first, ...rest.map(item => item[1])].join(' ') %} # Matches expression followed by negated expressions

# Expression consists of AND expression, OR expression, negated expression or atomic expression
expr -> 
    andExpr {% id %} # Matches AND expression
    | orExpr {% id %} # Matches OR expression
    | notExpr {% id %} # Matches negated expression
    | atomicExpr {% id %} # Matches atomic expression

# AND expression: Matches a sequence of atomic expressions separated by AND
andExpr -> 
    atomicExpr (__ %AND __ atomicExpr):+ 
    {% ([first, rest]) => ['+' + first, ...rest.map(([, , , item]) => '+' + item)].join(' ') %} # Transforms the AND expression to mariadb syntax

# OR expression: Matches a sequence of atomic expressions separated by OR
orExpr ->
    atomicExpr (__ %OR __ atomicExpr):+ 
    {% ([first, rest]) => [first, ...rest.map(([, , , item]) => item)].join(' ') %} # Transforms the OR expression to mariadb syntax

# NOT expression: Matches a NOT keyword followed by an expression
notExpr ->
    %NOT __ expr {% ([not, , d]) => { return `-${d}` } %} # Transforms the NOT expression to mariadb syntax

# Atomic expression: Matches a sequence of words, a quoted string, or an expression enclosed in parentheses
atomicExpr -> 
      wordSeq {% id %} # Matches a sequence of words
    | %quote {% d => d[0].text %} # Matches a quoted string
    | _ %lparen expr %rparen _ {% function(d) { return d.join(""); } %} # Matches an expression enclosed in parentheses
    
# Word sequence: Matches a sequence of identifiers
wordSeq ->
    %IDEN (__ %IDEN):* {% function(d) { return [d[0].value, ...d[1].map(item => item[1].value)].join(' '); } %}
    
_  -> %ws:* {% function(d) {return null;} %} # Matches any amount of white space and returns null
__ -> %ws:+ {% function(d) {return null;} %} # Matches at least one white space and returns null
