import * as esprima from 'esprima';

let table = [];

const parseCode = (codeToParse) => {
    table = [];
    let json_obj = esprima.parseScript(codeToParse, {loc: true});
    if(json_obj.body[0] != null)
        ParseLine[json_obj.body[0].type](json_obj.body[0]);

    return table;
};

function table_line (line, type, name, condition, value) {
    this.line = line;
    this.type = type;
    this.name = name;
    this.condition = condition;
    this.value = value;
}

const block_statement = (obj) => {
    let j;
    for(j = 0; j <  obj.body.length; j++){
        ParseLine[obj.body[j].type](obj.body[j]);
    }
};

const function_declaration = (obj) => {
    let func_line = new table_line(obj.loc.start.line,obj.type,obj.id.name,null,null);
    table.push(func_line);
    let i;
    for(i = 0; i < obj.params.length; i++){
        let param_line = new table_line(obj.loc.start.line,'VariableDeclaration',obj.params[i].name,null,null);
        table.push(param_line);
    }
    ParseLine[obj.body.type](obj.body);
};

const variable_declaration = (obj) => {
    let i;
    for (i = 0; i < obj.declarations.length; i++) {
        let val;
        if(obj.declarations[i].init == null) {
            val = null;
        }
        else {
            val = ParseExp[obj.declarations[i].init.type](obj.declarations[i].init);
        }
        let variable_line = new table_line(obj.loc.start.line, obj.type, obj.declarations[i].id.name, null, val);
        table.push(variable_line);
    }
};

const right_literal = (obj) => {
    return obj.value;
};

const right_binary = (obj) => {
    return (ParseExp[obj.left.type](obj.left)) + ' ' + obj.operator + ' ' + (ParseExp[obj.right.type](obj.right));
};

const right_identifier = (obj) => {
    return obj.name;
};

const member_expression = (obj) => {
    return (ParseExp[obj.object.type](obj.object)) + '[' + (ParseExp[obj.property.type](obj.property)) + ']';
};

const unary_expression = (obj) => {
    return obj.operator + (ParseExp[obj.argument.type](obj.argument));
};

const array_expression = (obj) => {
    let s = '[';
    let i;
    for(i = 0; i < obj.elements.length - 1; i++){
        s += ParseExp[obj.elements[i].type](obj.elements[i]);
        s += ', ';
    }
    s += ParseExp[obj.elements[i].type](obj.elements[i]);
    s += ']';
    return s;
};

const ParseExp =  {
    'Literal' : right_literal,
    'Identifier' : right_identifier,
    'BinaryExpression' : right_binary,
    'MemberExpression' : member_expression,
    'UnaryExpression' : unary_expression,
    'ArrayExpression' : array_expression

};

const assignment_expression = (obj) =>{
    let assig_line = new table_line(obj.loc.start.line, obj.type, obj.left.name, null, ParseExp[obj.right.type](obj.right));
    table.push(assig_line);
};

const expression_statement = (obj) => {
    assignment_expression(obj.expression);
};

const while_statement = (obj) => {
    let test_line = new table_line(obj.loc.start.line, obj.type, null, ParseExp[obj.test.type](obj.test), null);
    table.push(test_line);
    ParseLine[obj.body.type](obj.body);
};

const if_statement = (obj) => {
    let test_line = new table_line(obj.loc.start.line, obj.type, null, ParseExp[obj.test.type](obj.test), null);
    table.push(test_line);
    ParseLine[obj.consequent.type](obj.consequent);
    if (obj.alternate != null)
        ParseLine[obj.alternate.type](obj.alternate);
};

const return_statement = (obj) => {
    let ret_line = new table_line(obj.loc.start.line, obj.type, null, null, ParseExp[obj.argument.type](obj.argument));
    table.push(ret_line);
};

const update_expression = (obj) => {
    let update_line = new table_line(obj.loc.start.line, obj.type, null, null, ParseExp[obj.argument.type](obj.argument) + obj.operator);
    table.push(update_line);
};

const for_statement = (obj) => {
    let test_line = new table_line(obj.loc.start.line, obj.type, null, ParseExp[obj.test.type](obj.test), null);
    table.push(test_line);
    if (obj.init != null){
        ParseLine[obj.init.type](obj.init);
    }
    ParseLine[obj.update.type](obj.update);
    ParseLine[obj.body.type](obj.body);
};

const for_in_statements = (obj) => {
    let for_in_line = new table_line(obj.loc.start.line, obj.type, null, ParseExp[obj.left.type](obj.left) + ' in ' + ParseExp[obj.right.type](obj.right) , null);
    table.push(for_in_line);
    ParseLine[obj.body.type](obj.body);
};

const ParseLine = {
    'FunctionDeclaration' : function_declaration,
    'VariableDeclaration' : variable_declaration,
    'ExpressionStatement' : expression_statement,
    'WhileStatement' : while_statement,
    'IfStatement' : if_statement,
    'BlockStatement' : block_statement,
    'ReturnStatement' : return_statement,
    'ForStatement' : for_statement,
    'UpdateExpression' : update_expression,
    'AssignmentExpression' : assignment_expression,
    'ForInStatement' : for_in_statements
};

export {parseCode};
