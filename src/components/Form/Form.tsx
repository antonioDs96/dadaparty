'use client';

import React, {ChangeEvent, FC, FormEvent, useEffect, useState} from "react";
import {EventFormData} from "@/components/Form/Form.types";
import Datepicker, {DateValueType} from "react-tailwindcss-datepicker";
import styles from "./Form.module.css";
import TimeInput from "@/components/TimeInput/TimeInput";
import {format} from "date-fns";
import {isDataValueType, renderPdf, translatedFormFields} from "@/components/Form/Form.helpers";
import useAlertStore from "@/store/alert/AlertStore";


const Form: FC = () => {
    const openAlert = useAlertStore(state => state.openAlert);

    const [isDark, setIsDark] = useState(false);
    const [eventFormData, setEventFormData] = useState<EventFormData>({
        submitDate: format(new Date(), 'dd/MM/yyyy'),
        eventDate: null,
        eventStartTime: '',
        eventEndTime: '',
        userName: '',
        userSurname: '',
        userAge: 1,
        userPhone: '',
        originTown: 'Lecce',
        chosenService: 'All Inclusive',
        deposit: 0,
        total: 0,
    })

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement> | DateValueType) => {
        if (isDataValueType(event)) {
            return setEventFormData(prevState => ({
                ...prevState,
                eventDate: event
            }))
        }
        const {name, value} = event.target;
        setEventFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }


    const openPopup = () => {
        const eventDateElement = document.getElementById("eventDate") as HTMLInputElement;
        eventDateElement.focus();
    }

    const validate = (eventFormData: EventFormData): boolean => {
        for (const [key, value] of Object.entries(eventFormData)) {
            const notValidDate = key === 'eventDate' && value?.startDate < new Date();
            const notCheckedTerms = key === 'agreedToTerms' && value === false;
            const notValidAge = key === 'userAge' && value <= 0;
            const notValidTotal = key === 'total' && value <= 0;
            const notValidTime = key === 'eventEndTime' && value <= eventFormData.eventStartTime;
            const notValidDeposit = key === 'deposit' && value > eventFormData.total;
            if (value === null || value === undefined || value === '') {
                openAlert(`Il campo ${translatedFormFields[key as keyof EventFormData]} non può essere vuoto`);
                return false;
            }
            if (notValidAge) {
                openAlert(`L'età non può essere inferiore a 1`);
                return false;
            }
            if (notCheckedTerms) {
                openAlert(`Devi accettare i termini e le condizioni`);
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

    const handleSubmit = (formEvent: FormEvent<HTMLFormElement>) => {
        formEvent.preventDefault();
        const eventDateObject = eventFormData.eventDate;
        const eventDate = eventDateObject?.startDate;
        if (eventDate === undefined) {
            openPopup();
            return;
        }
        if (!validate(eventFormData)) return;
        renderPdf(eventFormData);
    }

    useEffect(() => {
        setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }, []);

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
                                    startFrom={new Date()} asSingle
                                    placeholder={"Inserisci la data dell'evento"}
                                    primaryColor={"fuchsia"}
                                    readOnly
                        />
                    </div>
                    <div>
                        <label htmlFor="eventStartTime"
                               className="block mb-2 text-sm font-medium">Orario Inizio Evento</label>
                        <TimeInput onChange={handleChange} value={eventFormData.eventStartTime} name="eventStartTime"
                                   isDarkMode={isDark}/>
                    </div>
                    <div>
                        <label htmlFor="eventEndTime"
                               className="block mb-2 text-sm font-medium">Orario Fine Evento</label>
                        <TimeInput onChange={handleChange} value={eventFormData.eventEndTime} name="eventEndTime"
                                   isDarkMode={isDark}/>
                    </div>
                    <div>
                        <label htmlFor="userName"
                               className="block mb-2 text-sm font-medium text">Nome Festeggiato</label>
                        <input type="text" id="userName" name="userName" value={eventFormData.userName}
                               className={styles.inputCustomClassDark} onChange={handleChange}
                               placeholder="Nome..." pattern="[A-Za-z\s]+" title="Ammesse solo lettere"/>
                    </div>
                    <div>
                        <label htmlFor="userSurname"
                               className="block mb-2 text-sm font-medium text">Cognome Festeggiato</label>
                        <input type="text" id="userSurname" name="userSurname" value={eventFormData.userSurname}
                               onChange={handleChange}
                               className={styles.inputCustomClassDark}
                               placeholder="Cognome..." pattern="[A-Za-z\s]+" title="Ammesse solo lettere"/>
                    </div>
                    <div>
                        <label htmlFor="userAge"
                               className="block mb-2 text-sm font-medium text">Eta' Festeggiato</label>
                        <input type="number" id="userAge" name="userAge" value={eventFormData.userAge}
                               className={styles.inputCustomClassDark} onChange={handleChange}
                               placeholder="Eta..." min="0"/>
                    </div>
                    <div>
                        <label htmlFor="phone" className="block mb-2 text-sm font-medium">Telefono
                        </label>
                        <input type="tel" id="phone" name={"userPhone"} value={eventFormData.userPhone}
                               onChange={handleChange}
                               className={styles.inputCustomClassDark}
                               pattern="\d{10}" maxLength={10} placeholder="3290000000"/>
                    </div>
                    <div>
                        <label htmlFor="originTown" id="originTown" className="block mb-2 text-sm font-medium">Comune di
                            Residenza</label>
                        <input type="text" id="originTown" name="originTown" value={eventFormData.originTown}
                               onChange={handleChange}
                               className={styles.inputCustomClassDark}
                               placeholder="Comune di Residenza..." pattern="[A-Za-z\s]+" title="Ammesse solo lettere"/>
                    </div>
                    <div>
                        <label htmlFor="chosenService"
                               className="block mb-2 text-sm font-medium">Servizio Scelto</label>
                        <select name="chosenService" id="chosenService" value={eventFormData.chosenService}
                                onChange={handleChange}
                                className={styles.inputCustomClassDark}>
                            <option value="Mattina">Mattina</option>
                            <option value="Primo Turno">Primo Turno</option>
                            <option value="Serale">Serale</option>
                            <option value="All Inclusive">All Inclusive</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="deposit"
                               className="block mb-2 text-sm font-medium text">Acconto (€)</label>
                        <input type="number" id="deposit" name="deposit" value={eventFormData.deposit}
                               className={styles.inputCustomClassDark} onChange={handleChange}
                               placeholder="Deposito..." min="0" step="0.01"/>
                    </div>
                    <div>
                        <label htmlFor="total"
                               className="block mb-2 text-sm font-medium text">Totale (€)</label>
                        <input type="number" id="total" name="total" value={eventFormData.total}
                               className={styles.inputCustomClassDark} onChange={handleChange}
                               placeholder="Totale..." min="0" step="0.01"/>
                    </div>
                </div>
                <button type="submit"
                        className="text-white bg-third hover:bg-fuchsia-800 focus:ring-4 focus:outline-none focus:ring-fuchsia-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Invia
                    Modulo
                </button>
            </form>
        </>
    )
}

export default Form;

