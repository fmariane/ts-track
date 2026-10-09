import promptSync from "prompt-sync";
const prompt = promptSync()

let students: string[] = ["Doug", "Mariane", "Mary", "Rohit", "Sharin"]; 
let subjects: string[] = ["CS101", "DS0101", "MAT101", "STA101", "CYB101"];
let grades: number[] = [100, 89, 70, 101, 69.9];
let options: string[] = ["1 - See all students\n",
                        "2 - Which Student is enrolled to which subject\n",
                        "3 - Check if a student is approved\n" ]

//welcome message
console.log("####    WELCOME TO THE STUDENT MANAGEMNT SYSTEM   #")
console.log("Available options: ")
console.log(options)

while(true){
    let option =  parseInt( prompt("Type the option number: "),10)
    if(option == 0) {break}
    switch(option){
        case 1:
            printStudentsList()
        case 2:
            const flag = findSubject(subjects, students)
            console.log(flag)
        case 3:
            const grade = 70;
            const appr = approved(grade)
            console.log(appr)
        default:
            console.log("Invalid option, closing system")
            break
    }
}

function printStudentsList():void{
    for(let i: number = 0; i<5; i++){
        console.log("Student: %s\nSubject: %s\nGrade:%f\n", students[i], subjects[i], grades[i].toFixed(1))
    }
}
function findSubject (subjects: string[], students: string[]): boolean{
    const subject  = prompt("Which subject to match: ");
    let i: number = 0
    while(i<students.length){
        if (subjects[i] === subject){  
            console.log("The student enrolled to the class %s is: %s", subjects[i], students[i])
            return true
        }
        i++;
    }
    return false
}

function approved(grade: number){
    if (grade < 70){
        return false
    }
    else
        return true
}

function scoreToLetter(grade: number): string{
        if(grade<70){
            return "F"
        }
        else if(grade>0){
            if(grade>=90){ return "A"}
            if(grade>=80) { return "B"}
            if(grade>=70){return "C"}
        }
        else{return "Invalid Grade"}
    return ""
}

