import time
import json
from selenium import webdriver

class courseData:
	def __init__(self, course_name, course_location, course_days, course_time):
		self.course_name = course_name
		self.course_location = course_location
		self.course_days = course_days
		self.course_time = course_time

	def display_data(self):
		print("course_name: ", self.course_name)
		print("course_location: ", self.course_location)
		print("course_days: ", self.course_days)
		print("course.time: ", self.course_time)

COURSES = []
user_name = " "
password = " "
driver = webdriver.Chrome()
driver.get("https://sims.sfu.ca/psp/csprd/?cmd=login")

email = driver.find_element_by_xpath("//*[@id='user']")
email.send_keys(user_name)

pw = driver.find_element_by_xpath("//*[@id='pwd']")
pw.send_keys(password)


driver.find_element_by_xpath("//*[@id='login']/div/div/div[8]/input").click()
time.sleep(5)


#extract the course data from go.sfu.ca
CLASSES_TABLE = driver.find_element_by_xpath("//*[@id='STDNT_WEEK_SCHD$scroll$0']")
ROWS = CLASSES_TABLE.find_elements_by_tag_name('tr')
i = 2
while i<len(ROWS):
	td = ROWS[i].find_elements_by_tag_name('td')
	span1 = td[1].find_element_by_tag_name('span')
	td1_text_size = len(span1.text)
	check = span1.text
	position = len(check) - 12
	c_location = check[-12:]
	c_name = check[:position]
	span2 = td[2].find_element_by_tag_name('span')
	element = driver.find_element_by_xpath("//*[@id='DERIVED_SSS_SCL_SSR_MTG_SCHED_LONG$" + str(i-2)  + "']").text.split( )
	if len(element) == 20:
		c_time = [element[1], element[2], element[3], element[8], element[9], element[10], element[15], element[16], element[17]]
		c_days = [element[0], element[7], element[9]]
		c_location = [element[5], element[12], element[19]]
		course = {
			"name" : c_name,
			"days" : c_days,
			"location": c_location,
			"time" : c_time
		}
		COURSES.append(course)
	elif len(element) == 13:
		c_time = [element[1], element[2], element[3], element[8], element[9], element[10]]
		c_days = [element[0], element[7]]
		c_location = [element[5], element[12]]
		course = {
			"name" : c_name,
			"days" : c_days,
			"location": c_location,
			"time" : c_time
		}
		COURSES.append(course)
	elif len(element) == 5:
		c_time = [element[1], element[2], element[3]]
		c_days = [element[0]]
		c_location = [element[5]]
		course = {
			"name" : c_name,
			"days" : c_days,
			"location": c_location,
			"time" : c_time
		}
		COURSES.append(course)
	else:
		print("nothing FOUND")
	i = i+1

with open('data.json', 'w', encoding = 'utf-8') as outfile:
	json.dump(COURSES, outfile)

time.sleep(3)
driver.close()

