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
    originTown: string;
    chosenService: "Sala 1" | "Sala 2.0" | "Sala 3.0" | "Mattina" | "Primo Turno" | "Serale" | "All Inclusive" | "";
    room: "Sala 1" | "Sala 2.0" | "Sala 3.0" | "";
    payment: "Contanti" | "Carta" | "Bonifico";
    deposit: number;
    total: number;
}

export type EventFormFields = keyof EventFormData;