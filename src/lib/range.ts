export function range(start: number, end: number) {
    return Array(end - start).fill(0).map((_, idx) => start + idx);
}