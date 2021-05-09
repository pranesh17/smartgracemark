import mysql.connector
import copy
import os
from dotenv import load_dotenv
load_dotenv()
password = os.getenv('PASSWORD')

class GMA:
    def __init__(self):
        self.maxbf = -1
        self.bestdist = []

    def benefitCalc(self, grmarks, courses):

        if(grmarks == 0):
            bf = 0
            for ctr in range(len(courses)):
                if(courses[ctr][2]>=courses[ctr][3]):
                    bf += (courses[ctr][1]*courses[ctr][4])
                if(self.maxbf< bf):
                    self.maxbf = bf
                    self.bestdist = copy.deepcopy(courses)
            return

        grmarks -= 1

        for ctr in range(len(courses)):
            courses[ctr][2]+=1
            self.benefitCalc(grmarks, courses)
            courses[ctr][2]-=1
        return

    def GraceMarkAllocator(self):

        mydb = mysql.connector.connect(host="127.0.0.1", user="root", password=password, database="GraceMarksSystem")
        mydb.autocommit=True
        mycursor = mydb.cursor()


    # GATHERING ALL STUDENTS" DETAILS
        mycursor.execute("SELECT STUDENT.ROLLNUM FROM STUDENT;")
        students = mycursor.fetchall()

        mycursor.execute("SELECT * FROM GRADE ORDER BY POINTS DESC")
        grades = mycursor.fetchall()

        for student in students:

            mycursor.execute("SELECT * FROM MARKS WHERE MARKS.STUD_ID=%s",(student[0],))
            marks = mycursor.fetchall()

            if(marks == None):
                continue

            mycursor.execute("SELECT GRACEMARKS FROM GRACEMARKS WHERE GRACEMARKS.STUD_ID=%s",(student[0],))
            l = mycursor.fetchone()
            if(l):
                gm = int(l[0])
            else:
                gm = 0
                
            creds = []

            for mark in marks:
                mycursor.execute("SELECT CREDITS FROM COURSE WHERE COURSE.ID = %s",(mark[1],))
                creds.append([mark[1], int(mycursor.fetchone()[0]), float(mark[2])])


    #SEARCHING FOR PASS MARK SO AS TO IDENTIFY COURSES IN WHICH THE STUDENT HAS FAILED
            mycursor.execute("SELECT MINMARK,POINTS FROM GRADE WHERE GRADE.GRADE = 'P'")
            pmpts = mycursor.fetchall()[0]

            pm = float(pmpts[0])
            pts = float(pmpts[1])

            failedsub = []
            passedsub = []
            for cred in creds:
                if(cred[2]<pm):
                    cred.append(pm)
                    cred.append(pts)
                    failedsub.append(cred)
#                     print(cred)
                else:
                    passedsub.append(cred)

            self.benefitCalc(gm,failedsub)
            gm = 0
            for ctr in range(len(failedsub)):
                if(self.bestdist[ctr][2]<pm):
                    gm += self.bestdist[ctr][2] - failedsub[ctr][2]
                    self.bestdist[ctr][2] = failedsub[ctr][2]

                if(self.bestdist[ctr][2]>pm):
                    gm += self.bestdist[ctr][2] - pm
                    self.bestdist[ctr][2] = pm

            for sub in self.bestdist:
                mycursor.execute("UPDATE MARKS SET MARKS = %s WHERE STUD_ID = %s AND COURSEID = %s",(sub[2], student[0], sub[0],))
                mydb.commit()


            self.maxbf = -1
            self.bestdist = []

# #HANDLING MARK ADDITION IN PASSED SUBJECTS

#             print(grades)
            for ctr in range(len(passedsub)):
                for ctr2 in range(len(grades)):
                    if(float(grades[ctr2][1])<= passedsub[ctr][2] and float(grades[ctr2][2])>= passedsub[ctr][2]):
                        if(grades[ctr2][0] == 'O'):
                            passedsub[ctr].append(120)
                            passedsub[ctr].append(11)

                        else:
                            passedsub[ctr].append(grades[ctr2-1][1])
                            passedsub[ctr].append(grades[ctr2-1][3])

            self.benefitCalc(gm,passedsub)


            for sub in self.bestdist:
                mycursor.execute("UPDATE MARKS SET MARKS = %s WHERE STUD_ID = %s AND COURSEID = %s",(sub[2], student[0], sub[0],))
                mydb.commit()

            mycursor.execute("UPDATE GRACEMARKS SET GRACEMARKS = 0 WHERE STUD_ID = %s",(student[0],))
            mydb.commit()

            self.maxbf = -1
            self.bestdist = []
    print("GRACEMARKS Allocated")

if __name__ == '__main__':
    G = GMA()
    G.GraceMarkAllocator()
