module.exports = (function () {
    'use stricts';
    var precedence = {
        '+' : [2, 'Left'],
        '-' : [2, 'Left'],
        '*' : [3, 'Left'],
        '/' : [3, 'Left'],
        '^' : [4, 'Right']
    };

    var patterns = '\\w|\\\+|\\\-|\\\*|\\\/|\\\(|\\\)|\\\^';

    var keywords = {
        sqrt: '',
    };

    var output = [],
        stack = [];

    function parse(tokenStr) {
        var tokenized,
            token,
            tmp,
            result,
            i = 0;
        
        var pattern = combinePattern();

        tokenized = tokenStr.match(pattern);

        while (tokenized.length > 0) {
            token = tokenized.shift();

            if (isOperator(token)) {

                while (haveGreaterOperator(token)) {
                    output.push(stack.pop());
                }

                stack.push(token);
            } else if (token.match(/\(/)) {
                stack.push(token);
            } else if (token.match(/\)/)) {
                // find matched parenthese
                while (true) {
                    tmp = stack.pop();

                    if (tmp.match(/\(/)) {
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

    function combinePattern() {
        var result = patterns;

        for (var keyword in keywords) {
            result = keyword + '|' + result;
        }

        return new RegExp(result, 'gi');
    }

    function haveGreaterOperator(operator) {
        var count = stack.length;

        for (var i = count - 1; i >= 0; --i) {
            if (stack[i].match(/\(/)) return false;

            if (precedence[operator][1].match(/Left/) && precedence[operator][0] <= precedence[ stack[i] ][0]) {
                return true;
            }

            if (precedence[operator][1].match(/Right/) && precedence[operator][0] < precedence[ stack[i] ][0]) {
                return true;
            }
        }

        return false;
    }

    function isOperator(token) {
        return token.match(/\+|\-|\+|\*|\/|\^/gi);
    }

    function cleanUp() {
        output = [];
        stack = [];
    }

    return {
        parse: parse
    };
})()