import unittest
from pythonscript import GMA, Results

class TestGMA(unittest.TestCase):

    def setUp(self):
        self.verificationErrors = []
        self.testGMAobj = GMA.GMA()
        self.fcourses = []
        self.pcourses = []
        
        self.pcourses.append(["15CSE312",4,63,65,7])
        self.pcourses.append(["15CSE315",1,79,80,8])
        self.pcourses.append(["15CSE316",3,64,65,7])

        self.fcourses.append(["15CSE317",2,38,40,5])
        self.fcourses.append(["15CSE313",3,36,40,5])
        self.fcourses.append(["15CSE314",2,38,40,5])

    def tearDown(self):
        print("Tested 6 cases...")
        print(len(self.verificationErrors)," erroneous test case(s): ")
        print(self.verificationErrors,"\n")

    def test_GMA(self):

        #case 1
        self.testGMAobj.benefitCalc(2,self.pcourses)
        try: self.assertEqual(self.testGMAobj.maxbf,29)
        except AssertionError as e: self.verificationErrors.append(str(e))
        self.testGMAobj.maxbf = -1
        self.testGMAobj.bestdist = []

        #case 2
        self.testGMAobj.benefitCalc(4,self.pcourses)
        try: self.assertEqual(self.testGMAobj.maxbf,57)
        except AssertionError as e: self.verificationErrors.append(str(e))
        self.testGMAobj.maxbf = -1
        self.testGMAobj.bestdist = []

        #case 3
        self.testGMAobj.benefitCalc(5,self.pcourses)
        try: self.assertEqual(self.testGMAobj.maxbf,56)
        except AssertionError as e: self.verificationErrors.append(str(e))
        self.testGMAobj.maxbf = -1
        self.testGMAobj.bestdist = []

        #case 4
        self.testGMAobj.benefitCalc(4,self.fcourses)
        try: self.assertEqual(self.testGMAobj.maxbf,20)
        except AssertionError as e: self.verificationErrors.append(str(e))
        self.testGMAobj.maxbf = -1
        self.testGMAobj.bestdist = []

        #case 5
        self.testGMAobj.benefitCalc(8,self.fcourses)
        try: self.assertEqual(self.testGMAobj.maxbf,35)
        except AssertionError as e: self.verificationErrors.append(str(e))
        self.testGMAobj.maxbf = -1
        self.testGMAobj.bestdist = []

        #case 6
        self.testGMAobj.benefitCalc(10,self.fcourses)
        try: self.assertEqual(self.testGMAobj.maxbf,53)
        except AssertionError as e: self.verificationErrors.append(str(e))
        self.testGMAobj.maxbf = -1
        self.testGMAobj.bestdist = []

class ResultsTester(unittest.TestCase):

    def setUp(self):
        self.verificationErrors = []
        self.ResultsTestObj = Results.Results()

        self.grades = []

        self.grades.append(("O",95,100,10))
        self.grades.append(("O",90,94,9.5))
        self.grades.append(("O",85,89,9))
        self.grades.append(("O",80,84,8))
        self.grades.append(("O",65,79,7))
        self.grades.append(("O",55,64,6))
        self.grades.append(("O",40,54,5))
        self.grades.append(("F",0,39,0))

    def test_SGPACalc(self):

        #case 1
        creds = [["15CSE312",4,70],["15CSE313",3,83],["15CSE314",2,87],["15CSE315",1,96]]
        try: self.assertEqual(self.ResultsTestObj.SGPACalc(creds, self.grades), 8)
        except AssertionError as e: self.verificationErrors.append(str(e))

        #case 2
        creds = [["15CSE312",4,32],["15CSE313",3,78],["15CSE314",2,54],["15CSE315",1,69]]
        try: self.assertEqual(self.ResultsTestObj.SGPACalc(creds, self.grades), 3.8)
        except AssertionError as e: self.verificationErrors.append(str(e))

        #case 3
        creds = [["15CSE312",4,86],["15CSE313",3,80],["15CSE314",2,71],["15CSE315",1,61]]
        try: self.assertEqual(self.ResultsTestObj.SGPACalc(creds, self.grades), 9.5)
        except AssertionError as e: self.verificationErrors.append(str(e))

    def tearDown(self):
        print("Tested 3 cases...")
        print(len(self.verificationErrors)," erroneous test case(s): ")
        print(self.verificationErrors,"\n")

if __name__ == '__main__':
    unittest.main()