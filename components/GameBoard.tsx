'use client';

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from 'motion/react';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';
import Case from "./Case";
import { formatValue, getRandomNumber } from "./util/NumberUtil";

type GameBoardProps = {
    caseValues?: Array<number>,
};

type ScoreboardValueType = {
    value: number,
    active: boolean,
};

const defaultCaseValues: Array<number> = [
	.01, 1, 5, 10, 25,
	50, 75, 100, 200, 300,
	400, 500, 750, 1000, 5000,
	10000, 25000, 50000, 75000,
	100000, 200000, 300000, 400000,
	500000, 750000, 1000000,
];

export default function GameBoard({ caseValues }: GameBoardProps) {
    const [values, setValues] = useState<Array<number>>(caseValues ?? defaultCaseValues);
    const [leftValues, setLeftValues] = useState<Array<ScoreboardValueType>>([]);
    const [rightValues, setRightValues] = useState<Array<ScoreboardValueType>>([]);
    const [casesLeft, setCasesLeft] = useState<number>(values.length);
    const [offer, setOffer] = useState<number>(0);
    const [offerActive, setOfferActive] = useState<boolean>(false);
    const [blockPicking, setBlockPicking] = useState<boolean>(false);
    const [round, setRound] = useState<number>(1);
    const [winState, setWinState] = useState<boolean>(false);
    const [confettiPieces, setConfettiPieces] = useState<number>(200);
    const { width, height } = useWindowSize();

    // fisher-yates shuffle
    const shuffleArray = (arr: Array<any>) => {
        let tmp = [...arr];
        for (let i = tmp.length - 1; i >= 1; i--) {
            const j = Math.floor(Math.random() * (i+1));
            [tmp[i], tmp[j]] = [tmp[j], tmp[i]];
        }
        return tmp;
    }

    useEffect(() => {
        const halfLength = Math.ceil(values.length / 2);
        let leftTmp: Array<ScoreboardValueType> = [];
        let rightTmp: Array<ScoreboardValueType> = [];
        values.slice(0, halfLength).forEach((val) => {
            leftTmp.push({
                value: val,
                active: true,
            });
        });
        values.slice(halfLength).forEach((val) => {
            rightTmp.push({
                value: val,
                active: true,
            });
        });
        setLeftValues(leftTmp);
        setRightValues(rightTmp);

        setValues(shuffleArray(values));
    }, []);

    const advanceRound = (val: number) => {
        if (casesLeft == 1) {
            setRound(0);
            setOffer(val);
            return setWinState(true);
        }

        if (casesLeft == 21 || casesLeft == 16 || casesLeft == 12 || casesLeft == 9 || casesLeft == 7 || casesLeft <= 6) {
            setRound(round + 1);

            if (casesLeft > 2)
                calculateBankerOffer();
        }
    }

    const disableScoreboardValue = (val: number) => {
        const inLeft: boolean = leftValues.some((obj) => obj.value === val);
        
        const handleScoreboard = (scoreboardValues: Array<ScoreboardValueType>) => {
            const tmp: Array<ScoreboardValueType> = [...scoreboardValues];
            const valIndex: number = tmp.findIndex((obj) => obj.value === val);
            tmp[valIndex].active = false;
            return tmp;
        }

        const tmpScoreboard: Array<ScoreboardValueType> = handleScoreboard((inLeft) ? leftValues : rightValues);
        setCasesLeft(casesLeft - 1);
        console.log(casesLeft);
        advanceRound(val);
        return (inLeft) ? setLeftValues(tmpScoreboard) : setRightValues(tmpScoreboard);
    };

    const calculateBankerOffer = () => {
        const valuesLeft: Array<number> = [];
        let valuesLeftAvg: number = 0;
        let currOffer: number = 0;

        leftValues.forEach(obj => {
            if (obj.active) {
                valuesLeft.push(obj.value);
            }
        });
        rightValues.forEach(obj => {
            if (obj.active) {
                valuesLeft.push(obj.value);
            }
        });

        valuesLeft.forEach(val => {
            valuesLeftAvg += val;
        });
        valuesLeftAvg /= valuesLeft.length;

        // based on NBC's Deal or No Deal web game from 2007
        // https://www.davegentile.com/stuff/Deal_or_no_deal.html
        switch (round) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                currOffer = valuesLeftAvg * getRandomNumber(0.20, 0.35);
                break;
            case 6:
                currOffer = valuesLeftAvg * getRandomNumber(0.30, 0.45);
                break;
            case 7:
                currOffer = valuesLeftAvg * getRandomNumber(0.40, 0.55);
                break;
            case 8:
                currOffer = valuesLeftAvg * getRandomNumber(0.50, 0.65);
                break;
            case 9:
            default:
                currOffer = valuesLeftAvg * getRandomNumber(0.60, 0.75);
                break;
        }

        const roundedOffer = Math.ceil(currOffer / 100) * 100;
        setOffer(roundedOffer);
        setBlockPicking(true);

        setTimeout(() => setOfferActive(true), 0);
    }

    const noDeal = () => {
        setOfferActive(false);
        setBlockPicking(false);
    }

    const deal = () => {
        setOfferActive(false);
        setBlockPicking(false);
        setWinState(true);
    }

    return (
        <>
            {winState && 
                <div className="z-100">
                    <Confetti 
                        numberOfPieces={confettiPieces}
                        width={width}
                        height={height}
                    />
                </div>
            }

            <div className="flex flex-col">
                <div className="flex items-center gap-x-4 relative">
                    {winState && 
                        <div className="absolute z-50 size-full bg-black/50 flex items-center justify-center">
                            <div>
                                <span className="font-bold text-3xl bg-black/50 px-4 py-1 rounded-md pointer-events-none">
                                    You've won ${formatValue(offer)}!
                                </span>
                            </div>
                        </div>
                    }
                    {blockPicking && 
                        <div className="absolute z-30 size-full bg-black/50 flex items-center justify-center">
                            <AnimatePresence>
                                {!offerActive && 
                                    <motion.span
                                        className="text-8xl pointer-events-none"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1, rotate: [0, 15, -15, 0] }}
                                        transition={{
                                            rotate: {
                                                repeat: Infinity
                                            }
                                        }}
                                        exit={{ scale: 0 }}
                                    >
                                        ☎️
                                    </motion.span>
                                }
                            </AnimatePresence>
                        </div>
                    }
                    <AnimatePresence>
                        {offerActive && 
                            <motion.div 
                                className="absolute z-50 size-full flex flex-col items-center justify-center"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                >
                                <span className="font-bold text-3xl bg-black/50 px-4 py-1 rounded-md">${formatValue(offer)}</span>
                                <div className="mt-4 flex gap-x-2 font-bold text-2xl">
                                    <button
                                        className="uppercase bg-yellow-400 text-black px-2 hover:cursor-pointer" 
                                        onClick={deal}>Deal</button>
                                    <button 
                                        className="uppercase border-6 border-yellow-400 text-yellow-400 bg-black px-2 hover:cursor-pointer"
                                        onClick={noDeal}
                                    >No Deal</button>
                                </div>
                            </motion.div>
                        }
                    </AnimatePresence>

                    <ul className="flex flex-col gap-y-1">
                        {leftValues.map(({ value, active }, i) => (
                            <li 
                                key={'scoreboard-left-' + i} 
                                className={
                                    `scoreboard-bg pointer-events-none 
                                    ${active ? 'text-black' : 'text-white brightness-50'} 
                                    w-28 px-2 flex justify-between rounded-sm`
                                }
                            >
                                <span className="text-left">$</span>
                                <span className="text-right">{formatValue(value)}</span>
                            </li>
                        ))}
                    </ul>
                    <ul className="flex flex-wrap gap-5 justify-center">
                        {values.map((val, i) => (
                            <li key={'case-' + i} onClick={() => { disableScoreboardValue(val); }}>
                                <Case number={i + 1} value={val} />
                            </li>
                        ))}
                    </ul>
                    <ul className="flex flex-col gap-y-1">
                        {rightValues.map(({ value, active }, i) => (
                            <li 
                                key={'scoreboard-right-' + i} 
                                className={
                                    `scoreboard-bg pointer-events-none 
                                    ${active ? 'text-black' : 'text-white brightness-50'} 
                                    w-28 px-2 flex justify-between rounded-sm`
                                }
                            >
                                <span className="text-left">$</span>
                                <span className="text-right">{formatValue(value)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="mt-10 flex flex-col items-center">
                    <div className="pointer-events-none">
                        {(round > 0 && !winState) &&
                            <span>Round {round}</span>
                        }
                        {(round == 0 || winState) &&
                            <span>Game Over</span>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}