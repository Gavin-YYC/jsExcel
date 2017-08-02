// var $ = requrie("jquery");
// var XLSX = require("xlsjs");
// var ExcelToJson = require('./main');

$(function () {

  function handleDragEnter ( e ) {
    $loading.text('松开鼠标！').show();
    e.stopPropagation();
  	e.preventDefault();
  	return false;
  }

  function handleDragOver ( e ) {
    e.stopPropagation();
    e.preventDefault();
    e.originalEvent.dataTransfer.dropEffect = 'copy';
  }

  function handleDragLeave ( e ) {
    e.stopPropagation();
  	e.preventDefault();
  	return false;
  }

  function handleDrop ( e ) {
    $loading.text("文件分析中...");
    e.stopPropagation();
    e.preventDefault();
    var file = e.originalEvent.dataTransfer.files[0];
    var reader = new FileReader();
    var name = file.name;
    reader.onload = function ( e ) {
      $loading.text("正在生成数据...");
      var data = e.target.result;
      var workbook = XLSX.read(data, {type: 'binary'});
      var firstSheetName = workbook.SheetNames[0];
      var firstSheet = workbook.Sheets[ firstSheetName ];
      var sheet = formatSheet( firstSheet, firstSheetName );
      renderTables( sheet );
    }
    reader.readAsBinaryString( file );
  }

  function formatSheet ( firstSheet, firstSheetName ) {
    var sheetLimit = firstSheet["!ref"].split(":");
    var firstCol, lastCol, firstRow, lastRow;
    sheet.sheet = firstSheet;
    sheet.name  = firstSheetName;
    sheet.firstCol = firstCol = sheetLimit[0].substr(0,1).charCodeAt();
    sheet.lastCol  = lastCol  = lastCol  = sheetLimit[1].substr(0,1).charCodeAt();
    sheet.firstRow = firstRow = parseInt(sheetLimit[0].substr(1), 10);
    sheet.lastRow  = lastRow  = parseInt(sheetLimit[1].substr(1), 10);
    return sheet;
  }

  function renderTables ( sheet ) {
    var tpl = '<table class="table table-striped table-bordered table-hover">';
    tpl += '<tr class="title success"><td colspan="' + ( sheet.lastCol - sheet.firstCol + 1 ) + '">' + sheet.name + '</td></tr>'
    for (var row = sheet.firstRow; row <= sheet.lastRow; row++) {
      tpl += '<tr>';
      for (var col = sheet.firstCol; col <= sheet.lastCol; col++) {
        var cell = sheet.sheet[String.fromCharCode( col ) + row];
        if ( !cell || cell == 'undefined' ) cell = {w:""};
        tpl += '<td>' + cell.w + '</td>';
      }
      tpl += '</tr>';
    }
    tpl += '</table>';
    $wrapper.hide();
    $loading.hide();
    $preview.html( tpl );
  }

  var $wrapper = $('.wrapper');
  var $preview = $('.preview .table-result');
  var $loading = $('.loading');
  var sheet = {};

  var $toJSONBtn = $('.to-json');

  $("body").on("dragenter", handleDragEnter)
       .on("dragover", handleDragOver)
       .on("dragleave", handleDragLeave)
       .on("drop", handleDrop);

  $("body,html").on("dragleave", function ( e ) {
    if ( e.originalEvent.pageX == 0 ) {
      $loading.hide();
    }
  });

  $toJSONBtn.on('click', function ( e ) {
    e.preventDefault();
    new ExcelToJson( sheet );
  });
})
