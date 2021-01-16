// stringify-objects forked from Yeoman Github repo, with modifications.
//
// Copyright (c) 2015, Yeoman team
// All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
// 1. Redistributions of source code must retain the above copyright notice, this
//    list of conditions and the following disclaimer.
// 2. Redistributions in binary form must reproduce the above copyright notice,
//    this list of conditions and the following disclaimer in the documentation
//    and/or other materials provided with the distribution.
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
// ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
// ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
'use strict';
const _ = require('lodash'), getOwnEnumPropSymbols = require('get-own-enumerable-property-symbols').default;
module.exports = (val, opts, pad) => {
    const seen = [];
    return (function stringify(val, opts, pad) {
        opts = opts || {};
        opts.indent = opts.indent || '\t';
        pad = pad || '';
        let tokens;
        if (opts.inlineCharacterLimit === undefined) {
            tokens = {
                newLine: '\n',
                newLineOrSpace: '\n',
                pad,
                indent: pad + opts.indent
            };
        }
        else {
            tokens = {
                newLine: '@@__STRINGIFY_OBJECT_NEW_LINE__@@',
                newLineOrSpace: '@@__STRINGIFY_OBJECT_NEW_LINE_OR_SPACE__@@',
                pad: '@@__STRINGIFY_OBJECT_PAD__@@',
                indent: '@@__STRINGIFY_OBJECT_INDENT__@@'
            };
        }
        const expandWhiteSpace = (stringVal) => {
            if (opts.inlineCharacterLimit === undefined) {
                return stringVal;
            }
            const oneLined = stringVal
                .replace(new RegExp(tokens.newLine, 'g'), '')
                .replace(new RegExp(tokens.newLineOrSpace, 'g'), ' ')
                .replace(new RegExp(tokens.pad + '|' + tokens.indent, 'g'), '');
            if (oneLined.length <= opts.inlineCharacterLimit) {
                return oneLined;
            }
            return stringVal
                .replace(new RegExp(tokens.newLine + '|' + tokens.newLineOrSpace, 'g'), '\n')
                .replace(new RegExp(tokens.pad, 'g'), pad)
                .replace(new RegExp(tokens.indent, 'g'), pad + opts.indent);
        };
        if (seen.indexOf(val) !== -1) {
            return '[Circular]';
        }
        if (typeof val === 'function') {
            return '[function]';
        }
        if (val === null ||
            val === undefined ||
            typeof val === 'number' ||
            typeof val === 'boolean' ||
            typeof val === 'symbol' ||
            _.isRegExp(val)) {
            return String(val);
        }
        if (val instanceof Date) {
            return `new Date('${val.toISOString()}')`;
        }
        if (Array.isArray(val)) {
            if (val.length === 0) {
                return '[]';
            }
            seen.push(val);
            let stringArray = [];
            for (let i = 0; i < val.length; i++) {
                const eol = val.length - 1 === i ? tokens.newLine : ',' + tokens.newLineOrSpace;
                let value = stringify(val[i], opts, pad + opts.indent);
                if (opts.transform) {
                    value = opts.transform(val, i, value);
                }
                stringArray.push(tokens.indent + value + eol);
            }
            const ret = '[' + tokens.newLine + stringArray.join('') + tokens.pad + ']';
            seen.pop();
            return expandWhiteSpace(ret);
        }
        if (_.isObject(val)) {
            let objKeys = Object.keys(val).concat(getOwnEnumPropSymbols(val));
            if (opts.filter) {
                objKeys = objKeys.filter(el => opts.filter(val, el));
            }
            if (objKeys.length === 0) {
                return '{}';
            }
            seen.push(val);
            const ret = '{' + tokens.newLine + objKeys.map((el, i) => {
                const eol = objKeys.length - 1 === i ? tokens.newLine : ',' + tokens.newLineOrSpace;
                const isSymbol = typeof el === 'symbol';
                const isClassic = !isSymbol && /^[a-z$_][a-z$_0-9]*$/i.test(el);
                const key = isSymbol || isClassic ? el : stringify(el, opts, undefined);
                let value = stringify(val[el], opts, pad + opts.indent);
                if (opts.transform) {
                    value = opts.transform(val, el, value);
                }
                return tokens.indent + String(key) + ': ' + value + eol;
            }).join('') + tokens.pad + '}';
            seen.pop();
            return expandWhiteSpace(ret);
        }
        val = String(val).replace(/[\r\n]/g, x => x === '\n' ? '\\n' : '\\r');
        if (opts.singleQuotes === false) {
            val = val.replace(/"/g, '\\"');
            return `"${val}"`;
        }
        val = val.replace(/\\?'/g, '\\\'');
        return `'${val}'`;
    })(val, opts, pad);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaW5naWZ5T2JqZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cmluZ2lmeU9iamVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx3RUFBd0U7QUFDeEUsRUFBRTtBQUNGLGtDQUFrQztBQUNsQyx1QkFBdUI7QUFFdkIscUVBQXFFO0FBQ3JFLDhFQUE4RTtBQUU5RSxpRkFBaUY7QUFDakYsc0RBQXNEO0FBQ3RELCtFQUErRTtBQUMvRSwrRUFBK0U7QUFDL0UsNERBQTREO0FBRTVELGtGQUFrRjtBQUNsRixnRkFBZ0Y7QUFDaEYseUVBQXlFO0FBQ3pFLGtGQUFrRjtBQUNsRixpRkFBaUY7QUFDakYsK0VBQStFO0FBQy9FLDhFQUE4RTtBQUM5RSw2RUFBNkU7QUFDN0UsZ0ZBQWdGO0FBQ2hGLCtEQUErRDtBQUUvRCxZQUFZLENBQUM7QUFDYixNQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQ3JCLHFCQUFxQixHQUFHLE9BQU8sQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUVyRixNQUFNLENBQUMsT0FBTyxHQUFHLENBQUMsR0FBUSxFQUFFLElBQVMsRUFBRSxHQUFRLEVBQUUsRUFBRTtJQUNqRCxNQUFNLElBQUksR0FBVSxFQUFFLENBQUM7SUFFdkIsT0FBTyxDQUFDLFNBQVMsU0FBUyxDQUFDLEdBQVEsRUFBRSxJQUFTLEVBQUUsR0FBUTtRQUN0RCxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDO1FBQ2xDLEdBQUcsR0FBRyxHQUFHLElBQUksRUFBRSxDQUFDO1FBRWhCLElBQUksTUFBVyxDQUFDO1FBRWhCLElBQUksSUFBSSxDQUFDLG9CQUFvQixLQUFLLFNBQVMsRUFBRTtZQUMzQyxNQUFNLEdBQUc7Z0JBQ1AsT0FBTyxFQUFFLElBQUk7Z0JBQ2IsY0FBYyxFQUFF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