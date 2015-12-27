var Shunt = require('../src/shunting_yard');

describe('Convert to RPN', function () {
    it('can parse 3 * 4 + 1', function () {
        expect(Shunt.parse('3 * 4 + 1')).toEqual([3,4,'*',1,'+']);
    });

    it('can parse 12 + 1', function () {
        expect(Shunt.parse('12 + 1')).toEqual([12,1,'+']);
    });

    it('can parse negative number in -12 + 1', function () {
        expect(Shunt.parse('-12 + 1')).toEqual([-12,1,'+']);
    });

    it('can parse 4 * 5 + 2 * 3 - 2 / 2', function () {
        expect(Shunt.parse('4 * 5 + 2 * 3 - 2 / 2')).toEqual([4,5,'*',2,3,'*','+',2,2,'/','-']);
    });

    it('can parse group in 4 * (2 + 1)', function () {
        expect(Shunt.parse('4 * ( 2 + 1 )')).toEqual([4,2,1,'+','*']);
    });

    it('can parse group at the beginning of ( 4 + 1 )', function () {
        expect(Shunt.parse('( 4 + 1 )')).toEqual([4,1,'+']);
    });

    it('throw error when parse 4 * ( 2 + 1 ) )', function () {
        expect(function () {
            Shunt.parse('4 * ( 2 + 1 ) )');
        }).toThrow(new Error('Parenthese Mismatched'));
    });

    it('throw error when parse 4 * ( ( 2 + ) 1 )', function () {
        expect(function () {
            Shunt.parse('4 * ( ( 2 + ) 1 )');
        }).toThrow(new Error('Invalid Expression'));
    });

    it('throw error when parse 4 * ( ( ) 1 )', function () {
        expect(function () {
            Shunt.parse('4 * ( ( ) 1 )');
        }).toThrow(new Error('Invalid Expression'));
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

    it('can parse sqrt function in 4 * sqrt ( 2 + 1 ) + 3', function () {
        expect(Shunt.parse('4 * sqrt ( 2 + 1 ) + 3')).toEqual([4,2,1,'+','sqrt','*', 3,'+']);
    });

    it('can parse nested sqrt function in 4 * sqrt ( sqrt ( 2 + 1 ) ) + 3', function () {
        expect(Shunt.parse('4 * sqrt ( sqrt ( 2 + 1 ) ) + 3')).toEqual([4,2,1,'+','sqrt','sqrt','*', 3,'+']);
    });

    it('can parse nested sqrt and abs function 4 * sqrt ( sqrt ( 2 + abs ( 1 + 3 ) ) ) + abs ( 3 + 2 )', function () {
        expect(Shunt.parse('4 * sqrt ( sqrt ( 2 + abs ( 1 + 3 ) ) ) + abs ( 3 + 2 )')).toEqual([4,2,1,3,'+','abs','+','sqrt','sqrt','*',3,2,'+','abs','+']);
    });

    it('can parse 4 * sqrt ( sqrt ( 2 + abs ( 1 + 3 ) ) ) + abs ( 3 + 2 )', function () {
        expect(Shunt.parse('4 * sqrt ( sqrt ( 2 + abs ( 1 + 3 ) ) ) + abs ( 3 + 2 )')).toEqual([4,2,1,3,'+','abs','+','sqrt','sqrt','*',3,2,'+','abs','+']);
    });

    it('can parse decimal in 3.2 + 2', function () {
        expect(Shunt.parse('3.2 + 2')).toEqual([3.2,2,'+']);
    })
});

describe("Calculate based on RPN", function() {
    it('can calculate 3 + 2 + 1', function () {
        expect(Shunt.calculate('3 + 2 + 1')).toEqual(6);
    });

    it('can calculate 9 + 3 - 2', function () {
        expect(Shunt.calculate('9 + 3 - 2')).toEqual(10);
    });

    it('can calculate 12 + 3', function () {
        expect(Shunt.calculate('12 + 3')).toEqual(15);
    });

    it('can calculate 3 * 2 + 1', function () {
        expect(Shunt.calculate('3 * 2 + 1')).toEqual(7);
    });

    it('can calculate 3 ^ 2 + 1', function () {
        expect(Shunt.calculate('3 ^ 2 + 1')).toEqual(10);
    });

    it('can calculate 3 ^ 2 ^ 1 * 3', function () {
        expect(Shunt.calculate('3 ^ 2 ^ 1 * 3')).toEqual(27);
    });

    it('can calculate 3 + sqrt ( 3 + 1 ) * 2', function () {
        expect(Shunt.calculate('3 + sqrt ( 3 + 1 ) * 2')).toEqual(7);
    });
});

