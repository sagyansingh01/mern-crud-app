# mern-crud-app
The Student Management System is a web application developed using Node.js, Express.js, MongoDB.
It allows users to perform CRUD operations (Create, Read, Update, Delete) on student records.
The application stores student information such as Name, Age, Date of Birth, Courses, and Roll Number in a MongoDB database.

Features
Add new student records
View all students
Edit existing student details
Delete student records
Store multiple courses for a student
Unique Roll Number validation
Error handling for duplicate roll numbers
Debug route for viewing raw student data

Technologies Used
Runtime Environment: Node.js
Backend Framework: Express.js
Database: MongoDB

Installation and Setup
1️ Install Node.js

Download and install Node.js from
https://nodejs.org

Check installation:

node -v
npm -v
2️ Install MongoDB

Install and run MongoDB locally.

Start MongoDB service:

mongod
3️ Clone or Download the Project
git clone https://github.com/your-username/student-management-system.git

Or download and extract the project folder.

4️ Install Dependencies

Navigate to project directory and run:

npm install

Required packages:

npm install express mongoose ejs body-parser
5️ Run the Application

Start the server:

node app.js

If everything works correctly, you will see:

Connected to MongoDB
Server running at http://localhost:3000

 Access the Application

Open your browser and visit:

http://localhost:3000
Student Data Model

The application uses the following schema:

{
 name: String,
 age: Number,
 dob: Date,
 course: [String],
 roll_no: String
}
Constraints

roll_no must be unique

course is stored as an array

Example:

Name: Rahul Sharma
Age: 20
DOB: 2005-01-10
Courses: JavaScript, Python, DBMS
Roll No: CSE101
 Application Routes
Route	Method	Description
/	GET	Display all students
/add	POST	Add a new student
/edit/:id	GET	Open edit student form
/update/:id	POST	Update student details
/delete/:id	GET	Delete a student
/debug/student/:id	GET	Show raw student JSON
Error Handling

The application handles common errors such as:

Duplicate Roll Number

Database connection errors

Invalid student ID

Missing form data

Example error message:

Roll No must be unique!
 Example Workflow

Open the application

Add a student record

View student list

Edit student information

Delete student if needed

 Future Improvements

Add student search feature

Implement pagination

Add login authentication

Deploy using Docker

Create REST API
