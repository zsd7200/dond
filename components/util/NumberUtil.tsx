export const formatValue = (val: number) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const getRandomNumber = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
}