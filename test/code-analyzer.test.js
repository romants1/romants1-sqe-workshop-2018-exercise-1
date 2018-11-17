import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('is parsing an let exp correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 5')),
            '[{"line":1,"type":"VariableDeclaration","name":"a","condition":null,"value":5}]'
        );
    });

    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function binarySearch(X, V, n){}')),
            '[{"line":1,"type":"FunctionDeclaration","name":"binarySearch","condition":null,"value":null},{"line":1,"type":"VariableDeclaration","name":"X","condition":null,"value":null},{"line":1,"type":"VariableDeclaration","name":"V","condition":null,"value":null},{"line":1,"type":"VariableDeclaration","name":"n","condition":null,"value":null}]'
        );
    });

    it('is parsing an empty code correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '[]'
        );
    });

    it('is parsing an simple while', () => {
        assert.equal(
            JSON.stringify(parseCode('while (low <= high)' +
                '{mid = (low + high)/2;}')),
            '[{"line":1,"type":"WhileStatement","name":null,"condition":"low <= high","value":null},{"line":1,"type":"AssignmentExpression","name":"mid","condition":null,"value":"low + high / 2"}]'
        );
    });

    it('is parsing an simple if', () => {
        assert.equal(
            JSON.stringify(parseCode('if (X < V[mid])\n' +
                '            high = mid - 1;\n' +
                '        else if (X > V[mid])\n' +
                '            low = mid + 1;')),
            '[{"line":1,"type":"IfStatement","name":null,"condition":"X < V[mid]","value":null},{"line":2,"type":"AssignmentExpression","name":"high","condition":null,"value":"mid - 1"},{"line":3,"type":"IfStatement","name":null,"condition":"X > V[mid]","value":null},{"line":4,"type":"AssignmentExpression","name":"low","condition":null,"value":"mid + 1"}]'
        );
    });

    it('is parsing a simple return statement', () => {
        assert.equal(
            JSON.stringify(parseCode('function abc(){return -1}')),
            '[{"line":1,"type":"FunctionDeclaration","name":"abc","condition":null,"value":null},{"line":1,"type":"ReturnStatement","name":null,"condition":null,"value":"-1"}]'
        );
    });

    it('is parsing a function with a few statements', () => {
        assert.equal(
            JSON.stringify(parseCode('function binarySearch(){\n' +
                '    let low, high, mid;\n' +
                '    low = 0;\n' +
                '    high = n - 1;}')),
            '[{"line":1,"type":"FunctionDeclaration","name":"binarySearch","condition":null,"value":null},{"line":2,"type":"VariableDeclaration","name":"low","condition":null,"value":null},{"line":2,"type":"VariableDeclaration","name":"high","condition":null,"value":null},{"line":2,"type":"VariableDeclaration","name":"mid","condition":null,"value":null},{"line":3,"type":"AssignmentExpression","name":"low","condition":null,"value":0},{"line":4,"type":"AssignmentExpression","name":"high","condition":null,"value":"n - 1"}]'
        );
    });

    it('is parsing a for statement', () => {
        assert.equal(
            JSON.stringify(parseCode('for (let i = 0; i < 5; i++){};')),
            '[{"line":1,"type":"ForStatement","name":null,"condition":"i < 5","value":null},{"line":1,"type":"VariableDeclaration","name":"i","condition":null,"value":0},{"line":1,"type":"UpdateExpression","name":null,"condition":null,"value":"i++"}]'
        );
    });

    it('is parsing a for statement', () => {
        assert.equal(
            JSON.stringify(parseCode('for(; i < 5; i++){}')),
            '[{"line":1,"type":"ForStatement","name":null,"condition":"i < 5","value":null},{"line":1,"type":"UpdateExpression","name":null,"condition":null,"value":"i++"}]'
        );
    });

    it('is parsing a for in statement', () => {
        assert.equal(
            JSON.stringify(parseCode('for(a in array){}')),
            '[{"line":1,"type":"ForInStatement","name":null,"condition":"a in array","value":null}]'
        );
    });

    it('is parsing an array expression', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = [1, 2 ,3]')),
            '[{"line":1,"type":"VariableDeclaration","name":"a","condition":null,"value":"[1, 2, 3]"}]'
        );
    });

    it('is parsing a simple if expression', () => {
        assert.equal(
            JSON.stringify(parseCode('if(a == 5){ a = 6}')),
            '[{"line":1,"type":"IfStatement","name":null,"condition":"a == 5","value":null},{"line":1,"type":"AssignmentExpression","name":"a","condition":null,"value":6}]'
        );
    });

    it('is parsing an assignment expression', () => {
        assert.equal(
            JSON.stringify(parseCode('a = b')),
            '[{"line":1,"type":"AssignmentExpression","name":"a","condition":null,"value":"b"}]'
        );
    });


});
