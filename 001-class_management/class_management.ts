import promptSync from "prompt-sync";
const prompt = promptSync()


let student : string = ""; //holds the value entered at the prompt
let students: string[] = []; //holds the list of enrolled students


let subjects: string[] = ["CS101", "DS0101", "MAT101", "STA101", "CYB101"];
let grades: number[] = [];

function addStudent(): void {
   student  = prompt("Enter Student Name: ");
   students.push(student)
}

const totalStudents :  number = 
(parseInt
   (prompt("How many students to enroll: "), 10)
)

for (let i: number = 0; i<totalStudents; i++){
   addStudent()
}

console.log(students)


