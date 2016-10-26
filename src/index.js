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
      renderTables( firstSheet, firstSheetName );
    }
    reader.readAsBinaryString( file );
  }

  function renderTables ( sheet, name ) {
    var sheetLimit = sheet["!ref"].split(":");
    var firstCol = sheetLimit[0].substr(0,1).charCodeAt();
    var lastCol  = sheetLimit[1].substr(0,1).charCodeAt();
    var firstRow = parseInt(sheetLimit[0].substr(1), 10);
    var lastRow  = parseInt(sheetLimit[1].substr(1), 10);
    var tpl = '<table class="table table-striped table-bordered table-hover">';
    tpl += '<tr class="title success"><td colspan="' + ( lastCol - firstCol + 1 ) + '">' + name + '</td></tr>'
    for (var row = firstRow; row <= lastRow; row++) {
      tpl += '<tr>';
      for (var col = firstCol; col <= lastCol; col++) {
        var cell = sheet[String.fromCharCode( col ) + row];
        if ( !cell ) cell = {v:""};
        tpl += '<td>' + cell.v + '</td>';
      }
      tpl += '</tr>';
    }
    tpl += '</table>';
    $wrapper.hide();
    $loading.hide();
    $preview.html( tpl );
  }

  var $wrapper = $('.wrapper');
  var $preview = $('.preview');
  var $loading = $('.loading');

  $("body").on("dragenter", handleDragEnter)
       .on("dragover", handleDragOver)
       .on("dragleave", handleDragLeave)
       .on("drop", handleDrop);

  $("body,html").on("dragleave", function ( e ) {
    if ( e.originalEvent.pageX == 0 ) {
      $loading.hide();
    }
  })
})
