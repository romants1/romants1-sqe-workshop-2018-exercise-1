import $ from 'jquery';
import {parseCode} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let columns = ['line','type','name','condition','value'];
        let table = document.getElementById('table1');
        table.innerHTML = '';
        let tableRow = table.insertRow(-1);
        for (let i = 0; i < columns.length; i++) {
            let tableHeader = document.createElement('th');
            tableHeader.innerHTML = columns[i];
            tableRow.appendChild(tableHeader);}
        for (let i = 0; i <parsedCode.length; i++) {
            tableRow = table.insertRow(-1);
            for (let j = 0; j < columns.length; j++) {
                let tabCell = tableRow.insertCell(-1);
                tabCell.innerHTML = parsedCode[i][columns[j]];}
        }
    });
});
