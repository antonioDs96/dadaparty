import './globals.css'
import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import React, {ReactNode} from "react";

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
    title: 'DadaParty',
    description: 'DadaParty, Prenota la tua esperienza.\n' +
        '                    Compila questo modulo di prenotazione per assicurarti un posto indimenticabile alla\n' +
        '                    festa più epica dell\'anno.',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: ReactNode
}) {
    return (
        <html lang="it">
        <body className={inter.className}>{children}</body>
        </html>
    )
}
