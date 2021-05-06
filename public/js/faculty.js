

$(document).ready(function(){
  if($("#welcome").find("#marks-uploaded").is(":checked")==false){
      $("#welcome").find('a').css("pointer-events", "none");
      $("#welcome").find('a').css("color", "red");
   }
   $("#welcome").find("#marks-uploaded").click(function(){
     if($("#welcome").find("#marks-uploaded").is(":checked")==true){
         $("#welcome").find('a').css("pointer-events", "auto");
         $("#welcome").find('a').css("color", "white");
      }
      else if ($("#welcome").find("#marks-uploaded").is(":checked")==false) {
        $("#welcome").find('a').css("pointer-events", "none");
        $("#welcome").find('a').css("color", "red");
      }
  });
});
