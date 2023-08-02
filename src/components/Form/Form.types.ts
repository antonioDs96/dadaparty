import {DateValueType} from "react-tailwindcss-datepicker";

export interface EventFormData {
    eventDate: DateValueType;
    eventTime: string | undefined;
    userName: string;
    userSurname: string;
    userPhone: string;
    userAge: number;
    chosenService: string;
    deposit: number;
}