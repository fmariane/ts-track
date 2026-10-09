import promptSync from "prompt-sync";
const prompt = promptSync();

interface Student {
    classes: string[];
    classSchedule: {class: string, startsAt: string};
    result: {class: string; grade: number};
}