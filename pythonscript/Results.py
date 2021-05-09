import mysql.connector
import os
from dotenv import load_dotenv
load_dotenv()
password = os.getenv('PASSWORD')

mydb = mysql.connector.connect(host="127.0.0.1", user="root", password=password, database="GraceMarksSystem")
mydb.autocommit=True
mycursor = mydb.cursor()


    # GATHERING ALL STUDENTS" DETAILS
mycursor.execute("SELECT STUDENT.ROLLNUM FROM STUDENT;")
students = mycursor.fetchall()

mycursor.execute("SELECT * FROM GRADE ORDER BY POINTS DESC")
grades = mycursor.fetchall()

for student in students:
    totbf = 0
    totcreds = 0

    mycursor.execute("SELECT * FROM MARKS WHERE MARKS.STUD_ID=%s",(student[0],))
    marks = mycursor.fetchall()

    creds = []

    for mark in marks:
        mycursor.execute("SELECT CREDITS FROM COURSE WHERE COURSE.ID = %s",(mark[1],))
        creds.append([mark[1], int(mycursor.fetchone()[0]), float(mark[2])])

    for sub in creds:
        totcreds += sub[1]
        for grade in grades:
            if(float(grade[1]) <= sub[2] and float(grade[2]) >= sub[2]):
                mycursor.execute("SELECT * FROM RESULTS WHERE RESULTS.STUD_ID = %s AND RESULTS.COURSEID = %s",(mark[0],mark[1],))
                l = mycursor.fetchone()
                if(l == None):
                    mycursor.execute("INSERT INTO RESULTS VALUES(%s,%s,%s)",(student[0], sub[0], grade[0]))
                    mydb.commit()
                else:
                    mycursor.execute("UPDATE RESULTS SET GRADE = %s WHERE RESULTS.STUD_ID = %s AND RESULTS.COURSEID = %s",(mark[0],mark[1],))
                    mydb.commit()
                totbf += grade[3] * sub[1]

    SGPA = totbf/ totcreds
    mycursor.execute("SELECT * FROM SGPA WHERE SGPA.STUD_ID = %s",(mark[0],))
    l = mycursor.fetchone()
    if(l == None):
        mycursor.execute("UPDATE SGPA SET SGPA = %s WHERE SGPA.STUD_ID = %s",(SGPA, mark[0]))
        mydb.commit()
    else:
        mycursor.execute("INSERT INTO SGPA VALUES(%s,%s)",(student[0], SGPA))
    mydb.commit()
print("Results Calculated")
