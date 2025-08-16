'use client';
// import ImageCanvas from '@/components/ImageCanvas';
import PageHeading from '@/components/PageHeading';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import numeric from 'numeric';
import { useState, useEffect, useRef } from 'react';
import koalaImg from '../images/KoalaBear200x200.jpg';
import { Button } from '@/components/ui/button';


    // let svdData = null; // store {U,S,V}
    type svdData = {
        U: number[][];
        S: number[];
        V: number[][];
    }; 

    let svdDataRed: svdData; // store {U,S,V} for red channel
    let svdDataGreen: svdData; // store {U,S,V} for green channel
    let svdDataBlue: svdData; // store {U,S,V} for blue channel

    let width = 0;
    let height = 0;
    const defaultRank = 10;
    const defaultWidth = 200;
    const defaultHeight = 200;
    // let compFileSize = Math.ceil(defaultRank * 3 * ( defaultWidth + defaultHeight + 1) / 1000); // in KB

export default function Page() {

    const [rank, setRank] = useState([10]);
    const [compFileSize, setCompFileSize] = useState(Math.ceil(defaultRank * 3 * ( defaultWidth + defaultHeight + 1) / 1000));

    const originalCanvasRef = useRef<HTMLCanvasElement>(null);
    const compressedCanvasRef = useRef<HTMLCanvasElement>(null);


    useEffect(() => {
        console.log('use effect initial')


        const origCanvas = originalCanvasRef.current;
        if (!origCanvas) return;
        const origCtx = origCanvas.getContext("2d");
        if (!origCtx) return;

        
        const image = new Image();
        image.src = koalaImg.src;
        image.onload = () => {
            console.log('Image loading');
            width = origCanvas.width = image.width;
            height = origCanvas.height = image.height;

            // Draw the image on the original canvas
            origCtx.drawImage(image, 0, 0);

            const ctx = origCanvas.getContext("2d");
            if(!ctx) return;
            const imgData = ctx.getImageData(0, 0, width, height);

            const red = [];
            const green = [];
            const blue = [];

            for (let y = 0; y < height; y++) {
                // const row = [];
                const rRow = [];
                const gRow = [];
                const bRow = [];
                for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                rRow.push(imgData.data[idx]);
                gRow.push(imgData.data[idx + 1]);
                bRow.push(imgData.data[idx + 2]);
                // row.push(0.299 * r + 0.587 * g + 0.114 * b);
                }
                // gray.push(row);
                red.push(rRow);
                green.push(gRow);  
                blue.push(bRow);
            }

            // Compute SVD once
            console.log("Computing SVD...");

            svdDataRed = numeric.svd(red);
            svdDataGreen = numeric.svd(green);
            svdDataBlue = numeric.svd(blue);

            updateCompressedImage(defaultRank) 
        }


    }, []);

    useEffect(() => {
        // This runs AFTER rank updates
        if(!svdDataRed) return;
        updateCompressedImage(rank[0]);
        setCompFileSize(Math.ceil(rank[0] * 3 * ( defaultWidth + defaultHeight + 1) / 1000));
    }, [rank]);

    function handleRankChange(value: number[]) {
        setRank(value);
    }

    function updateCompressedImage(r: number) {
        // Logic to update the compressed image based on the rank


        const compDataRed = reconstruct(svdDataRed.U, svdDataRed.S, svdDataRed.V, r);
        const compDataGreen = reconstruct(svdDataGreen.U, svdDataGreen.S, svdDataGreen.V, r);
        const compDataBlue = reconstruct(svdDataBlue.U, svdDataBlue.S, svdDataBlue.V, r);

        const compCanvas = compressedCanvasRef.current;
        if (!compCanvas) return;
        const ctx = compCanvas.getContext("2d");
        if (!ctx) return;
        const imageData = ctx.createImageData(width, height);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
            // const val = Math.max(0, Math.min(255, compData[y][x]));
            const idx = (y * width + x) * 4;
            imageData.data[idx] = compDataRed[y][x];     // R
            imageData.data[idx + 1] = compDataGreen[y][x]; // G
            imageData.data[idx + 2] = compDataBlue[y][x]; // B
            
            imageData.data[idx + 3] = 255; // Alpha
            }
        }
        ctx.putImageData(imageData, 0, 0);

    }
    function reconstruct(U:number[][], S:number[], V:number[][], r:number): number[][] {
        const U_r = U.map(row => row.slice(0, r));
        const S_r = numeric.diag(S.slice(0, r));
        const V_r = V.map(row => row.slice(0, r));
        return numeric.dot(U_r, numeric.dot(S_r, numeric.transpose(V_r))) as number[][];
    }

    function incrementRank() {
        if(rank[0] < defaultWidth)
        setRank([rank[0] + 1]);
    }
    function decrementRank() {
        if (rank[0] > 1) {
            setRank([rank[0] - 1]);
        }
    }

    return (
        <div>
            <PageHeading title="Image Compression" description="with Singular Value Decomposition (SVD)" />
            {/* <p className="text-center mx-auto px-9 lg:w-1/2">
                This page demonstrates image compression using Singular Value Decomposition (SVD). The original image is decomposed into its singular values and vectors, allowing us to reconstruct a lower-rank approximation of the image. Adjust the rank to see how it affects the quality and size of the compressed image.
            </p> */}
            {/* <img className="mx-auto" src="/images/KoalaBear200x200.jpg" alt="Koala Bear 200 x 200" /> */}

            <div className="grid">
                <div className="grid grid-cols-2 gap-2 my-4">
                    <figure className="col-start-1 justify-self-end">
                        <figcaption className="text-center">Original Image</figcaption>
                        <canvas 
                            ref={originalCanvasRef} 
                            width={defaultWidth} 
                            height={defaultHeight} />
                        <figcaption className="text-center">File size 200KB</figcaption>
                    </figure>
                    <figure className="col-start-2 justify-self-start">
                        <figcaption className="text-center">Compressed Image</figcaption>
                        <canvas 
                            ref={compressedCanvasRef} 
                            width={defaultWidth} 
                            height={defaultHeight} />
                        <figcaption className={(compFileSize > 200)?"text-center text-red-500":"text-center"}>File size {compFileSize}KB</figcaption>
                    </figure>
                </div>
                <div className="mx-auto my-2"><Label>Rank {rank}</Label></div>
                <div className="grid grid-cols-[auto_1fr_auto] gap-2 w-80 mx-auto">
                    <Button onClick={decrementRank} className="col-start-1 w-10">-</Button>
                    <Slider 
                        className="col-start-2"
                        orientation="horizontal"
                        defaultValue={[defaultRank]} 
                        min={1} 
                        max={defaultWidth} 
                        step={1} 
                        onValueChange={handleRankChange} 
                        value={rank} />
                    <Button  onClick={incrementRank} className="col-start-3 w-10">+</Button>
                </div>
            </div>
        </div>
    );
}