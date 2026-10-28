import promptSync from "prompt-sync";
const prompt = promptSync();
let students = ["Doug", "Mariane", "Mary", "Rohit", "Sharin"];
let subjects = ["CS101", "DS101", "MAT101", "STA101", "CYB101"];
let grades = [100, 89, 70, 101, 69.9];
let options = ["1 - See all students",
    "2 - Which Student is enrolled to which subject",
    "3 - Check if a student is approved"];
//welcome message
console.log("####    WELCOME TO THE STUDENT MANAGEMENT SYSTEM   ####");
console.log("Available options: ");
console.log(options);
menu: while (true) {
    let option = parseInt(prompt("Type the option number: "), 10);
    if (option == 0) {
        break;
    }
    switch (option) {
        case 1:
            printStudentsList();
            break;
        case 2:
            const flag = findSubject(subjects, students);
            if (flag == false) {
                console.log("Subject is not registered at this semester");
            }
            break;
        case 3:
            //const student  = prompt("Which student: ");
            const grade = 70;
            const appr = approved(grade);
            console.log(appr);
            break;
        default:
            console.log("Invalid option, closing system");
            break menu;
    }
}
function printStudentsList() {
    for (let i = 0; i < 5; i++) {
        console.log("Student: %s\nSubject: %s\nGrade:%f\n", students[i], subjects[i], grades[i].toFixed(1));
    }
}
function findSubject(subjects, students) {
    const subject = prompt("Which subject to match: ");
    let STUDENT = {
        name: "",
        subject: "",
        grade: 0,
    };
    let i = 0;
    while (i < students.length) {
        if (subjects[i] === subject) {
            console.log("The student enrolled to the class %s is: %s", subjects[i], students[i]);
            return true;
        }
        i++;
    }
    return false;
}
function approved(grade) {
    if (grade < 70) {
        return false;
    }
    else
        return true;
}
function scoreToLetter(grade) {
    if (grade < 70) {
        return "F";
    }
    else if (grade > 0) {
        if (grade >= 90) {
            return "A";
        }
        if (grade >= 80) {
            return "B";
        }
        if (grade >= 70) {
            return "C";
        }
    }
    else {
        return "Invalid Grade";
    }
    return "";
}
