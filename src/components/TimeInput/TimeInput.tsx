import React, {FC} from 'react';
import Image from "next/image";
import ClockIconDark from "../../../public/clock.svg";
import ClockIconWhite from "../../../public/clock-dark.svg";

interface TimeInputProps {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value: string | undefined;
    name: string;
    isDarkMode?: boolean;
}

const TimeInput: FC<TimeInputProps> = ({value, onChange, name, isDarkMode}) => {
    return (
        <div style={{position: 'relative', display: 'inline-block', width: "100%"}}>
            <input
                id={name}
                className="dark:bg-slate-800 dark:text-white/80 border border-gray-300 text-sm rounded-lg focus:border-fuchsia-500 focus:ring-fuchsia-500/20 block w-full p-2.5"
                placeholder="17-51"
                type="time"
                name={name}
                value={value}
                onChange={onChange}
            />
            <span
                style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none'
                }}>
                {isDarkMode ? <Image src={ClockIconDark} alt={'CLOCK'} width={20} height={20}/> :
                    <Image src={ClockIconWhite} alt={'CLOCK'} width={20} height={20}/>
                }
      </span>
        </div>
    );
}

export default TimeInput;
