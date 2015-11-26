var Shunt = require('../src/shunting_yard');

describe('Convert to RPN', function () {
    it('can parse 3 * 4 + 1', function () {
        expect(Shunt.parse('3 * 4 + 1')).toEqual([3,4,'*',1,'+']);
    });

    it('can parse 4 * 5 + 2 * 3 - 2 / 2', function () {
        expect(Shunt.parse('4 * 5 + 2 * 3 - 2 / 2')).toEqual([4,5,'*',2,3,'*','+',2,2,'/','-']);
    });

    it('can parse 4 * (2 + 1)', function () {
        expect(Shunt.parse('4 * ( 2 + 1 )')).toEqual([4,2,1,'+','*']);
    });

    it('throw error when parse 4 * ( 2 + 1 ) )', function () {
        expect(function () {
            Shunt.parse('4 * ( 2 + 1 ) )');
        }).toThrow(new Error('Parenthese Mismatched'));
    });

    it('throw error when parse 4 * ( 2 + 1', function () {
        expect(function () {
            Shunt.parse('4 * ( 2 + 1');
        }).toThrow(new Error('Parenthese Mismatched'));
    });

    it('can parse 4 * ( 2 * ( 3 - 1 ) + 1 )', function () {
        expect(Shunt.parse('4 * ( 2 * ( 3 - 1 ) + 1 )')).toEqual([4,2,3,1,'-','*',1,'+','*']);
    });

    it('can parse 4 ^ 2 ^ 2 * ( 2 * ( 3 - 1 ) + 1 )', function () {
        expect(Shunt.parse('4 ^ 2 ^ 2 * ( 2 * ( 3 - 1 ) + 1 )')).toEqual([4,2,2,'^','^',2,3,1,'-','*',1,'+','*']);
    });

    
});