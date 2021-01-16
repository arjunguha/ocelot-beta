"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const highlight = () => ({
    tokenPostfix: '.js',
    keywords: [
        'boolean', 'break', 'case', 'catch', 'class', 'const', 'continue',
        'delete', 'do', 'else', 'enum', 'extends', 'false', 'final',
        'finally', 'for', 'function', 'if', 'implements', 'import',
        'instanceof', 'interface', 'new', 'package', 'private',
        'public', 'return', 'short', 'static', 'super', 'switch', 'this',
        'true', 'try', 'typeof', 'void', 'while', 'let', 'undefined'
    ],
    builtins: [],
    operators: [
        '=', '>', '<', '!', '~', '?', ':',
        '==', '<=', '>=', '!=', '&&', '||', '++', '--',
        '+', '-', '*', '/', '&', '|', '^', '%', '<<',
        '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=',
        '^=', '%=', '<<=', '>>=', '>>>='
    ],
    // define our own brackets as '<' and '>' do not match in javascript
    brackets: [
        ['(', ')', 'bracket.parenthesis'],
        ['{', '}', 'bracket.curly'],
        ['[', ']', 'bracket.square']
    ],
    // common regular expressions
    symbols: /[~!@#%\^&*-+=|\\:`<>.?\/]+/,
    escapes: /\\(?:[btnfr\\"']|[0-7][0-7]?|[0-3][0-7]{2})/,
    exponent: /[eE][\-+]?[0-9]+/,
    regexpctl: /[(){}\[\]\$\^|\-*+?\.]/,
    regexpesc: /\\(?:[bBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/,
    tokenizer: {
        root: [
            // identifiers and keywords
            [/([a-zA-Z_\$][\w\$]*)(\s*)(:?)/, {
                    cases: {
                        '$1@keywords': ['keyword', 'white', 'delimiter'],
                        // this is some black magic I don't understand
                        '$3': ['key.identifier', 'white', 'delimiter'],
                        '$1@builtins': ['predefined.identifier', 'white', 'delimiter'],
                        '@default': ['identifier', 'white', 'delimiter']
                    }
                }],
            // whitespace
            { include: '@whitespace' },
            // regular expression: ensure it is terminated before beginning (otherwise it is an opeator)
            [/\/(?=([^\\\/]|\\.)+\/(?!\s*(\d|\w)))/, { token: 'regexp.slash', bracket: '@open', next: '@regexp' }],
            // delimiters and operators
            [/[{}()\[\]]/, '@brackets'],
            [/[;,.]/, 'delimiter'],
            [/@symbols/, {
                    cases: {
                        '@operators': 'operator',
                        '@default': ''
                    }
                }],
            // numbers
            [/\d+\.\d*(@exponent)?/, 'number.float'],
            [/\.\d+(@exponent)?/, 'number.float'],
            [/\d+@exponent/, 'number.float'],
            [/0[xX][\da-fA-F]+/, 'number.hex'],
            [/0[0-7]+/, 'number.octal'],
            [/\d+/, 'number'],
            // strings: recover on non-terminated strings
            [/"([^"\\]|\\.)*$/, 'string.invalid'],
            [/'([^'\\]|\\.)*$/, 'string.invalid'],
            [/"/, 'string', '@string."'],
            [/'/, 'string', '@string.\''],
        ],
        whitespace: [
            [/[ \t\r\n]+/, 'white'],
            [/\/\*/, 'comment', '@comment'],
            [/\/\/.*$/, 'comment'],
        ],
        comment: [
            [/[^\/*]+/, 'comment'],
            [/\/\*/, 'comment.invalid'],
            ['\\*/', 'comment', '@pop'],
            [/[\/*]/, 'comment']
        ],
        string: [
            [/[^\\"']+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/["']/, {
                    cases: {
                        '$#==$S2': { token: 'string', next: '@pop' },
                        '@default': 'string'
                    }
                }]
        ],
        // We match regular expression quite precisely
        regexp: [
            [/(\{)(\d+(?:,\d*)?)(\})/, ['@brackets.regexp.escape.control',
                    'regexp.escape.control',
                    '@brackets.regexp.escape.control']],
            [/(\[)(\^?)(?=(?:[^\]\\\/]|\\.)+)/, ['@brackets.regexp.escape.control',
                    { token: 'regexp.escape.control', next: '@regexrange' }]],
            [/(\()(\?:|\?=|\?!)/, ['@brackets.regexp.escape.control', 'regexp.escape.control']],
            [/[()]/, '@brackets.regexp.escape.control'],
            [/@regexpctl/, 'regexp.escape.control'],
            [/[^\\\/]/, 'regexp'],
            [/@regexpesc/, 'regexp.escape'],
            [/\\\./, 'regexp.invalid'],
            ['/', { token: 'regexp.slash', bracket: '@close' }, '@pop'],
        ],
        regexrange: [
            [/-/, 'regexp.escape.control'],
            [/\^/, 'regexp.invalid'],
            [/@regexpesc/, 'regexp.escape'],
            [/[^\]]/, 'regexp'],
            [/\]/, '@brackets.regexp.escape.control', '@pop'],
        ],
    },
});
exports.default = highlight;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlbWpzSGlnaGxpZ2h0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29udGFpbmVycy9Db2RlRWRpdG9yL2VsZW1qc0hpZ2hsaWdodGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBTSxTQUFTLEdBQUcsR0FBUSxFQUFFLENBQUMsQ0FBQztJQUMxQixZQUFZLEVBQUUsS0FBSztJQUVuQixRQUFRLEVBQUU7UUFDTixTQUFTLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxVQUFVO1FBQ2pFLFFBQVEsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLE9BQU87UUFDM0QsU0FBUyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxRQUFRO1FBQzFELFlBQVksRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxTQUFTO1FBQ3RELFFBQVEsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU07UUFDaEUsTUFBTSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsV0FBVztLQUMvRDtJQUVELFFBQVEsRUFBRSxFQUFFO0lBRVosU0FBUyxFQUFFO1FBQ1AsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRztRQUNqQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSTtRQUM5QyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FB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