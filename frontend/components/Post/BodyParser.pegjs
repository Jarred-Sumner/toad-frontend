Lines = title:(ColonEmojiLine / TitleLine)? body:(Line*) {return {title: title, body: body}}

BlankLine =     Sp Newline { return { type: "blank_line", text: text() }}

Quoted =        '"' (!'"' .)* '"' / '\'' (!'\'' .)* '\''
HtmlAttribute = (AlphanumericAscii / '-')+ Spnl ('=' Spnl (Quoted / (!'>' Nonspacechar)+))? Spnl
HtmlComment =   "<!--" (!"-->" .)* "-->"
                { d.add(d.elem_cz(t.pmd_COMMENT,text())) }
HtmlTag =       '<' Spnl '/'? AlphanumericAscii+ Spnl HtmlAttribute* '/'? Spnl '>'
Eof =           !.
Spacechar =     ' ' / '\t'
Nonspacechar =  !Spacechar !Newline .
Newline =       '\n' / '\r' '\n'?
Sp =            Spacechar*
Spnl =          Sp (Newline Sp)?
SpecialChar =   '*' / '_' / '`' / '&' / '[' / ']' / '(' / ')' / '<' / '!' / '#' / '\\' / '\'' / '"'
NormalChar =    !( SpecialChar / Spacechar / Newline ) .
// Not used anywhere in grammar:
// NonAlphanumeric = [\000-\057\072-\100\133-\140\173-\177]
// TODO: check if that numbers fit
Alphanumeric = [0-9A-Za-z] / "\\200" / "\\201" / "\\202" / "\\203" / "\\204" / "\\205" / "\\206" / "\\207" / "\\210" / "\\211" / "\\212" / "\\213" / "\\214" / "\\215" / "\\216" / "\\217" / "\\220" / "\\221" / "\\222" / "\\223" / "\\224" / "\\225" / "\\226" / "\\227" / "\\230" / "\\231" / "\\232" / "\\233" / "\\234" / "\\235" / "\\236" / "\\237" / "\\240" / "\\241" / "\\242" / "\\243" / "\\244" / "\\245" / "\\246" / "\\247" / "\\250" / "\\251" / "\\252" / "\\253" / "\\254" / "\\255" / "\\256" / "\\257" / "\\260" / "\\261" / "\\262" / "\\263" / "\\264" / "\\265" / "\\266" / "\\267" / "\\270" / "\\271" / "\\272" / "\\273" / "\\274" / "\\275" / "\\276" / "\\277" / "\\300" / "\\301" / "\\302" / "\\303" / "\\304" / "\\305" / "\\306" / "\\307" / "\\310" / "\\311" / "\\312" / "\\313" / "\\314" / "\\315" / "\\316" / "\\317" / "\\320" / "\\321" / "\\322" / "\\323" / "\\324" / "\\325" / "\\326" / "\\327" / "\\330" / "\\331" / "\\332" / "\\333" / "\\334" / "\\335" / "\\336" / "\\337" / "\\340" / "\\341" / "\\342" / "\\343" / "\\344" / "\\345" / "\\346" / "\\347" / "\\350" / "\\351" / "\\352" / "\\353" / "\\354" / "\\355" / "\\356" / "\\357" / "\\360" / "\\361" / "\\362" / "\\363" / "\\364" / "\\365" / "\\366" / "\\367" / "\\370" / "\\371" / "\\372" / "\\373" / "\\374" / "\\375" / "\\376" / "\\377"
AlphanumericAscii = [A-Za-z0-9]

HexEntity =     '&' '#' [Xx] [0-9a-fA-F]+ ';'
DecEntity =     '&' '#' [0-9]+ ';'
CharEntity =    '&' [A-Za-z0-9]+ ';'

NonindentSpace =    "   " / "  " / " " / ""
Indent =            "\t" / "    "
Indents =           ind:Indent+ { return ind.length; }
AnyIndent =         ind:Indent* { return ind.length; }
IndentedLine =      Indent txt:Line { return txt }
OptionallyIndentedLine = Indent? txt:Line { return txt }
ColonEmoji = Sp?':'(AlphanumericAscii / "_")*':'Sp?

ColonEmojiLine = ( (!'\r' !'\n' ColonEmoji)* Newline / (ColonEmoji)+ Eof ) { return { type: "emoji_line", text: text() } }
RawLine = ( (!'\r' !'\n' .)* Newline / (.)+ Eof ) { return { type: "raw_line", text: text() } }
QuoteLine = ( ">" (!'\r' !'\n' .)* Newline / ">"(.+) Eof ) { return { type: "quote_line", text: text() } }
EmbedLine = ( "/" (!'\r' !'\n' !"/" .)* "/" Newline / "./"(.+)"/" Eof ) { return { type: "embed_line", text: text() } }

Line =  BlankLine / QuoteLine / EmbedLine / ColonEmojiLine / RawLine
TitleLine
  = ((!'\r' !'\n' !'https://' !'http://' !'>' !"." !"/" .)* Sp) Newline? {
    if (text().length < 100 && text().split(" ").length < 14) {
      return {type: "title_line", text: text() }
    } else {
      return { type: "raw_line", text: text() }
    }
  }
