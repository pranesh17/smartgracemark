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
                mycursor.execute("INSERT INTO RESULTS VALUES(%s,%s,%s)",(student[0], sub[0], grade[0],))
                mydb.commit()
                totbf += grade[3] * sub[1]

    SGPA = totbf/ totcreds
    mycursor.execute("INSERT INTO SGPA VALUES(%s,%s)",(student[0], SGPA))
    mydb.commit()

print("Published Result")
