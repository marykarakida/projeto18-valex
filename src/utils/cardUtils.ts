export function abreviateMiddleName(fullName: string): string {
    const [first, ...rest] = fullName.split(' ');
    const last = rest.pop();

    const middle = rest.filter((name) => name.length >= 3).map((n) => n[0]);

    return [first, ...middle, last].join(' ').toUpperCase();
}

export function sumTotalAmount(array: { amount: number }[]) {
    return array.reduce((prev: number, cur: { amount: number }) => prev + cur.amount, 0);
}
