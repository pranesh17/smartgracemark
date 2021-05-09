import sys

import os
from dotenv import load_dotenv

load_dotenv()

password = os.getenv('PASSWORD')
print(password)
# print("Output from Python")
# print("First name: " + sys.argv[1])
# print("Last name: " + sys.argv[2])
