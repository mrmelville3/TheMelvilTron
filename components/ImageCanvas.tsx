'use clinet';

interface ImageCanvasProps {
    imageData?: number[];
}

export default function ImageCanvas({ imageData }: ImageCanvasProps) {

    return (
        <canvas width="200" height="200" className="mx-auto my-4"></canvas>
    );
}