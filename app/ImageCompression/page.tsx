'use client';
// import ImageCanvas from '@/components/ImageCanvas';
import PageHeading from '@/components/PageHeading';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import numeric from 'numeric';
import { useState, useEffect, useRef } from 'react';
import koalaImg from '../images/KoalaBear200x200.jpg';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/SectionTitle';
import ColumnHeader from '@/components/ColumnHeader';
import Paragraph from '@/components/Paragraph';
import SectionHeading from '@/components/SectionHeading';


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
    const defaultRank = 8;
    const defaultWidth = 200;
    const defaultHeight = 200;
    const origFileSize =  3 * defaultWidth * defaultHeight / 1000; // in KB assuming 3 bytes per pixel (RGB)
    const defaultPixelColor = 240;

export default function Page() {

    const [rank, setRank] = useState([defaultRank]);
    const [compFileSize, setCompFileSize] = useState(Math.ceil(defaultRank * 3 * ( defaultWidth + defaultHeight + 1) / 1000));

    const originalCanvasRef = useRef<HTMLCanvasElement>(null);
    const compressedCanvasRef = useRef<HTMLCanvasElement>(null);
    const compRedCanvasRef = useRef<HTMLCanvasElement>(null);
    const compGreenCanvasRef = useRef<HTMLCanvasElement>(null);
    const compBlueCanvasRef = useRef<HTMLCanvasElement>(null);  
    const svdRedUCanvasRef = useRef<HTMLCanvasElement>(null);
    const svdRedSCanvasRef = useRef<HTMLCanvasElement>(null);
    const svdRedVtCanvasRef = useRef<HTMLCanvasElement>(null);
    const svdGreenUCanvasRef = useRef<HTMLCanvasElement>(null);
    const svdGreenSCanvasRef = useRef<HTMLCanvasElement>(null);
    const svdGreenVtCanvasRef = useRef<HTMLCanvasElement>(null);
    const svdBlueUCanvasRef = useRef<HTMLCanvasElement>(null);
    const svdBlueSCanvasRef = useRef<HTMLCanvasElement>(null);
    const svdBlueVtCanvasRef = useRef<HTMLCanvasElement>(null);


    useEffect(() => {
        console.log('use effect initial')

        const origCanvas = originalCanvasRef.current;

        if (!origCanvas) return;
        const origCtx = origCanvas.getContext("2d");

        if (! origCtx ) return;
        
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
        const compRedCanvas =  compRedCanvasRef.current;
        const compGreenCanvas =  compGreenCanvasRef.current;
        const compBlueCanvas =  compBlueCanvasRef.current;
        const svdRedUCanvas = svdRedUCanvasRef.current;
        const svdRedSCanvas = svdRedSCanvasRef.current;
        const svdRedVtCanvas = svdRedVtCanvasRef.current;
        const svdGreenUCanvas = svdGreenUCanvasRef.current;
        const svdGreenSCanvas = svdGreenSCanvasRef.current;
        const svdGreenVtCanvas = svdGreenVtCanvasRef.current;
        const svdBlueUCanvas = svdBlueUCanvasRef.current;
        const svdBlueSCanvas = svdBlueSCanvasRef.current;
        const svdBlueVtCanvas = svdBlueVtCanvasRef.current; 

        if (! (compCanvas && 
            compRedCanvas && compGreenCanvas && compBlueCanvas &&
            svdRedUCanvas && svdRedSCanvas && svdRedVtCanvas &&
            svdGreenUCanvas && svdGreenSCanvas && svdGreenVtCanvas &&
            svdBlueUCanvas && svdBlueSCanvas && svdBlueVtCanvas
        )) return;

        const ctx = compCanvas.getContext("2d");
        const ctxRed = compRedCanvas.getContext("2d");
        const ctxGreen = compGreenCanvas.getContext("2d");
        const ctxBlue = compBlueCanvas.getContext("2d");
        const svdRedUctx = svdRedUCanvas.getContext("2d");
        const svdRedSctx = svdRedSCanvas.getContext("2d");
        const svdRedVtctx = svdRedVtCanvas.getContext("2d");   
        const svdGreenUctx = svdGreenUCanvas.getContext("2d");
        const svdGreenSctx = svdGreenSCanvas.getContext("2d");
        const svdGreenVtctx = svdGreenVtCanvas.getContext("2d");
        const svdBlueUctx = svdBlueUCanvas.getContext("2d");
        const svdBlueSctx = svdBlueSCanvas.getContext("2d");
        const svdBlueVtctx = svdBlueVtCanvas.getContext("2d");

        if (!(ctx && 
            ctxRed && ctxGreen && ctxBlue &&
            svdRedUctx && svdRedSctx && svdRedVtctx &&
            svdGreenUctx && svdGreenSctx && svdGreenVtctx &&
            svdBlueUctx && svdBlueSctx && svdBlueVtctx
        )) return;

        const imageData = ctx.createImageData(width, height);
        const imageDataRed = ctxRed.createImageData(width, height);
        const imageDataGreen = ctxGreen.createImageData(width, height);
        const imageDataBlue = ctxBlue.createImageData(width, height);
        const imageDataSvdRedU = svdRedUctx.createImageData(width, height);
        const imageDataSvdRedS = svdRedSctx.createImageData(width, height);
        const imageDataSvdRedVt = svdRedVtctx.createImageData(width, height);
        const imageDataSvdGreenU = svdGreenUctx.createImageData(width, height);
        const imageDataSvdGreenS = svdGreenSctx.createImageData(width, height);
        const imageDataSvdGreenVt = svdGreenVtctx.createImageData(width, height);
        const imageDataSvdBlueU = svdBlueUctx.createImageData(width, height);
        const imageDataSvdBlueS = svdBlueSctx.createImageData(width, height);
        const imageDataSvdBlueVt = svdBlueVtctx.createImageData(width, height);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                
                const idx = (y * width + x) * 4;
                imageDataRed.data[idx] = imageData.data[idx] = compDataRed[y][x];     // R
                imageDataGreen.data[idx + 1] = imageData.data[idx + 1] = compDataGreen[y][x]; // G
                imageDataBlue.data[idx + 2] = imageData.data[idx + 2] = compDataBlue[y][x]; // B
                
                imageDataRed.data[idx + 3] = imageDataGreen.data[idx + 3] = imageDataBlue.data[idx + 3] = imageData.data[idx + 3] = 255; // Alpha
                imageDataSvdRedU.data[idx + 3] = imageDataSvdRedS.data[idx + 3] = imageDataSvdRedVt.data[idx + 3] = 255;
                imageDataSvdGreenU.data[idx + 3] = imageDataSvdGreenS.data[idx + 3] = imageDataSvdGreenVt.data[idx + 3] = 255;
                imageDataSvdBlueU.data[idx + 3] = imageDataSvdBlueS.data[idx + 3] = imageDataSvdBlueVt.data[idx + 3] = 255; 

                imageDataSvdRedU.data[idx] = imageDataSvdRedU.data[idx + 1] = imageDataSvdRedU.data[idx + 2] = defaultPixelColor;
                imageDataSvdRedS.data[idx] = imageDataSvdRedS.data[idx + 1] = imageDataSvdRedS.data[idx + 2] = defaultPixelColor;
                imageDataSvdRedVt.data[idx] = imageDataSvdRedVt.data[idx + 1] = imageDataSvdRedVt.data[idx + 2] = defaultPixelColor;
                imageDataSvdGreenU.data[idx] = imageDataSvdGreenU.data[idx + 1] = imageDataSvdGreenU.data[idx + 2] = defaultPixelColor;
                imageDataSvdGreenS.data[idx] = imageDataSvdGreenS.data[idx + 1] = imageDataSvdGreenS.data[idx + 2] = defaultPixelColor;
                imageDataSvdGreenVt.data[idx] = imageDataSvdGreenVt.data[idx + 1] = imageDataSvdGreenVt.data[idx + 2] = defaultPixelColor;
                imageDataSvdBlueU.data[idx] = imageDataSvdBlueU.data[idx + 1] = imageDataSvdBlueU.data[idx + 2] = defaultPixelColor;
                imageDataSvdBlueS.data[idx] = imageDataSvdBlueS.data[idx + 1] = imageDataSvdBlueS.data[idx + 2] = defaultPixelColor;
                imageDataSvdBlueVt.data[idx] = imageDataSvdBlueVt.data[idx + 1] = imageDataSvdBlueVt.data[idx + 2] = defaultPixelColor;

                // SVD matrices
                if(y < r) {
                    imageDataSvdRedVt.data[idx] = svdDataRed.V[x][y] * 2000; // R
                    imageDataSvdGreenVt.data[idx + 1] = svdDataGreen.V[x][y] * 2000; // G
                    imageDataSvdBlueVt.data[idx + 2] = svdDataBlue.V[x][y] * 2000; // B
                    imageDataSvdRedVt.data[idx + 1] = imageDataSvdRedVt.data[idx + 2] = imageDataSvdGreenVt.data[idx] = imageDataSvdGreenVt.data[idx + 2] = imageDataSvdBlueVt.data[idx + 1] = imageDataSvdBlueVt.data[idx + 0] = 0;
                }
                if(x < r){
                    imageDataSvdRedU.data[idx] = svdDataRed.U[y][x] * 2000; // R
                    imageDataSvdGreenU.data[idx + 1] = svdDataGreen.U[y][x] * 2000; // G
                    imageDataSvdBlueU.data[idx + 2] = svdDataBlue.U[y][x] * 2000; // B
                    imageDataSvdRedU.data[idx + 1] = imageDataSvdRedU.data[idx + 2] = imageDataSvdGreenU.data[idx] = imageDataSvdGreenU.data[idx + 2] = imageDataSvdBlueU.data[idx + 1] = imageDataSvdBlueU.data[idx + 0] = 0;
                }
                if(y < r && x < r && x==y) {
                    imageDataSvdRedS.data[idx] = svdDataRed.S[y] / 4; // R
                    imageDataSvdGreenS.data[idx + 1] = svdDataGreen.S[y] / 4; // G
                    imageDataSvdBlueS.data[idx + 2] = svdDataBlue.S[y] / 4; // B
                    imageDataSvdRedS.data[idx + 1] = imageDataSvdRedS.data[idx + 2] = imageDataSvdGreenS.data[idx] = imageDataSvdGreenS.data[idx + 2] = imageDataSvdBlueS.data[idx + 1] = imageDataSvdBlueS.data[idx + 0] = 0;
                    // console.log(`SVD Red S value at (${y}, ${x}):`, imageDataSvdRedS.data[idx]);
                    // console.log('a few red pixels:', imageDataRed.data[idx]);

                }   
            }
        }
        ctx.putImageData(imageData, 0, 0);
        ctxRed.putImageData(imageDataRed, 0, 0);
        ctxGreen.putImageData(imageDataGreen, 0, 0);
        ctxBlue.putImageData(imageDataBlue, 0, 0);
        svdRedUctx.putImageData(imageDataSvdRedU, 0, 0);
        svdRedSctx.putImageData(imageDataSvdRedS, 0, 0);
        svdRedVtctx.putImageData(imageDataSvdRedVt, 0, 0);
        svdGreenUctx.putImageData(imageDataSvdGreenU, 0, 0);
        svdGreenSctx.putImageData(imageDataSvdGreenS, 0, 0);
        svdGreenVtctx.putImageData(imageDataSvdGreenVt, 0, 0);
        svdBlueUctx.putImageData(imageDataSvdBlueU, 0, 0);
        svdBlueSctx.putImageData(imageDataSvdBlueS, 0, 0);
        svdBlueVtctx.putImageData(imageDataSvdBlueVt, 0, 0);

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
                <div className="grid grid-cols-[1fr_1fr] gap-1 sm:gap-2 xs:my-4 sm:my-0 md:my-4 mx-auto sm:max-w-1/4 md:max-w-1/6">
                    <div className="text-center whitespace-nowrap overflow-visible min-w-0">
                        <div>Original</div>
                        <canvas 
                            className="w-full h-auto max-w-[200px]"
                            ref={originalCanvasRef} 
                            width={defaultWidth} 
                            height={defaultHeight} />
                        <div>{origFileSize}KB</div>
                    </div>
                    <div className="text-center whitespace-nowrap overflow-visible min-w-0">
                        <div>Compressed</div>
                        <canvas 
                            className="w-full h-auto max-w-[200px]"
                            ref={compressedCanvasRef} 
                            width={defaultWidth} 
                            height={defaultHeight} />
                        <div className={(compFileSize > origFileSize)?"text-center text-red-500":"text-center"}>{compFileSize}KB {(compFileSize > origFileSize)?"Too big!":""}</div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] gap-1 md:gap-2 my-6 sm:my-0 md:my-4 justify-items-center items-center mb-6 sm:max-w-1/2 md:max-w-2/5 mx-auto">
                <div className="whitespace-nowrap overflow-visible min-w-0">Original</div>
                <span></span>
                <div className="whitespace-nowrap overflow-visible min-w-0">U</div>
                <span></span>
                <div className="whitespace-nowrap overflow-visible min-w-0">Σ</div>
                <span></span>
                <div className="whitespace-nowrap overflow-visible min-w-0">V<sup>T</sup></div>
                <span></span>
                <div className="whitespace-nowrap overflow-visible min-w-0">Compressed</div>
                <img src="/KoalaRed.png" alt="SVD Image Compression" />
                <div className="border-1 border-gray-400 px-1 text-xs lg:text-lg"><div>S</div><div>V</div><div>D</div></div>
                <canvas 
                    className="w-full h-auto max-w-[200px] border-1 border-gray-400"
                    ref={svdRedUCanvasRef} 
                    width={defaultWidth} 
                    height={defaultHeight} />
                <span>x</span>
                <canvas 
                    className="w-full h-auto max-w-[200px] border-1 border-gray-400"
                    ref={svdRedSCanvasRef} 
                    width={defaultWidth} 
                    height={defaultHeight} />
                <span>x</span>
                <canvas 
                    className="w-full h-auto max-w-[200px] border-1 border-gray-400"
                    ref={svdRedVtCanvasRef} 
                    width={defaultWidth} 
                    height={defaultHeight} />
                <span>=</span>
                <canvas 
                    className="w-full h-auto max-w-[200px] border-1 border-gray-400"
                    ref={compRedCanvasRef} 
                    width={defaultWidth} 
                    height={defaultHeight} />
                <img src="/KoalaGreen.png" alt="SVD Image Compression" />
                <div className="border-1 border-gray-400 px-1 text-xs lg:text-lg"><div>S</div><div>V</div><div>D</div></div>
                <canvas 
                    className="w-full h-auto max-w-[200px] border-1 border-gray-400"
                    ref={svdGreenUCanvasRef} 
                    width={defaultWidth} 
                    height={defaultHeight} />
                <span>x</span>
                <canvas 
                    className="w-full h-auto max-w-[200px] border-1 border-gray-400"
                    ref={svdGreenSCanvasRef} 
                    width={defaultWidth} 
                    height={defaultHeight} />
                <span>x</span>
                <canvas 
                    className="w-full h-auto max-w-[200px] border-1 border-gray-400"
                    ref={svdGreenVtCanvasRef} 
                    width={defaultWidth} 
                    height={defaultHeight} />
                <span>=</span>
                <canvas 
                    className="w-full h-auto max-w-[200px] border-1 border-gray-400"
                    ref={compGreenCanvasRef} 
                    width={defaultWidth} 
                    height={defaultHeight} />
                <img src="/KoalaBlue.png" alt="SVD Image Compression" />
                <div className="border-1 border-gray-400 px-1 text-xs lg:text-lg"><div>S</div><div>V</div><div>D</div></div>
                <canvas 
                    className="w-full h-auto max-w-[200px] border-1 border-gray-400"
                    ref={svdBlueUCanvasRef} 
                    width={defaultWidth} 
                    height={defaultHeight} />
                <span>x</span>
                <canvas 
                    className="w-full h-auto max-w-[200px] border-1 border-gray-400"
                    ref={svdBlueSCanvasRef} 
                    width={defaultWidth} 
                    height={defaultHeight} />
                <span>x</span>
                <canvas 
                    className="w-full h-auto max-w-[200px] border-1 border-gray-400"
                    ref={svdBlueVtCanvasRef} 
                    width={defaultWidth} 
                    height={defaultHeight} />
                <span>=</span>
                <canvas 
                    className="w-full h-auto max-w-[200px] border-1 border-gray-400"
                    ref={compBlueCanvasRef} 
                    width={defaultWidth} 
                    height={defaultHeight} />
            </div>
            <div className="mx-auto w-fit p-2 bg-white z-10">
                <div className="mx-auto text-center">Rank {rank}</div>
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
            <SectionHeading title="Singular Value Decomposition (SVD)"></SectionHeading>
            <Paragraph>
                Singular Value Decomposition (SVD) is one of the tools used in some artificial intelligence applications. It is a mathematical operation that takes a 2D matrix as input and produces three new matrices as output. These matrices are called U, Sigma (Σ), and V transposed (V<sup>T</sup>) and they have unique and valuable properties. The values of the original matrix are distributed and reorganized across the three new matrices such that the first few columns of U and the first few rows of V<sup>T</sup> contain most of the information from the original matrix. Likewise, the latter columns of U and latter rows of V<sup>T</sup> add little to no value when reconstructing the original matrix and can be left out altogether in many cases.
            </Paragraph>
            <Paragraph>
                Image compression is a way to visually illustrate key concepts of SVD. The original image is not a 2D matrix, but it can be separated into 2D matrices for colors red, green, and blue. SVD is applied to each of them producing U, Σ, and V<sup>T</sup> for each color. Using the slider and plus/minus buttons you can set how much of U, Σ, and V<sup>T</sup> are used to reconstruct the image. The image is reconstructed by performing standard matrix multiplication on the parts of U, Σ, and V<sup>T</sup> matrices included by the slider. However, if you include too much of these matrices, the size of the data needed to rebuild the image exceeds the size of the original image, and we have not achieved compression at all.
            </Paragraph>
            <Paragraph>
                The U, Σ, and V<sup>T</sup> matrices are visually depicted in this example but they are not images. They are storing raw data from the original image.
            </Paragraph>
        </div>
    );
}