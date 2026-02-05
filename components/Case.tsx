'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

type CaseProps = {
    number: number,
    value: number,
};

export default function Case({ number, value }: CaseProps) {
    const [renderBtn, setRenderBtn] = useState<Boolean>(true);

    const hideButton = () => {
        setRenderBtn(false);
    };

    const formatValue = (val: number) => {
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return (
        <div 
            className="relative flex gap-x-3 h-28 w-28" 
            onClick={hideButton}
        >
            <AnimatePresence>
                { renderBtn && 
                    <motion.button 
                        className="relative z-10 outer-case-bg text-black text-4xl font-bold 
                        h-full w-full flex items-center justify-center rounded-lg hover:cursor-pointer"
                        whileHover={{ scale: 1.1 }}
                        exit={{ opacity: 0 }}
                    >
                        <span>{number}</span>
                    </motion.button>
                }
            </AnimatePresence>
            <div 
                className="absolute z-0 bg-zinc-900 text-white text-md font-bold 
                h-full w-full flex items-center justify-center rounded-lg"
            >
                <span className="bg-zinc-700 mx-2 w-full text-center rounded-lg">${formatValue(value)}</span>
            </div>
        </div>
    )
}