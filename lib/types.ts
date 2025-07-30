export type Point = {
    x: number;
    y: number;
}
export type DataDisplayType = "points" | "line" | "dashed-line";
export class GraphData {
    points: Point[] = [];
    displayType: DataDisplayType = "points";
    color: string = "black"; // Default color 
    label: string = ""; // Optional label for the data series
}