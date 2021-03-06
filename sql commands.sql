use GraceMarksSystem;
CREATE TABLE STUDENT (ROLLNUM VARCHAR(15) PRIMARY KEY, PASSWORD VARCHAR(15) NOT NULL, NAME VARCHAR(20) NOT NULL, DEPT VARCHAR(15) NOT NULL, YEAR INTEGER NOT NULL, SECTION VARCHAR(1) NOT NULL, EMAIL VARCHAR(25));
CREATE TABLE FACULTY (ID VARCHAR(15) PRIMARY KEY, PASSWORD VARCHAR(15) NOT NULL, NAME VARCHAR(20) NOT NULL, DEPT VARCHAR(15) NOT NULL, YEAR INTEGER NOT NULL, SECTION VARCHAR(1) NOT NULL);
CREATE TABLE MARKS (STUD_ID VARCHAR(15) NOT NULL, COURSEID VARCHAR(10) NOT NULL, MARKS FLOAT NOT NULL,FACU_ID VARCHAR(15) NOT NULL, CONSTRAINT MARKS_PK PRIMARY KEY(STUD_ID, COURSEID,FACU_ID));
CREATE TABLE GRACEMARKS(STUD_ID VARCHAR(15) PRIMARY KEY, GRACEMARKS INTEGER, CHECK (GRACEMARKS<=10));
CREATE TABLE COURSE(ID VARCHAR(10) PRIMARY KEY, CREDITS INTEGER);
CREATE TABLE COORDINATOR(ID VARCHAR(15) PRIMARY KEY, PASSWORD VARCHAR(15) NOT NULL, NAME VARCHAR(15) NOT NULL, TYPE VARCHAR(15) NOT NULL);
CREATE TABLE PROOFDOC(ROLLNUM VARCHAR(15) NOT NULL, DOCTYPE VARCHAR(15) NOT NULL, NAME VARCHAR(50) NOT NULL, DATE VARCHAR(10) NOT NULL, LINK VARCHAR(80) NOT NULL, VERIFIED boolean default false, PRIMARY KEY(ROLLNUM, DOCTYPE));
CREATE TABLE EXAMOFFICER(ID VARCHAR(15) PRIMARY KEY, PASSWORD VARCHAR(15), NAME VARCHAR(20));
CREATE TABLE GRADE(GRADE VARCHAR(2) PRIMARY KEY, MINMARK FLOAT NOT NULL, MAXMARK FLOAT NOT NULL, POINTS FLOAT NOT NULL);
CREATE TABLE RESULTS(STUD_ID VARCHAR(15) NOT NULL, COURSEID VARCHAR(10) NOT NULL, GRADE VARCHAR(2), PRIMARY KEY(STUD_ID, COURSEID));
CREATE TABLE SGPA(STUD_ID VARCHAR(15) PRIMARY KEY, SGPA FLOAT);

INSERT INTO STUDENT VALUES('STENU4CSE18001', 'axite1234', 'Aakash', 'ComputerScience', 3, 'A', 'aakash0422@gmail.com');
INSERT INTO STUDENT VALUES('STENU4CSE18002', 'eober2345', 'Abhinaya', 'ComputerScience', 3, 'A', 'abhinew122@gmail.com');
INSERT INTO STUDENT VALUES('STENU4CSE18003', 'brasx3456', 'Aashish', 'ComputerScience', 3, 'A', 'ash455@gmail.com');

INSERT INTO STUDENT VALUES('STENU4CSE18101', 'floop1226', 'Baskar', 'ComputerScience', 3, 'B', 'baski@gmail.com');
INSERT INTO STUDENT VALUES('STENU4CSE18102', 'weaaz1789', 'Basheer', 'ComputerScience', 3, 'B', 'bashhh45@gmail.com');
INSERT INTO STUDENT VALUES('STENU4CSE18103', 'mloon3571', 'Bheem', 'ComputerScience', 3, 'B', 'bheemrox@gmail.com');

INSERT INTO STUDENT VALUES('STENU4MEE18001', 'swqar8346', 'Charu', 'Mechanical', 3, 'A', 'charu7889@gmail.com');
INSERT INTO STUDENT VALUES('STENU4MEE18002', 'byqma2214', 'Chaithanya', 'Mechanical', 3, 'A', 'chaiths2234@gmail.com');
INSERT INTO STUDENT VALUES('STENU4MEE18003', 'lisnm1736', 'Catherine', 'Mechanical', 3, 'A', 'cathy1564@gmail.com');

INSERT INTO FACULTY VALUES('FACSE14001', 'qwert1987', 'Rakesh', 'ComputerScience', 3, 'A');
INSERT INTO FACULTY VALUES('FACSE14002', 'bnmwe2098', 'Rani', 'ComputerScience', 3, 'A');
INSERT INTO FACULTY VALUES('FACSE14003', 'malir2745', 'Roopa', 'ComputerScience', 3, 'B');
INSERT INTO FACULTY VALUES('FACSE14004', 'alour3791', 'Shivakumar', 'ComputerScience', 3, 'B');
INSERT INTO FACULTY VALUES('FAMEE14001', 'yuiop1147', 'Surya', 'Mechanical', 3, 'A');
INSERT INTO FACULTY VALUES('FAMEE14002', 'gesvu6924', 'Supriya', 'Mechanical', 3, 'A');

INSERT INTO COORDINATOR VALUES('COCSE14101','axlle1234','Roopesh','paper');
INSERT INTO COORDINATOR VALUES('COCSE14102','bdesa4532','Anisha','paper');
INSERT INTO COORDINATOR VALUES('COPED14101','rivan2155','Vikram','cocurricular');
INSERT INTO COORDINATOR VALUES('COPED14102','ammaq1211','Poorna','cocurricular');
INSERT INTO COORDINATOR VALUES('COCUL14101','abees2255','Veera','services');
INSERT INTO COORDINATOR VALUES('COCUL14102','hjkli8907','Karnan','services');

INSERT INTO COURSE VALUES('15CSE311',4);
INSERT INTO COURSE VALUES('15CSE386',1);
INSERT INTO COURSE VALUES('15CSE312',3);
INSERT INTO COURSE VALUES('15CSE313',2);
INSERT INTO COURSE VALUES('15CSE432',3);

INSERT INTO COURSE VALUES('15MEE321',4);
INSERT INTO COURSE VALUES('15MEE316',1);
INSERT INTO COURSE VALUES('15MEE312',3);
INSERT INTO COURSE VALUES('15MEE315',2);
INSERT INTO COURSE VALUES('15MEE412',3);

insert into PROOFDOC (ROLLNUM,DOCTYPE,NAME,DATE,LINK,VERIFIED) values("123","paper","proff.pdf","12/3/4","a/s/d/f.pdf",false);
insert into PROOFDOC (ROLLNUM,DOCTYPE,NAME,DATE,LINK,VERIFIED) values('126','paper','file-1617377145901.xlsx','2021/4/2','public\uploads\file-1617377145901.xlsx',false);
insert into PROOFDOC (ROLLNUM,DOCTYPE,NAME,DATE,LINK,VERIFIED) values("123","service","proff1.pdf","12/3/4","a/s/d/f1.pdf",false);

INSERT INTO EXAMOFFICER VALUES('EAOF210001','adghj4522','Abhay');
INSERT INTO EXAMOFFICER VALUES('EAOF210002','kliij6987','Avinash');
INSERT INTO EXAMOFFICER VALUES('EAOF210003','miwqe7536','Aparna');
-- temporary

INSERT INTO GRACEMARKS VALUES('STENU4CSE18001',8);
INSERT INTO GRACEMARKS VALUES('STENU4CSE18002',9);
INSERT INTO GRACEMARKS VALUES('STENU4CSE18003',6);

update GRACEMARKS set GRACEMARKS=8 where STUD_ID='STENU4CSE18001';
update GRACEMARKS set GRACEMARKS=9 where STUD_ID='STENU4CSE18002';
update GRACEMARKS set GRACEMARKS=6 where STUD_ID='STENU4CSE18003';
-- temporary


select * from PROOFDOC ;
select * from PROOFDOC where rollnum='112' and DOCTYPE='paper';
insert into PROOFDOC (ROLLNUM,DOCTYPE,NAME,DATE,LINK,VERIFIED) values('112','paper','file-1617432251991.xlsx','2021/4/3','public\uploads\file-1617432251991.xlsx',false);

UPDATE PROOFDOC SET VERIFIED=true where rollnum='112' and DOCTYPE='paper';
delete from marks;
drop table PROOFDOC;
select ROLLNUM from student;
select * from results where STUD_ID="STENU4CSE18001";
select * from PROOFDOC where rollnum='STENU4CSE18001';
select * from PROOFDOC where verified=False and DOCTYPE='paper';
UPDATE COORDINATOR SET DOCTYPE="cocurricular" where DOCTYPE="cocaricular";
select * from marks ;
select * from GRACEMARKS;


UPDATE STUDENT SET PASSWORD= 'xisdylp' where ROLLNUM='STENU4CSE18101';

select * from EXAMOFFICER;
select * from FACULTY;
select * from COORDINATOR;
select * from STUDENT;
select * from GRACEMARKS;
