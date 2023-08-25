import jsPDF from "jspdf";
import {EventFormData, EventFormFields} from "@/components/Form/Form.types";
import {ChangeEvent} from "react";
import {DateValueType} from "react-tailwindcss-datepicker";
import {format, parse} from "date-fns";

export const renderPdf = async (eventFormData: EventFormData) => {
    const doc = new jsPDF();
    const eventDate = eventFormData.eventDate?.startDate;
    let formattedDate;

    if (eventDate !== undefined && eventDate !== null && eventDate !== "") {
        const parsedDate = parse(eventDate as string, 'yyyy-MM-dd', new Date());
        formattedDate = format(parsedDate, 'dd/MM/yyyy');
    }


    //start writing pdf
    //headline
    doc.setFontSize(25);
    //move up the image as headline
    const imgData = await fetch(`/logoDada.jpeg`).then(res => res.blob()).then(blob => URL.createObjectURL(blob));
    doc.addImage(imgData, 'PNG', 10, 10, 100, 70);
    doc.text("", 10, 0);
    //body
    doc.setFontSize(15);
    doc.text('Modulo Prenotazione del : ' + eventFormData.submitDate, 10, 90);
    doc.text('Data Evento: ' + formattedDate, 10, 100);
    doc.text('Dalle: ' + eventFormData.eventStartTime, 10, 120);
    doc.text('Alle: ' + eventFormData.eventEndTime, 10, 130);

    doc.text('Nome Festeggiato: ' + eventFormData.userName, 10, 150);
    doc.text('Cognome Festeggiato: ' + eventFormData.userSurname, 10, 160);
    doc.text('Età Festeggiato: ' + eventFormData.userAge, 10, 170);
    doc.text('Telefono: ' + eventFormData.userPhone, 10, 180);
    doc.text('Comune di Residenza: ' + eventFormData.originTown, 10, 190);

    doc.text('Servizio Scelto: ' + eventFormData.chosenService, 10, 210);
    doc.text('Sala: ' + eventFormData.room, 10, 220);
    doc.text('Acconto ricevuto in data odierna: ' + eventFormData.deposit + " €", 10, 230);
    doc.text('Totale: ' + eventFormData.total + " €", 140, 230);


    //Firme
    doc.text('Firme:', 10, 240);
    //set font size lower
    doc.setFontSize(10);
    doc.text('Funzionario o responsabile DadaParty', 10, 250);
    //an underline for signing
    doc.line(10, 260, 60, 260);
    doc.text('IN QUALITA’DI GENITORE O FACENTE LE VECI'.toLowerCase(), 120, 250);
    //an underline for signing
    doc.line(120, 260, 180, 260);

    doc.setFontSize(8);
    doc.text("DATI PER FATTURA ELETTRONICA DOVRANNO ESSERE COMUNICATI AD INIZIO FESTA.                                                                                                                                                                                                                                                                             \n" +
        "EVENTUALI OPERATORI ESTERNI, PER ALLESTIMENTO SEET-TABLE DOVRANNO METTERSI IN CONTATTO CON UN NOSTRO OPERATORE.\n" +
        "RICORDIAMO CHE PER TALE SERVIZIO BISOGNA ESSERE MUNUTI DI STRUTTURA CARTOLLENISTICA.", 10, 280);
    doc.text("N.B.DIVIETO ASSOLUTO DI APPLICARE STAMPE SULLE NOSTRE SCENOGRAFIE", 10, 290);
    doc.text(" NATI PER GIOCO CRESCIUTI CON LA VOSTRA FIDUCIA.", 10, 300);

    //insert an image in the pdf from the public folder


    //save pdf
    doc.save(`${eventFormData.userName}_${eventFormData.userSurname}_${eventDate}.pdf`);
}

// type guard to narrow down the type of the event
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
    room: "Sala",
    deposit: "Acconto",
    total: "Totale",
}

const isEmptyField = (value: unknown) =>
    value === null || value === undefined || value === '';


export const validate = (eventFormData: EventFormData, openAlert: (alertTitle: string) => void): boolean => {
    for (const [key, value] of Object.entries(eventFormData)) {
        const notValidDate = key === 'eventDate' && value?.startDate < new Date();
        const notValidAge = key === 'userAge' && value <= 0;
        const notValidTotal = key === 'total' && value <= 0;
        const notValidTime = key === 'eventEndTime' && value <= eventFormData.eventStartTime;
        const notValidDeposit = key === 'deposit' && value > eventFormData.total;

        if (isEmptyField(value)) {
            openAlert(`Il campo ${translatedFormFields[key as EventFormFields]} non può essere vuoto`);
            return false;
        }
        if (notValidAge) {
            openAlert(`L'età non può essere inferiore a 1`);
            return false;
        }
        if (notValidTotal) {
            openAlert(`Il totale non può essere inferiore o uguale a 0`);
            return false;
        }
        if (notValidTime) {
            openAlert(`L'orario di fine evento non può essere inferiore a quello di inizio evento`);
            return false;
        }
        if (notValidDeposit) {
            openAlert(`L'acconto non può essere maggiore del totale`);
            return false;
        }
        if (notValidDate) {
            openAlert(`La data dell'evento non può essere antecedente a quella odierna`);
            return false;
        }
    }
    return true;
}