
$(document).ready(function(){
  console.log($('.paper').find('h6').is(':empty'));
  console.log($('.activities').find('h6').is(':empty'));
  console.log($('.service').find('h6').is(':empty'));
   if($('.paper').find('h5').text().length<=5){  //find different approch
      $(".paper").hide();
    }else{
      $('.pap').find('button').attr("disabled", true);

    }

    if($('.activities').find('h5').text().length<=5){
          $(".activities").hide();
        }else{
               $('.cocur').find('button').attr("disabled", true);
        }

    if($('.service').find('h5').text().length<=5){
          $(".service").hide();
        }else{
              $('.ser').find('button').attr("disabled", true);
        }
});
