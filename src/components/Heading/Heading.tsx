import {FC} from "react";
import Image from "next/image";
import styles from "./Heading.module.css";
import ArrowDown from "../../../public/arrow-down.svg"

const Heading: FC = () => {

    return <section>
        <div className="py-4 px-4 mx-auto max-w-screen-xl lg:py-8 grid lg:grid-cols-2 gap-8 lg:gap-24">
            <div className="flex flex-col justify-center">
                <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl">DadaParty:<br/> Nati
                    per Gioco, cresciuti con la vostra fiducia</h1>
                <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl">Prenota la tua esperienza.
                    Compila questo modulo di prenotazione per assicurarti un posto indimenticabile alla
                    festa più epica dell'anno.</p>
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <a href="#eventForm"
                       className={`inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white
                        bg-third border border-transparent rounded-2xl shadow-sm focus:outline-none ${styles.btn}`}>Compila
                        il modulo<span className="material-symbols-outlined"><Image src={ArrowDown}
                                                                                    alt="formAction"/></span></a>
                </div>
            </div>
            <Image
                src="/../public/kids.png"
                alt="DadaParty"
                width={500}
                height={500}
                layout="responsive"
                className={styles.roundedImg}
                priority
            />
        </div>
    </section>
}

export default Heading;