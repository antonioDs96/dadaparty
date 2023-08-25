'use client';

import React, {FC} from 'react';
import Image from "next/image";
import ClockIconDark from "../../../public/clock.svg";

interface TimeInputProps {
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    value: string | undefined;
    name: string;
    isDarkMode?: boolean;
}

const TimeInput: FC<TimeInputProps> = ({value, onChange, name, isDarkMode}) => {
    const generateTimeOptions = () => {
        const options = [];
        for (let i = 0; i < 24; i++) {
            options.push(`${String(i).padStart(2, '0')}:00`);
            options.push(`${String(i).padStart(2, '0')}:30`);
        }
        return options;
    };

    return (
        isDarkMode ?
            <div style={{position: 'relative', display: 'inline-block', width: "100%"}}>
                <select
                    id={name}
                    className="dark:bg-slate-800 dark:text-white/80 border border-gray-300 text-sm rounded-lg focus:border-fuchsia-500 focus:ring-fuchsia-500/20 block w-full p-2.5"
                    name={name}
                    value={value}
                    onChange={onChange}
                >
                    {generateTimeOptions().map(time => (
                        <option key={time} value={time}>{time}</option>
                    ))}
                </select>
                <span
                    style={{
                        position: 'absolute',
                        right: 10,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none'
                    }}>
               <Image src={ClockIconDark} alt={'CLOCK'} width={20} height={20}/>
                </span>
            </div>
            :
            <select
                id={name}
                className="dark:bg-slate-800 dark:text-white/80 border border-gray-300 text-sm rounded-lg focus:border-fuchsia-500 focus:ring-fuchsia-500/20 block w-full p-2.5"
                name={name}
                value={value}
                onChange={onChange}
            >
                {generateTimeOptions().map(time => (
                    <option key={time} value={time}>{time}</option>
                ))}
            </select>
    );
}

export default TimeInput;
