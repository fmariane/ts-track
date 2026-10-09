import promptSync from "prompt-sync";
const prompt = promptSync();
let student = ""; //holds the value entered at the prompt
let students = []; //holds the list of enrolled students
let subjects = ["CS101", "DS0101", "MAT101", "STA101", "CYB101"];
let grades = [];
function addStudent() {
    student = prompt("Enter Student Name: ");
    students.push(student);
}
const totalStudents = (parseInt(prompt("How many students to enroll: "), 10));
for (let i = 0; i < totalStudents; i++) {
    addStudent();
}
console.log(students);
