const http = require('http');
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require('mysql');
const ejs = require("ejs");
const _ = require("lodash");
const multer = require('multer');
const serveStatic = require( "serve-static" );
const fs = require('fs');
const app = express();
const xlstojson = require("xls-to-json-lc");
const xlsxtojson = require("xlsx-to-json-lc");
require('dotenv').config()
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
  //multer saves files directly to the server through post in multipart form
var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './public/uploads/')
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
        }
    });
    var upload = multer({ //multer settings
                    storage: storage,
                    // fileFilter : function(req, file, callback) { //file filter
                    //     if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                    //         return callback(new Error('Wrong extension type'));
                    //     }
                    //     callback(null, true);
                    // }
                }).single('file');


var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.PASSWORD,
  multipleStatements: true
});

connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to Database.');
});

connection.query("use gracemarkssystem", function(err, result , fields) {
  if (err) {
    throw err;
    res.send("Opps SQL error");
  }
});

var name="Pranesh";
var FACU_ID;
//--------index-section-----------
app.get('/', (req, res) => {
  //reset all local variables ?? or use seperate get for logout
  res.render("index");
});
app.get('/student-login',(req,res)=>{
    res.render("student-login");
});
app.get('/faculty-login',(req,res)=>{
    res.render("faculty-login");
});


//---------------login-section------------
app.post('/login', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  var type = username.slice(0, 2);
  if(type=="FA"){
    var sql= "select * from FACULTY where ID='"+username+"';"
    connection.query(sql, function(err, result) {
      if (err) {
          throw err;
          res.send("Opps SQL error");
          console.log(err);
      }
      else{
        if(password == result[0].PASSWORD){
          name=result[0].NAME;
          FACU_ID=result[0].ID;
          res.redirect("/teacher-home/"+FACU_ID);
          //res.redirect("/teacher-home");
        }
        else{
           res.send("Wrong ID or password");
        }
      }
    });
  }
  else if(type=="CO"){
    var sql= "select * from COORDINATOR where ID='"+username+"';"
    connection.query(sql, function(err, result) {
      if (err) {
          throw err;
          res.send("Opps SQL error");
          console.log(err);
      }
      else{
        if(password == result[0].PASSWORD){

          res.redirect("/cordinatorhome/"+result[0].ID);
        }
        else{
           res.send("Wrong ID or password")
        }
      }
    });
  }else{
     res.send("No user found")
  }

});

app.post('/stu-login', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  var sql= "select * from STUDENT where ROLLNUM='"+username+"';"
  connection.query(sql, function(err, result) {
    if (err) {
        throw err;
        res.send("Opps SQL error");
        console.log(err);
    }
    else{
      if(password == result[0].PASSWORD){

        res.redirect('/student-home/'+result[0].ROLLNUM);
      }
      else{
         res.send("Wrong password or RollNumber")
      }
    }
  });
});

//------------------faculty-section-------------------

function faculty_name(ID){
  var fac_name;
  var sql="select NAME from FACULTY where ID='"+ID+"';"
  connection.query(sql, function(err, result) {
    if (err) {
        throw err;
        res.send("Opps SQL error");
        console.log(err);
        return ;
    }
    else{
      fac_name = result[0].NAME;
    }
  });
  while(fac_name === undefined) {
    require('deasync').runLoopOnce();
  }
  return fac_name;
}

app.get('/teacher-home/:ID',(req,res)=>{
    var fac_name= faculty_name(req.params.ID);
    res.render("faculty-home",{name:fac_name,id:req.params.ID});

});

app.get('/teacher-home',(req,res)=>{
    res.render("faculty-home",{name:name});
});


app.get('/uploadmarkspage/:ID',(req,res)=>{
    var fac_name= faculty_name(req.params.ID);
    res.render("faculty-upload",{name:fac_name,id:req.params.ID});
});

app.post('/uploadmarks/:ID', function(req, res) {
        var FACU_ID=req.params.ID ;
        var path;
        //var name=req.params.name; get name through form input
        var exceltojson;
        upload(req,res,function(err){
           path=req.file.path;
           _file=req.file.path;
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
            /** Multer gives us file info in req.file object */
            if(!req.file){
                res.json({error_code:1,err_desc:"No file passed"});
                return;
            }
            if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
                 exceltojson = xlsxtojson;
             } else {
                 exceltojson = xlstojson;
             }
             try {
                 exceltojson({
                     input: req.file.path, //the same path where we uploaded our file
                     output: null, //since we don't need output.json
                     lowerCaseHeaders:true
                 }, function(err,result){
                     if(err) {
                         return res.json({error_code:1,err_desc:err, data: null});
                     }
                      result.forEach(function(entry) {
                           // console.log(entry);
                            var _sql="Select * from MARKS where STUD_ID='"+entry.rollno+"'and COURSEID='"+entry.courseid+"'and FACU_ID='"+FACU_ID+"';"
                            connection.query(_sql, function(err, _result) {
                                if (err){
                                   throw err;
                                   console.log(err.sqlMessage);
                                  }
                                else
                                  {
                                       var sql;
                                       if(_result.length==0){
                                          sql = "INSERT INTO MARKS (STUD_ID, COURSEID, MARKS, FACU_ID) VALUES('"+entry.rollno+"','"+entry.courseid+"','"+entry.marks+"','"+FACU_ID+"');"

                                         connection.query(sql, function(err, __result) {
                                              if (err){
                                                 throw err;
                                                 res.send(err)
                                                 console.log(err.sqlMessage);
                                                }
                                              else
                                                {
                                                  console.log("added entry");
                                                 }
                                            });

                                       }else{
                                        sql="UPDATE MARKS SET MARKS="+_result[0].MARKS+" where STUD_ID='"+_result[0].STUD_ID+"'and COURSEID='"+_result[0].COURSEID+"'and FACU_ID='"+FACU_ID+"';"
                                        connection.query(sql, function(err, __result) {
                                             if (err){
                                               res.send()
                                                throw err;
                                                console.log(err.sqlMessage);
                                               }
                                             else
                                               {
                                                 console.log("entry Updated");
                                                }
                                           });
                                       }
                                  }
                                  });
                          });
                    //console.log(path);//find a way to delete the file
                    res.redirect("/marks_view_faculty/"+FACU_ID);
                 });
             } catch (e){
                 res.json({error_code:1,err_desc:"Corupted excel file"});
             }
        })
    });

    app.get('/marks_view_faculty/:ID',(req,res)=>{
      var fac_name= faculty_name(req.params.ID);
      var sql= "select * from marks where FACU_ID='"+req.params.ID+"';"
      connection.query(sql, function(err, result) {
        if (err) {
            throw err;
            res.send("Opps SQL error");
            console.log(err);
        }
        else{
          res.render("faculty-marks-view",{userData:result,name:fac_name,id:req.params.ID});
        }
      });
    });

    app.post('/deletemarks',(req,res)=>{
        var STUD_ID=req.body.STUD_ID;
        var FACU_ID=req.body.FACU_ID;
        var COURSEID=req.body.COURSEID;
        var sql= "delete from marks where FACU_ID='"+FACU_ID+"' and STUD_ID='"+STUD_ID+"' and COURSEID='"+COURSEID+"';"
        console.log(sql);
        connection.query(sql, function(err, result) {
          if (err) {
              throw err;
              res.send("Opps SQL error");
              console.log(err);
          }
          else{
            res.redirect("/marks_view_faculty/"+FACU_ID);
          }
        });
    });

   app.get('/facultygracemarks/:ID',(req,res)=>{
        var fac_name= faculty_name(req.params.ID);
        res.render("faculty-gracemarks",{name:fac_name,id:req.params.ID});    // need to add js for disabling the button

   });
  app.get("/allotgracemarks",(req,res)=>{
    var i=0;
    var sql= "select ROLLNUM from student;"
    connection.query(sql, function(err, result) {
      if (err) {
          throw err;
          console.log(err);
      }
      else{

           for(i = 0; i < result.length;i++){
             var rollnum=result[i].ROLLNUM;
             var markspossible=0
             var sql1="select * from PROOFDOC where ROLLNUM='"+rollnum+"';"
             connection.query(sql1, function(err, result1) {
               if (err) {
                   throw err;
                   res.send("Opps SQL error");
                   console.log(err);
               }
               else{
                   markspossible=0
                  {
                    if(result1.length>0){

                           var temp_roll=result1[0].ROLLNUM;
                           for(var j=0;j<result1.length;j++){
                             if(result1[j]==undefined){
                               continue;
                             }
                             if(result1[j].VERIFIED==1){
                                  if(result1[j].DOCTYPE=="paper"){
                                      markspossible+=4;
                                  }else if(result1[j].DOCTYPE=="services"){
                                     markspossible+=3;
                                  }else if (result1[j].DOCTYPE=="cocurricular") {
                                     markspossible+=3;
                                  }
                              }
                           }

                          console.log(markspossible,result1[0].ROLLNUM);
                         // ---- addednewly
                         while(markspossible === undefined) {
                           require('deasync').runLoopOnce();
                         }
                              //sync problem
                            var _sql="select * from GRACEMARKS where STUD_ID='"+temp_roll+"';"
                            connection.query(_sql, function(err, result) {
                              if (err) {
                                  throw err;
                                  console.log(err);
                              }
                              else{
                                 if(result.length==0){
                                  // console.log(_sql);
                                  _sql="insert into GRACEMARKS values('"+temp_roll+"',"+markspossible+");"
                                  console.log(_sql);
                                  connection.query(_sql, function(err, result) {
                                    if (err) {
                                        throw err;
                                        console.log(err);
                                    }
                                    else{
                                       console.log("successfully gracemarks are added");
                                    }
                                  });
                                 }
                                 else{
                                  // console.log(markspossible,temp_roll);
                                   _sql="UPDATE GRACEMARKS set GRACEMARKS="+markspossible+" where STUD_ID='"+temp_roll+"';"
                                   console.log(_sql);
                                   connection.query(_sql, function(err, result) {
                                     if (err) {
                                         throw err;
                                         console.log(err);
                                     }
                                     else{
                                        console.log("successfully gracemarks are Updated");
                                     }
                                   });
                                 }
                              }
                            });

                        //console.log("outside",markspossible);
                        //---add newly


                           //  console.log(_sql);
                           //  _sql="insert into GRACEMARKS values('"+temp_roll+"',"+markspossible+");"
                           // console.log(_sql);
                           // connection.query(_sql, function(err, result) {
                           //   if (err) {
                           //       throw err;
                           //       console.log(err);
                           //   }
                           //   else{
                           //      console.log("successfully gracemarks are added");
                           //   }
                           // });
                    }
                  }
               }
             });
        }
      }
    });

    res.redirect("/facultygracemarks");
  });

//--------------student-section--------------------------

    app.get('/student-home/:roll',(req,res)=>{
      var sql= "select * from STUDENT where ROLLNUM='"+req.params.roll+"';"
      connection.query(sql, function(err, result) {
        if (err) {
            throw err;
            console.log(err);
        }
        else{
           res.render("student-home",{data:{name:result[0].NAME,roll:result[0].ROLLNUM}});
        }
      });

    });

   app.get("/uploaddoc/:rollno",(req,res)=>{
       var rollno=req.params.rollno;
       var sql="select * from PROOFDOC where rollnum='"+rollno+"';";
       connection.query(sql, function(err, result) {
         if (err) {
             throw err;
             console.log(err);
         }
         else{
           if(result.length==0){
             res.render("student-upload",{filedata:[{ROLLNUM: rollno,DOCTYPE: '',NAME: '',DATE: '',LINK: '',VERIFIED: 0}]});
           }else{
             res.render("student-upload",{filedata:result});
           }

         }
       });
   });


    app.post('/uploaddoc/:type',(req,res)=>{
         upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
            /** Multer gives us file info in req.file object */
            if(!req.file){
                res.json({error_code:1,err_desc:"No file passed"});
                return;
            }
            var type=req.params.type;
            var name=req.file.filename;
            var dt=new Date();
            var date=dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate();
            var link=req.file.path;
            link=link.replace(/\\/g, "/");
            // var _link=__dirname + "/" + req.file.path;
            // _link=_link.replace(/\\/g, "/");
            // console.log(_link);
            var rollno=req.body.rollno;

            var sql = "insert into PROOFDOC (ROLLNUM,DOCTYPE,NAME,DATE,LINK,VERIFIED) values('"+rollno+"','"+type+"','"+name+"','"+date+"','"+link+"',"+false+");"
            console.log(sql);
            connection.query(sql, function(err, result) {
                if (err){
                   throw err;
                   res.send("duplicate entry,File Alredy There");
                   res.render("error", {
                     Error: "Sql insertion error",
                     });
                  }
                else
                   {
                     res.redirect("/uploaddoc/"+rollno);
                   }
              });
         });

    });

    app.post("/docdelete",(req,res)=>{
        var rollno=req.body.rollno;
        var type=req.body.type;
        var sql="DELETE from PROOFDOC where rollnum='"+rollno+"'and DOCTYPE = '"+type+"';";
        console.log(sql);
        connection.query(sql, function(err, result) {
          if (err) {
              throw err;
              console.log(err);
          }
          else{
             console.log("doc deleted");
             res.redirect("/uploaddoc/"+rollno);
          }
        });
    });

//------------------coordinator-section----------------------------------
 var coordinatorname;
 var coordinatortype;
 var coordinatorid;
 app.get("/cordinatorhome/:id",(req,res)=>{
     var sql= "select * from COORDINATOR where ID='"+req.params.id+"';"
     connection.query(sql, function(err, result) {
     if (err) {
         throw err;
         console.log(err);
     }
     else{
          coordinatorname=result[0].NAME;
          coordinatortype=result[0].TYPE;
          coordinatorid=result[0].ID;
          res.render("coordinator-home",{data:{name:coordinatorname,type:coordinatortype,id:coordinatorid}});
     }
   });

 });

  app.get("/recordvrification/:id",(req,res)=>{
    var sql= "select * from COORDINATOR where ID='"+req.params.id+"';"

    connection.query(sql, function(err, result) {
    if (err) {
        throw err;
        console.log(err);
    }
    else{
        res.render("coordinator-verifyrecord",{data: {name:result[0].NAME,id:result[0].ID,type:result[0].TYPE, roll:"", link:"",verified:0}});
    }
  });
});

 app.get("/viewList/:id",(req,res)=>{
   var id=req.params.id;
   var sql= "select * from COORDINATOR where ID='"+id+"';"
   connection.query(sql, function(err, result) {
   if (err) {
       throw err;
       console.log(err);
   }
   else{
        var type=result[0].TYPE;
        var name=result[0].NAME;
        var sql= "select * from PROOFDOC where verified= False and DOCTYPE='"+type+"';"
        connection.query(sql, function(err, result) {
        if (err) {
            throw err;
            console.log(err);
        }
        else{
               res.render("coordinator-viewlist",{userData:result, name:name ,id:id});
        }
      });
   }
 });

 });

  app.get("/afterverification/:data",(req,res)=>{
      console.log("here1");
      console.log(typeof(req.params.data));
      var data=JSON.stringify(req.params.data);
      console.log(data);
      res.render("coordinator-verifyrecord",{data: {type:data.DOCTYPE, roll:data.ROLLNUM, link:data.LINK}});
  });

   app.post("/searchrecord/:id",(req,res)=>{
        var type;
        var _name;
        var roll=req.body.rollno;
        var id=req.params.id;
        var sql= "select * from COORDINATOR where ID='"+id+"';"
        connection.query(sql, function(err, result) {
        if (err) {
            throw err;
            console.log(err);
        }
        else{
            _name=result[0].NAME;
            type=result[0].TYPE;

            var sql="select * from PROOFDOC where rollnum='"+roll+"' and DOCTYPE='"+type+"';";
            //console.log(sql);
            connection.query(sql, function(err, result) {
              if (err) {
                  throw err;
                  console.log(err);
              }
              else{

                if(result.length==0){
                  res.redirect("/recordvrification/"+id);   // send result
                }else{
                   res.render("coordinator-verifyrecord",{data: {name:_name,id:id,type:result[0].DOCTYPE, roll:roll, link:result[0].LINK,verified:result[0].VERIFIED}});

                }
              }
            });
        }
      });
   });

   app.post("/getFile",(req,res)=>{
   //   var roll=req.body.roll;
   //   var type=req.body.type;
   //   console.log(req.body); // get type and rollnum to query about link
   //   var sql="select * from PROOFDOC where rollnum='"+roll+"' and DOCTYPE='"+type+"';";
   //   connection.query(sql, function(err, result) {
   //   if (err) {
   //       throw err;
   //       console.log(err);
   //   }
   //   else{
   //       var link=result[0].LINK;
   //       var path=+"./" + link;
   //       var data =fs.readFileSync(path,{encoding: 'base64'});
   //       res.contentType("application/pdf");
   //       res.send(data);
   //   }
   // });

   var data =fs.readFileSync('./public/uploads/file-1617452609811.pdf',{encoding: 'base64'});
   res.contentType("application/pdf");
   res.send(data);

});

   app.post("/verifydoc/:id",(req,res)=>{
     var id=req.params.id;
     var sql= "select * from COORDINATOR where ID='"+id+"';"
     connection.query(sql, function(err, result) {
     if (err) {
         throw err;
         console.log(err);
     }
     else{
       var roll=req.body.roll;
       var type=result[0].TYPE;

       if(req.body.verified){
         var sql="UPDATE PROOFDOC SET VERIFIED="+true+" where rollnum='"+roll+"' and DOCTYPE='"+type+"';"
        // console.log(sql);
         connection.query(sql, function(err, result) {
           if (err) {
               throw err;
               console.log(err);
           }
           else{
              console.log("successfully record verified"); // maybe send result
              res.redirect("/recordvrification/"+id);
           }
         });
       }else{
         res.redirect("/recordvrification/"+id); // send responce ?
       }

     }
   });
  });


//------------------test---------------------------------------------------
   app.get("/test",(req,res)=>{
    res.render("coordinator-verifyrecord",{data: {type:req.params.type, roll:"", link:""}})
   });


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
