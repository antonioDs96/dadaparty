import jsPDF from "jspdf";
import {EventFormData} from "@/components/Form/Form.types";
import {ChangeEvent} from "react";
import {DateValueType} from "react-tailwindcss-datepicker";

export const renderPdf = async (eventFormData: EventFormData) => {
    var doc = new jsPDF();
    const eventDate = eventFormData.eventDate?.startDate;
    //start writing pdf

    //headline
    doc.setFontSize(25);
    doc.text('DadaParty', 10, 10);

    //body
    doc.setFontSize(20);
    doc.text('Modulo Prenotazione del : ' + eventFormData.submitDate, 10, 20);
    doc.text('Data Evento: ' + eventDate, 10, 30);
    doc.text('Dalle: ' + eventFormData.eventStartTime, 10, 40);
    doc.text('Alle: ' + eventFormData.eventEndTime, 10, 50);

    doc.text('Nome Festeggiato: ' + eventFormData.userName, 10, 70);
    doc.text('Cognome Festeggiato: ' + eventFormData.userSurname, 10, 80);
    doc.text('Età Festeggiato: ' + eventFormData.userAge, 10, 90);
    doc.text('Telefono: ' + eventFormData.userPhone, 10, 100);
    doc.text('Comune di Residenza: ' + eventFormData.originTown, 10, 110);

    doc.text('Servizio Scelto: ' + eventFormData.chosenService, 10, 130);
    doc.text('Acconto ricevuto in data odierna: ' + eventFormData.deposit + " €", 10, 140);
    doc.text('Totale: ' + eventFormData.total + " €", 140, 140);

    //FIRME e altro
    doc.text('Firme:', 10, 150);
    //set font size lower
    doc.setFontSize(10);
    doc.text('Funzionario o responsabile DadaParty', 10, 160);
    //an underline for signing
    doc.line(10, 170, 60, 170);
    doc.text('IN QUALITA’DI GENITORE O FACENTE LE VECI'.toLowerCase(), 120, 160);
    //an underline for signing
    doc.line(120, 170, 180, 170);


    //save pdf
    doc.save(`${eventFormData.userName}_${eventFormData.userSurname}_${eventDate}.pdf`);
}

export const isDataValueType = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement> | DateValueType): e is DateValueType => {
    return e != null && "startDate" in e;
}


export const translatedFormFields: Record<keyof EventFormData, string> = {
    submitDate: "Data di compilazione",
    eventDate: "Data dell'evento",
    eventStartTime: "Ora di inizio",
    eventEndTime: "Ora di fine",
    userName: "Nome",
    userSurname: "Cognome",
    userAge: "Età",
    userPhone: "Telefono",
    originTown: "Comune di residenza",
    chosenService: "Servizio scelto",
    deposit: "Acconto",
    total: "Totale",
}