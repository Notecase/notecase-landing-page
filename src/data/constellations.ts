// Constellation data - more points for richer background

export interface Point {
    x: number;
    y: number;
}

export const constellationPoints: Point[] = [
    { x: 12, y: 15 }, { x: 16, y: 22 }, { x: 21, y: 18 }, { x: 24, y: 26 },
    { x: 72, y: 12 }, { x: 76, y: 17 }, { x: 81, y: 13 }, { x: 78, y: 21 },
    { x: 42, y: 72 }, { x: 46, y: 78 }, { x: 51, y: 75 }, { x: 48, y: 83 },
    { x: 86, y: 62 }, { x: 91, y: 66 }, { x: 88, y: 71 },
    { x: 8, y: 55 }, { x: 12, y: 60 }, { x: 15, y: 55 },
    { x: 58, y: 35 }, { x: 63, y: 38 }, { x: 60, y: 43 },
    { x: 28, y: 45 }, { x: 33, y: 50 }, { x: 30, y: 55 },
    { x: 92, y: 35 }, { x: 96, y: 40 }, { x: 94, y: 45 },
];

export const constellationLines: [number, number][] = [
    [0, 1], [1, 2], [2, 3],
    [4, 5], [5, 6], [6, 7], [5, 7],
    [8, 9], [9, 10], [10, 11], [9, 11],
    [12, 13], [13, 14],
    [15, 16], [16, 17],
    [18, 19], [19, 20],
    [21, 22], [22, 23],
    [24, 25], [25, 26],
];

export interface StarData {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
}

export const starsData: StarData[] = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.5,
    duration: Math.random() * 5 + 3,
    delay: Math.random() * 4,
}));
