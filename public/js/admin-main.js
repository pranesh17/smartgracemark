function changeColor(self) {
    $("div").removeClass("active-sub-function");
    $(self).addClass("active-sub-function");
}

function updateForm(val){
    var elem1 = document.getElementById("electiveID");
    var elem2 = document.getElementById("projector");
    var elem3 = document.getElementById("labIncharge");

    if (val == 'Elective' ){
        elem1.style.display = "block";
    }else if(val == 'Classroom'){
        elem2.style.display = "block";
        elem3.style.display = "none";
    }else if(val == 'Lab'){
        elem3.style.display = "block";
        elem2.style.display = "none";
    }
    else{
        elem1.style.display = "none";

    }
}

function changeContent(id) {
    $("form").trigger("reset");
    if(document.getElementById("welcome")) document.getElementById("welcome").style.display = "none";
    changeColor(document.getElementById(id));
    
    document.getElementById("admin-add-content").style.display = "none";
    document.getElementById("dept-add-content").style.display = "none";
    document.getElementById("faculty-add-content").style.display = "none";
    document.getElementById("course-add-content").style.display = "none";
    document.getElementById("section-add-content").style.display = "none";
    document.getElementById("resources-add-content").style.display = "none";


    document.getElementById("faculty-update-content").style.display = "none";
    document.getElementById("section-update-content").style.display = "none";
    document.getElementById("course-update-content").style.display = "none";

    document.getElementById("faculty-delete-content").style.display = "none";
    document.getElementById("course-delete-content").style.display = "none";
    document.getElementById("section-delete-content").style.display = "none";

    document.getElementById("faculty-replace-content").style.display = "none";

    document.getElementById(id + '-content').style.display = "block";
}