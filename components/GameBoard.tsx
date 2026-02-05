import Case from "./Case";

type GameBoardProps = {
    caseValues?: Array<number>,
};

const defaultCaseValues = [
	.01, 1, 5, 10, 25,
	50, 75, 100, 200, 300,
	400, 500, 750, 1000, 5000,
	10000, 25000, 50000, 75000,
	100000, 200000, 300000, 400000,
	500000, 750000, 1000000,
];

export default function GameBoard({ caseValues }: GameBoardProps) {
    // fisher-yates shuffle
    const shuffleArray = (array: Array<any>) => {
        for (let i = array.length - 1; i >= 1; i--) {
            const j = Math.floor(Math.random() * (i+1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const values = shuffleArray(caseValues ?? defaultCaseValues);

    return (
        <>
            <ul className="flex flex-wrap gap-5">
                {values.map((val, i) => (
                    <li key={i}>
                        <Case number={i + 1} value={val} />
                    </li>
                ))}
            </ul>
        </>
    );
}