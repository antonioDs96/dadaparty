import {DateValueType} from "react-tailwindcss-datepicker";

export interface EventFormData {
    submitDate: string;
    eventDate: DateValueType | null;
    eventStartTime: string;
    eventEndTime: string;
    userName: string;
    userSurname: string;
    userAge: number;
    userPhone: string;
    chosenService: string;
    deposit: number;
}