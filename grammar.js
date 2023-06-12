// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

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
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "start", "symbols": ["seq"], "postprocess": id},
    {"name": "seq", "symbols": ["expr"], "postprocess": id},
    {"name": "seq$ebnf$1$subexpression$1", "symbols": ["__", "notExpr"]},
    {"name": "seq$ebnf$1", "symbols": ["seq$ebnf$1$subexpression$1"]},
    {"name": "seq$ebnf$1$subexpression$2", "symbols": ["__", "notExpr"]},
    {"name": "seq$ebnf$1", "symbols": ["seq$ebnf$1", "seq$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "seq", "symbols": ["expr", "seq$ebnf$1"], "postprocess": ([first, rest]) => [first, ...rest.map(item => item[1])].join(' ')},
    {"name": "expr", "symbols": ["andExpr"], "postprocess": id},
    {"name": "expr", "symbols": ["orExpr"], "postprocess": id},
    {"name": "expr", "symbols": ["notExpr"], "postprocess": id},
    {"name": "expr", "symbols": ["atomicExpr"], "postprocess": id},
    {"name": "andExpr", "symbols": ["atomicExpr", "__", (lexer.has("AND") ? {type: "AND"} : AND), "__", "atomicExpr"], "postprocess": ([a, , , , b]) => { return `+${a} +${b}` }},
    {"name": "orExpr", "symbols": ["atomicExpr", "__", (lexer.has("OR") ? {type: "OR"} : OR), "__", "atomicExpr"], "postprocess": ([a, , , , b]) => { return `${a} ${b}` }},
    {"name": "notExpr", "symbols": [(lexer.has("NOT") ? {type: "NOT"} : NOT), "__", "atomicExpr"], "postprocess": ([not, , d]) => { return `-${d}` }},
    {"name": "atomicExpr", "symbols": ["wordSeq"], "postprocess": id},
    {"name": "atomicExpr", "symbols": ["_", (lexer.has("quote") ? {type: "quote"} : quote), "expr", (lexer.has("quote") ? {type: "quote"} : quote), "_"], "postprocess": function(d) { return d.join(""); }},
    {"name": "atomicExpr", "symbols": ["_", (lexer.has("lparen") ? {type: "lparen"} : lparen), "expr", (lexer.has("rparen") ? {type: "rparen"} : rparen), "_"], "postprocess": function(d) { return d.join(""); }},
    {"name": "wordSeq$ebnf$1", "symbols": []},
    {"name": "wordSeq$ebnf$1$subexpression$1", "symbols": ["__", (lexer.has("IDEN") ? {type: "IDEN"} : IDEN)]},
    {"name": "wordSeq$ebnf$1", "symbols": ["wordSeq$ebnf$1", "wordSeq$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "wordSeq", "symbols": [(lexer.has("IDEN") ? {type: "IDEN"} : IDEN), "wordSeq$ebnf$1"], "postprocess": function(d) { return [d[0].value, ...d[1].map(item => item[1].value)].join(' '); }},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}}
]
  , ParserStart: "start"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
