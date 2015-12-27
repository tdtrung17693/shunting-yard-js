module.exports = (function () {
    'use stricts';
    var precedence = {
        '+' : [2, 'Left'],
        '-' : [2, 'Left'],
        '*' : [3, 'Left'],
        '/' : [3, 'Left'],
        '^' : [4, 'Right']
    };

    var patterns = '^-\\d+|\\d+\\.\\d+|\\d+|\\\+|\\\-|\\\*|\\\/|\\\(|\\\)|\\\^';

    
    var keywords = {
        sqrt: Math.sqrt,
        abs: Math.abs
    };

    var output = [],
        stack = [];

    function parse(expression) {
        var tokenized,
            token,
            tmp,
            result,
            i = 0;
        
        var pattern = combinePattern();

        tokenized = expression.match(pattern);

        while (tokenized.length > 0) {
            token = tokenized.shift();
            tmp = tokenized.shift();

            if (tmp != undefined) {
                if (
                    ((isFunction(token) || isOperator(token)) && tmp.match(/\)/)) 
                ||  (tmp.match(/\)/) && token.match(/\(/))) {
                    throw new Error('Invalid Expression');
                }                

              tokenized.unshift(tmp);
            }

            if (isOperator(token) || isFunction(token)) {

                while (haveGreaterOperator(token)) {
                    output.push(stack.pop());
                }

                stack.push(token);
            } else if (token.match(/\(/)) {
                stack.push(token);
            } else if (token.match(/\)/)) {

                while (true) {
                    tmp = stack.pop();

                    if (tmp.match(/\(/)) {
                        tmp = stack.pop();

                        if (tmp != undefined) {
                            if (isFunction(tmp)) output.push(tmp);
                            else stack.push(tmp);
                        }

                        break;
                    } else if (stack.length > 0) {
                        output.push(tmp);
                    } else {
                        cleanUp();

                        throw new Error('Parenthese Mismatched');
                    }
                }
            } else {
                output.push(new Number(token));
            }
        }

        while (stack.length > 0) {
            tmp = stack.pop();
            if (tmp.match(/\(/)) {
                cleanUp();
                throw new Error('Parenthese Mismatched');
            }

            output.push(tmp);
        }

        result = output.slice(0);

        // clean output and stack for the next call
        cleanUp();
        
        return result;
    }

    function operate(operator, a, b) {
        if (isFunction(operator)) {
            return keywords[operator].call(null, a);
        }

        switch (operator) {
            case '+':
                return a + b;
            case '-':
                return b - a;
            case '*':
                return a * b;
            case '/':
                return b / a;
            case '^':
                return Math.pow(b,a);
            default:
                throw new Error('Invalid operator');
        }
    }

    function calculate(expression) {
        var rpn = parse(expression),
            output = [],
            tmp;

        while (rpn.length > 0) {
            tmp = rpn.shift();
            
            if (isOperator(tmp + '')) {
                output.push(operate(tmp, output.pop(), output.pop()));
            } else if (isFunction(tmp + '')) {
                output.push(operate(tmp, output.pop()));
            } else {
                output.push(tmp);
            }
        }

        return output.pop();
    }

    function combinePattern() {
        var result = patterns;

        for (var keyword in keywords) {
            result = keyword + '|' + result;
            result = '^-' + keyword + '|' + result;
        }

        return new RegExp(result, 'gi');
    }

    function haveGreaterOperator(operator) {
        var count = stack.length;

        for (var i = count - 1; i >= 0; --i) {
            if (stack[i].match(/\(/)) return false;
            
            if ( isFunction( stack[i] ) ) {
                return true;
            }

            if ( isFunction( operator ) ) {
                return false;
            }

            if (precedence[ operator ][1].match(/Left/gi) && precedence[ operator ][0] <= precedence[ stack[i] ][0]) {
                return true;
            }

            if (precedence[ operator ][1].match(/Right/gi) && precedence[ operator ][0] < precedence[ stack[i] ][0]) {
                return true;
            }
        }

        return false;
    }

    function isOperator(token) {
        return token.match(/^\-$|\+|\*|\/|\^/gi);
    }

    function isFunction(token) {
        return keywords.hasOwnProperty(token) && (typeof keywords[token]).match(/Function/gi);
    }

    function cleanUp() {
        output = [];
        stack = [];
    }

    return {
        parse: parse,
        calculate: calculate
    };
})()