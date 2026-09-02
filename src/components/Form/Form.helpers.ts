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
    //logo is 700x284 (aspect ratio ~2.46), keep proportions so it isn't stretched
    const imgData = await fetch(`/logoDada-pdf.jpg`).then(res => res.blob()).then(blob => URL.createObjectURL(blob));
    doc.addImage(imgData, 'JPEG', 10, 10, 100, 40.6);
    doc.text("", 10, 0);
    //body
    doc.setFontSize(15);
    doc.text('Modulo Prenotazione del : ' + eventFormData.submitDate, 10, 61);
    doc.text('Data Evento: ' + formattedDate, 10, 71);
    doc.text('Dalle: ' + eventFormData.eventStartTime, 10, 91);
    doc.text('Alle: ' + eventFormData.eventEndTime, 10, 101);

    doc.text('Nome Festeggiato: ' + eventFormData.userName, 10, 121);
    doc.text('Cognome Festeggiato: ' + eventFormData.userSurname, 10, 131);
    doc.text('Età Festeggiato: ' + eventFormData.userAge, 10, 141);
    doc.text('Telefono: ' + eventFormData.userPhone, 10, 151);
    doc.text('Comune di Residenza: ' + eventFormData.originTown, 10, 161);
    doc.text('Metodo di Pagamento: ' + eventFormData.payment, 10, 171);
    doc.text('Servizio Scelto: ' + eventFormData.chosenService, 10, 181);
    doc.text('Sala: ' + eventFormData.room, 10, 191);
    doc.text('Acconto ricevuto in data odierna: ' + eventFormData.deposit + " €", 10, 201);
    doc.text('Totale: ' + eventFormData.total + " €", 140, 201);


    //Firme
    doc.text('Firme:', 10, 211);
    //set font size lower
    doc.setFontSize(10);
    doc.text('Funzionario o responsabile DadaParty', 10, 221);
    //an underline for signing
    doc.line(10, 231, 60, 231);
    doc.text('IN QUALITA’DI GENITORE O FACENTE LE VECI'.toLowerCase(), 120, 221);
    //an underline for signing
    doc.line(120, 231, 180, 231);

    doc.setFontSize(8);
    //doc.text("DATI PER FATTURA ELETTRONICA DOVRANNO ESSERE COMUNICATI AD INIZIO FESTA.                                                                                                                                                                                                                                                                             \n" +
    //    "EVENTUALI OPERATORI ESTERNI, PER ALLESTIMENTO SEET-TABLE DOVRANNO METTERSI IN CONTATTO CON UN NOSTRO OPERATORE.\n" +
    //    "RICORDIAMO CHE PER TALE SERVIZIO BISOGNA ESSERE MUNUTI DI STRUTTURA CARTOLLENISTICA.", 10, 251);
    //doc.text("N.B.DIVIETO ASSOLUTO DI APPLICARE STAMPE SULLE NOSTRE SCENOGRAFIE", 10, 261);
    doc.text(" NATI PER GIOCO CRESCIUTI CON LA VOSTRA FIDUCIA.", 10, 271);

    //disclaimer sul contratto inviato via WhatsApp
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    const disclaimerText = doc.splitTextToSize(
        "Il contratto ricevuto su WhatsApp si intende accettato con la conferma di presa visione. " +
        "Non è richiesta la restituzione firmata.",
        190
    );
    doc.text(disclaimerText, 10, 281);
    doc.setFont('helvetica', 'normal');

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
    payment: "Metodo di pagamento",
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