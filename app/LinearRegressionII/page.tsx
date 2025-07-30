'use client'

import { useEffect, useState } from "react";
import { GraphData } from "../../lib/types";
import MyGraph2 from "@/components/MyGraph2";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import PageHeading from "@/components/PageHeading";

export default function Page() {

    const numberOfPoints = 100;
    const pointValues: number[][] = [];
    const mseValues: number[][] = [];
    
    const [slope, setSlope] = useState([1.0]);
    const [noise, setNoise] = useState([10.0]);
    const [estimatedSlopeCoefficient, setEstimatedSlopeCoefficient] = useState(1.0);
    const [noisyGraphData, setNoisyGraphData] = useState<GraphData[]>([]);
    const [linearRegressionGraphData, setLinearRegressionGraphData] = useState<GraphData[]>([]);

    useEffect(() => {
        plotAll();
        // Optionally, add slope and noise as dependencies if you want to re-plot when they change
    }, []);

    let NoisyGraphDataSets: GraphData[] = [];
    const noisyPoints = new GraphData();
    const trueLine = new GraphData();
    const learnedSlope = new GraphData();

    let LinearRegressionSets: GraphData[] = [];
    const mse = new GraphData();
    const msePrime = new GraphData();
    const learnedSlopeVertical = new GraphData();



    noisyPoints.label = "Noisy Data";
    noisyPoints.displayType = "points";
    noisyPoints.color = "limegreen";
    NoisyGraphDataSets.push(noisyPoints);
    

    trueLine.label = "True Line";
    trueLine.displayType = "line";
    trueLine.color = "blue";
    NoisyGraphDataSets.push(trueLine);
        
    learnedSlope.label = "Learned Slope";
    learnedSlope.displayType = "dashed-line";
    learnedSlope.color = "red";
    NoisyGraphDataSets.push(learnedSlope);

    mse.label = "MSE";
    mse.displayType = "line";
    mse.color = "purple";
    LinearRegressionSets.push(mse);

    msePrime.label = "MSE Prime";
    msePrime.displayType = "line";
    msePrime.color = "orange";
    LinearRegressionSets.push(msePrime);

    learnedSlopeVertical.label = "Est. Slope";
    learnedSlopeVertical.displayType = "dashed-line";  
    learnedSlopeVertical.color = "red";
    LinearRegressionSets.push(learnedSlopeVertical);

    // msePrime

    // learnedSlopeVertical.label = "Learned Slope Vertical";
    

    function handleSlopeChange(value: number[]) {
        setSlope(value);
        plotAll();
    }
    function handleNoiseChange(value: number[]) {
        setNoise(value);
        plotAll();
    }

    function plotAll() {
        // true line
        trueLine.points = [{x: -50, y: slope[0] * -50}, {x: 50, y: slope[0] * 50}];

        // noisy points
        for(let i=0;i<numberOfPoints;i++){
            const posNeg = (Math.random() < 0.5) ? -1:1;
            const x = i - 50;
            const y = (x * slope[0]) + (Math.random() * noise[0] * posNeg);
            noisyPoints.points[i] = { x, y };
        }

        // mse
        let slopes = -5.0;
        const slopeStep = 0.05;
        const stopAt = -2 * slopes / slopeStep;
        let errorsSquared = 0;
        for (let i = 0; i < stopAt; i++) {
            errorsSquared = squaredError(slopes);
            mse.points[i] = { x:slopes, y:errorsSquared / numberOfPoints};
            msePrime.points[i] = { x:slopes, y:msePrimeAtSlope(slopes) };
            slopes += slopeStep;
        }

        // learned slope
        let sumXY = 0;
        let sumXsquared = 0;
        for(let i=0;i<numberOfPoints;i++) {
            sumXY = sumXY + (noisyPoints.points[i].x * noisyPoints.points[i].y);
            sumXsquared = sumXsquared + (noisyPoints.points[i].x * noisyPoints.points[i].x);
        }
        const estimatedSlope = sumXY / sumXsquared;
        // console.log("slope: " + estimatedSlope);     
        setEstimatedSlopeCoefficient(estimatedSlope);
        learnedSlopeVertical.points = [{x: estimatedSlope, y: -500}, {x: estimatedSlope, y: 500}];
        learnedSlope.points = [{x:-50, y:estimatedSlope * -50}, {x:50, y:estimatedSlope * 50}];

        setNoisyGraphData(NoisyGraphDataSets);
        setLinearRegressionGraphData(LinearRegressionSets);
    }

    function squaredError(testSlope: number): number {
        let sumOfErrorsSquared = 0;
        for (const point of noisyPoints.points) {
            const error = point.y - (point.x * testSlope);
            sumOfErrorsSquared += (error * error);
        }
        
        return sumOfErrorsSquared;
    }
    function msePrimeAtSlope(testSlope: number): number {
        let sum = 0;
        for (const point of noisyPoints.points) {
            sum +=  point.x * (point.y - testSlope*point.x); // Derivative of MSE
        }
        return -2 / noisyPoints.points.length * sum ;
    }


    return (
        <div>
            <PageHeading title="Linear Regression" />
            <div className="inline-grid grid-cols-12 gap-2  md:mx-40">
                <div className="col-span-1 h-1/2">
                    <Label className="mb-2 justify-self-center">Slope (true line)</Label>
                    <Label className="mb-2 justify-self-center">{slope}</Label>
                    <Slider 
                        orientation="vertical"
                        defaultValue={[1.0]} 
                        min={-5.0} 
                        max={5.0} 
                        step={0.1} 
                        onValueChange={handleSlopeChange} 
                        value={slope} />
                </div>
                <div className="col-span-1 h-1/2">
                    <Label className="mb-2 justify-self-center">Noise Factor</Label>
                    <Label className="mb-2 justify-self-center">{noise}</Label>
                    <Slider 
                        orientation="vertical"
                        defaultValue={[10.0]} 
                        min={0.0} 
                        max={30.0} 
                        step={1} 
                        onValueChange={handleNoiseChange} 
                        value={noise} />
                </div>
                <div className="col-span-5">
                    <MyGraph2 
                        xMin={-50} 
                        xMax={50} 
                        yMin={-50} 
                        yMax={50} 
                        graphDataSets={noisyGraphData} 
                        uid='1' 
                        />
                </div>
                <div className="col-span-5">
                    <MyGraph2 xMin={-0.5} xMax={3.0} yMin={-50} yMax={500} graphDataSets={linearRegressionGraphData} uid='2' />
                    <div>
                        <Label className="m-2 justify-self-center">Estimated Slope Coefficient {estimatedSlopeCoefficient.toFixed(2)}</Label>
                    </div>
                </div>
            </div>
        </div>
    )

}