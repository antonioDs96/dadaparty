'use client';

import React, {ChangeEvent, FC, FormEvent, useState} from "react";
import {EventFormData} from "@/components/Form/Form.types";
import Datepicker, {DateValueType} from "react-tailwindcss-datepicker";
import styles from "./Form.module.css";
import TimeInput from "@/components/TimeInput/TimeInput";
import Link from "next/link";
import jsPDF from "jspdf";

const isDataValueType = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement> | DateValueType): e is DateValueType => {
    return e != null && "startDate" in e;
}

const Form: FC = () => {
    const [eventFormData, setEventFormData] = useState<EventFormData>({
        eventDate: null,
        eventTime: '',
        userName: '',
        userSurname: '',
        userAge: 0,
        userPhone: '',
        chosenService: 'Festa Completa',
        deposit: 0,
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement> | DateValueType) => {
        if (isDataValueType(e)) {
            return setEventFormData(prevState => ({
                ...prevState,
                eventDate: e
            }))
        }
        const {name, value} = e.target;
        setEventFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const openPopup = () => {
        const eventDateElement = document.getElementById("eventDate") as HTMLInputElement;
        eventDateElement.required = true;
        eventDateElement.focus();
    }

    const renderPdf = async () => {
        const doc = new jsPDF();

        await doc.html(`<div>
            <h1>Modulo prenotazione DADAPARTY del ${eventFormData?.eventDate?.startDate}</h1>
            <p>Nome: ${eventFormData.userName}</p>
            <p>Cognome: ${eventFormData.userSurname}</p>
            <p>Età: ${eventFormData.userAge}</p>
            <p>Telefono: ${eventFormData.userPhone}</p>
            <p>Servizio scelto: ${eventFormData.chosenService}</p>
        </div>`)


        doc.save("form_data.pdf");
    }


    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const eventDateObject = eventFormData.eventDate;
        const eventDate = eventDateObject?.startDate;
        if (eventDate == undefined) {
            openPopup();
            return;
        }

        renderPdf();
    }

    return (
        <>
            <div className="flex flex-col justify-center items-center">
                <h2 className="text-2xl font-bold">Modulo da Compilare</h2>
                <p className="mb-2 text-lg font-normal text-gray-500 lg:text-xl text-center pt-4">Le informazioni che
                    hai
                    fornito saranno replicate sul documento
                    che stai per scaricare subito dopo l'invio dei seguenti dati.</p>
            </div>
            <form className="max-w-screen-xl w-full mx-auto" onSubmit={handleSubmit} id="eventForm">
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                    <div>
                        <label htmlFor="eventDate"
                               className="block mb-2 text-sm font-medium">Data dell'evento</label>
                        <Datepicker value={eventFormData.eventDate} onChange={handleChange}
                                    inputId="eventDate"
                                    displayFormat={"DD/MM/YYYY"}
                                    startFrom={new Date()} asSingle placeholder={"Inserisci la data dell'evento"}
                                    primaryColor={"fuchsia"}/>
                    </div>
                    <div>
                        <label htmlFor="eventTime"
                               className="block mb-2 text-sm font-medium">Orario Evento</label>
                        <TimeInput onChange={handleChange} value={eventFormData.eventTime}/>
                    </div>
                    <div>
                        <label htmlFor="userName"
                               className="block mb-2 text-sm font-medium text">Nome Festeggiato</label>
                        <input type="text" id="userName" name="userName" value={eventFormData.userName}
                               className={styles.inputCustomClassDark} onChange={handleChange}
                               placeholder="Nome..." required/>
                    </div>
                    <div>
                        <label htmlFor="userSurname"
                               className="block mb-2 text-sm font-medium text">Cognome Festeggiato</label>
                        <input type="text" id="username" name="userSurname" value={eventFormData.userSurname}
                               onChange={handleChange}
                               className={styles.inputCustomClassDark}
                               placeholder="Cognome..." required/>
                    </div>
                    <div>
                        <label htmlFor="userAge"
                               className="block mb-2 text-sm font-medium text">Eta' Festeggiato</label>
                        <input type="text" id="userAge" name="userAge" value={eventFormData.userAge}
                               className={styles.inputCustomClassDark} onChange={handleChange}
                               placeholder="Eta..." min="1" required/>
                    </div>
                    <div>
                        <label htmlFor="phone" className="block mb-2 text-sm font-medium">Telefono
                        </label>
                        <input type="tel" id="phone" name={"userPhone"} value={eventFormData.userPhone}
                               onChange={handleChange}
                               className={styles.inputCustomClassDark}
                               pattern="\d{10}" maxLength={10} placeholder="3295990033" required/>
                    </div>
                    <div>
                        <label htmlFor="chosenService"
                               className="block mb-2 text-sm font-medium">Servizio Scelto</label>
                        <select name="chosenService" id="chosenService" value={eventFormData.chosenService}
                                onChange={handleChange}
                                className={styles.inputCustomClassDark}>
                            <option value="Festa Completa">Festa Completa</option>
                            <option value="Festa Base">Festa Base</option>
                            <option value="Festa Base plus">Festa Base +</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="deposit"
                               className="block mb-2 text-sm font-medium text">Deposito</label>
                        <input type="text" id="deposit" name="deposit" value={eventFormData.deposit}
                               className={styles.inputCustomClassDark} onChange={handleChange}
                               placeholder="Deposito..." min="0" />
                    </div>
                </div>
                <div className="flex items-start mb-6">
                    <div className="flex items-center h-5">
                        <input id="remember" type="checkbox" value=""
                               className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:border-fuchsia-500 focus:ring-fuchsia-500/20 checked:bg-fuchsia-500 hover:bg-fuchsia-500/20 active:bg-fuchsia-500/30"
                               required/>
                    </div>
                    <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-900">Sono a conoscenza
                        <Link href="/termini" className="text-fuchsia-500 hover:underline"> dei termini e delle
                            condizioni</Link>.</label>
                </div>
                <button type="submit"
                        className="text-white bg-third hover:bg-fuchsia-800 focus:ring-4 focus:outline-none focus:ring-fuchsia-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit
                </button>
            </form>
        </>
    )
}

export default Form;

