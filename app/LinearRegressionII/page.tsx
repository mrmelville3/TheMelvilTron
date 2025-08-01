'use client'

import { useEffect, useState } from "react";
import { GraphData } from "../../lib/types";
import MyGraph2 from "@/components/MyGraph2";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import PageHeading from "@/components/PageHeading";
import SectionHeading from "@/components/SectionHeading";

export default function Page() {

    const numberOfPoints = 100;
    
    const [slope, setSlope] = useState([1.0]);
    const [noise, setNoise] = useState([10.0]);
    const [estimatedSlopeCoefficient, setEstimatedSlopeCoefficient] = useState(1.0);
    const [noisyGraphData, setNoisyGraphData] = useState<GraphData[]>([]);
    const [linearRegressionGraphData, setLinearRegressionGraphData] = useState<GraphData[]>([]);
    const [orientation, setOrientation] = useState<string | null>(null);

    useEffect(() => {
        
        plotAll();
    }, []);

    useEffect(() => {
        const getOrientation = () => {
        const type = window.screen.orientation?.type || 'unknown';
        setOrientation(type);
        };

    getOrientation();

    // Optionally, listen for changes
    window.screen.orientation?.addEventListener('change', getOrientation);

    return () => {
      window.screen.orientation?.removeEventListener('change', getOrientation);
    };
  }, []); 


    const NoisyGraphDataSets: GraphData[] = [];
    const noisyPoints = new GraphData();
    const trueLine = new GraphData();
    const learnedSlope = new GraphData();

    const LinearRegressionSets: GraphData[] = [];
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

    mse.label = "Mean Squared Err.";
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
        <div className=" md:w-3/4 mx-auto">
            <PageHeading title="Linear Regression" />
            <div className="inline-grid grid-cols-12 gap-4 m-2">
                { orientation?.includes('portrait') ? 
                 null: (
                <>
                <div className="col-span-1 h-1/2">
                    <Label className="mb-2 justify-self-center">True Slope</Label>
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
                </>)}
                <div className={orientation?.includes('portrait') ? "col-span-6": "col-span-5"}>
                    <MyGraph2 
                        xMin={-50} 
                        xMax={50} 
                        yMin={-50} 
                        yMax={50} 
                        graphDataSets={noisyGraphData} 
                        uid='1' 
                        />
                </div>
                <div className={orientation?.includes('portrait') ? "col-span-6": "col-span-5"}>
                    <MyGraph2 xMin={-0.5} xMax={3.0} yMin={-50} yMax={500} graphDataSets={linearRegressionGraphData} uid='2' />
                    <div>
                        <Label className="m-2 justify-self-center">Estimated Slope Coefficient {estimatedSlopeCoefficient.toFixed(2)}</Label>
                    </div>
                </div>
            </div>
                { orientation?.includes('portrait') ? (
                <>
                <div className="col-span-1 h-1/2">
                    <Label className="mb-2 justify-self-center">True Slope {slope}</Label>
                    <Slider 
                        className="mb-4"
                        orientation="horizontal"
                        defaultValue={[1.0]} 
                        min={-5.0} 
                        max={5.0} 
                        step={0.1} 
                        onValueChange={handleSlopeChange} 
                        value={slope} />
                </div>
                <div className="col-span-1 h-1/2">
                    <Label className="mb-2 justify-self-center">Noise Factor {noise}</Label>
                    <Slider 
                        className="mb-4"
                        orientation="horizontal"
                        defaultValue={[10.0]} 
                        min={0.0} 
                        max={30.0} 
                        step={1} 
                        onValueChange={handleNoiseChange} 
                        value={noise} />
                </div>
                </>) : null}
                <div className="col-span-12 my-4">
                    <SectionHeading title="What's Going On Here?" />
                    <p className="px-8 xl:px-24">
                    Linear regression is a simple form of machine learning. In this example you can use the slider controls to define the true line (blue) and the noise factor. Based on those inputs, the noisy data points are generated (the green dots). The learning algorithm calculates the trend line (red dashed line) based only on the green dots. Basically, the trend line is “learned” from the training data. This means that if we are given a value of x that was not in the training data, we can use the learned trend line to predict the expected value of y and produce a new point at (x, y) on the graph. 
                    </p>
                    <p className="my-4 px-8 xl:px-24">
    The graph on the right reveals more detail on how the trend line is learned. The U-shaped line represents how far off hypothetical trend lines are at different slopes. The bottom of the U is where the error is the least. The X coordinate at that point on the U-shaped graph is the best possible trend line slope for the training data provided. The straight yellow line is the derivative of the U-shaped error graph. It crosses the X axis where the slope of the U-shaped graph is zero.  
                    </p>
            </div>
        </div>
    )

}