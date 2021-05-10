


$(document).ready(function(){
  if($("#welcome").find("#Resultscomputed").is(":checked")==false){
      $("#publish").find('a').css("pointer-events", "none");
      $("#publish").find('a').css("color", "red");
   }
   $("#welcome").find("#Resultscomputed").click(function(){
     if($("#welcome").find("#Resultscomputed").is(":checked")==true){
         $("#publish").find('a').css("pointer-events", "auto");
         $("#publish").find('a').css("color", "white");
      }
      else if ($("#welcome").find("#Resultscomputed").is(":checked")==false) {
        $("#publish").find('a').css("pointer-events", "none");
        $("#publish").find('a').css("color", "red");
      }
  });
});
