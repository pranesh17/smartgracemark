

$(document).ready(function(){
  if($('.verificationBody').find('a').attr('href').length<=5){
      $(".verificationBody").hide();
  }
});


$('#GetFile').on('click', function () {
  var rollnum=$('#roll').attr('href');
  var type=$('#type').attr('href');
  console.log($('#roll').attr('href'));
  console.log($('#type').attr('href'));
  var data={ roll : rollnum, type : type }
  $.ajax({
      url: "/getFile",
      type: "POST",
      data:data,
      success: function (data) {
          // console.log(data);
          // var b64 = window.btoa(unescape(encodeURIComponent(data)))
          // console.log(b64);
          var atobData = atob(data);
          var num = new Array(atobData.length);
          for (var i = 0; i < atobData.length; i++) {
              num[i] = atobData.charCodeAt(i);
          }
          var pdfData = new Uint8Array(num);

          //var blob = new Blob([pdfData], { type: 'text/plain' });
          blob = new Blob([pdfData], { type: 'application/pdf;base64' });
          var url = URL.createObjectURL(blob);
          window.open(url);
      }
  });
});
