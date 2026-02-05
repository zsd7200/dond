'use client';

import { useState, useEffect } from "react";
import Case from "./Case";
import { formatValue } from "./util/NumberUtil";

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

    const disableScoreboardValue = (val: number) => {
        const inLeft: boolean = leftValues.some((obj) => obj.value === val);
        
        const handleScoreboard = (scoreboardValues: Array<ScoreboardValueType>) => {
            const tmp: Array<ScoreboardValueType> = [...scoreboardValues];
            const valIndex: number = tmp.findIndex((obj) => obj.value === val);
            tmp[valIndex].active = false;
            return tmp;
        }

        const tmpScoreboard: Array<ScoreboardValueType> = handleScoreboard((inLeft) ? leftValues : rightValues);
        return (inLeft) ? setLeftValues(tmpScoreboard) : setRightValues(tmpScoreboard);
    };

    return (
        <div className="flex items-center gap-x-4">
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
    );
}