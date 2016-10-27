// 表格数据转JSON

var ExcelToJson = function ( sheet ) {
  this.headeInfo = [];  // 表格头部信息
  this.checkedHeadInfo = [];  // 选中的头部信息
  this.rawSheet  = null;
  this.jsonSheet = null;

  this.postData = {
    skuList: []
  };

  // 表格的字段与json的字段对应
  this.MAP = {
    "销售码": "mainSkuList",
    "备品": "replaceSkuList"
  };

  this.init( sheet );
}


ExcelToJson.prototype = {

  init: function ( sheet ) {
    this.initHeadLine( sheet );
    this.rawSheet2JSON( sheet );
    this.confirmPostData();
  },


  // 初始化标题栏
  initHeadLine: function ( sheet ) {
    for (var col = sheet.firstCol; col <= sheet.lastCol; col++) {
      this.headeInfo.push(sheet.sheet[String.fromCharCode( col ) + 1]);
    }
  },

  // 原始数据转成JSON数据
  rawSheet2JSON: function ( sheet ) {
    this.rawSheet = sheet;
    this.jsonSheet = XLSX.utils.sheet_to_json( sheet.sheet );
  },

  // 确认需要传输的数据，这里只是skuId以及备品的skuId
  confirmPostData: function () {
    var $confirmModal = $('.check-post-data').modal('show');
    var $preview = $confirmModal.find(".preview-area");
    var $body = $confirmModal.find(".check-area");
    var tpl = '';
    var emptyObj = {};
    var that = this;
    var data = $.extend(true, {}, this.postData);
    that.preview( $preview, data );  // JSON 预览

    // 生成预览标题
    $.each(that.headeInfo, function ( index, item ) {
       tpl += '<label class="checkbox-inline">' +
                  '<input type="checkbox" class="heade-info" value="' + item.w + '"> ' + item.w + '' +
              '</label>';
    });

    // 选中输入框时，进入数据预览
    $body.html( tpl ).on('change', '.heade-info', function ( e ) {
      var tar = e.target;
      if ( tar.checked ) {
        emptyObj[tar.value] = [];
        data.skuList[0] = emptyObj;
      } else {
        delete data.skuList[0][tar.value];
      }
      that.preview( $preview, data );  // JSON 预览
    });

    // 保存用户的选择信息
    $confirmModal.find('.set-head-info').on('click', function ( e ) {
      var $checked = $body.find('.heade-info:checked');
      that.checkedHeadInfo = $checked.map( function ( index, item ) {
        return item.value;
      });
      that.checkedHeadInfo = that.checkedHeadInfo.toArray();
      $confirmModal.modal('hide');
      that.createJSON();
    });
  },

  // JSON预览
  preview: function ( ele, data, space ) {
    ele.find('pre').text(JSON.stringify(data, null, space || 4));
  },

  // 生成JSON数据
  createJSON: function () {
    var that = this;
    var data = this.postData;
    $.each(that.jsonSheet, function ( index, sheetItem ) {
      var emptyObj = {};
      $.each(that.checkedHeadInfo, function ( index2, checkedItem ) {
        var data = sheetItem[checkedItem].split(',');
        emptyObj[that.MAP[checkedItem]] = data;
      });
      data.skuList.push( emptyObj );
    });
    that.writeJSONFile(JSON.stringify(this.postData, null, 4), "text/latex", "result.json");
  },

  // 将JSON信息写入文件中
  writeJSONFile: function (value, type, name) {
    var blob;
    if (typeof window.Blob == "function") {
        blob = new Blob([value], {type: type});
    } else {
        var BlobBuilder = window.BlobBuilder || window.MozBlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder;
        var bb = new BlobBuilder();
        bb.append(value);
        blob = bb.getBlob(type);
    }
    var URL = window.URL || window.webkitURL;
    var bloburl = URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    if ('download' in anchor) {
        anchor.style.visibility = "hidden";
        anchor.href = bloburl;
        anchor.download = name;
        document.body.appendChild(anchor);
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, true);
        anchor.dispatchEvent(evt);
        document.body.removeChild(anchor);
    } else if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, name);
    } else {
        location.href = bloburl;
    }
  },

  // 确认额外的数据
  confirmExtendData: function () {

  },

  constructor: ExcelToJson
}
