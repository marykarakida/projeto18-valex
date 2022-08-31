function abreviateMiddleName(fullName: string): string {
    const [first, ...rest] = fullName.split(' ');
    const last = rest.pop();

    const middle = rest.filter((name) => name.length >= 3).map((n) => n[0]);

    return [first, ...middle, last].join(' ');
}

export default abreviateMiddleName;
