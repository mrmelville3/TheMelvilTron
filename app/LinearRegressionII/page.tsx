'use client'

import { useEffect, useState } from "react";
import { GraphData } from "../../lib/types";
import MyGraph2 from "@/components/MyGraph2";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import PageHeading from "@/components/PageHeading";
import SectionHeading from "@/components/SectionHeading";
import Paragraph from "@/components/Paragraph";
import SectionTitle from "@/components/SectionTitle";

export default function Page() {

    const numberOfPoints = 100;
    
    const [slope, setSlope] = useState([1.0]);
    const [noise, setNoise] = useState([10.0]);
    const [estimatedSlopeCoefficient, setEstimatedSlopeCoefficient] = useState(1.0);
    const [noisyGraphData, setNoisyGraphData] = useState<GraphData[]>([]);
    const [linearRegressionGraphData, setLinearRegressionGraphData] = useState<GraphData[]>([]);
    const [orientation, setOrientation] = useState<string | null>(null);


    useEffect(() => {
    // This runs AFTER slope updates
        plotAll();
    }, [slope]);

    useEffect(() => {
    // This runs AFTER noise updates
        plotAll();
    }, [noise]);

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

    noisyPoints.label = "Noisy Data Points";
    noisyPoints.displayType = "points";
    noisyPoints.color = "limegreen";
    NoisyGraphDataSets.push(noisyPoints);

    trueLine.label = "True Trend Line";
    trueLine.displayType = "line";
    trueLine.color = "blue";
    NoisyGraphDataSets.push(trueLine);
        
    learnedSlope.label = "Learned Trend Line";
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

    learnedSlopeVertical.label = "Learned Slope";
    learnedSlopeVertical.displayType = "dashed-line";  
    learnedSlopeVertical.color = "red";
    LinearRegressionSets.push(learnedSlopeVertical);

    function handleSlopeChange(value: number[]) {
        setSlope(value);
    }
    function handleNoiseChange(value: number[]) {
        setNoise(value);
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
                    <div>
                        <Label className="m-2 justify-self-center">True Slope {slope[0].toFixed(2)}</Label>
                    </div>
                </div>
                <div className={orientation?.includes('portrait') ? "col-span-6": "col-span-5"}>
                    <MyGraph2 xMin={-0.5} xMax={3.0} yMin={-50} yMax={500} graphDataSets={linearRegressionGraphData} uid='2' />
                    <div>
                        <Label className="m-2 justify-self-center">Learned Slope {estimatedSlopeCoefficient.toFixed(2)}</Label>
                    </div>
                </div>
            </div>
                { orientation?.includes('portrait') ? (
                <>
                <div className="col-span-1">
                    <Label className="mb-2 justify-self-center">True Slope {slope}</Label>
                    <Slider 
                        className="mb-4 w-3/4 mx-auto"
                        orientation="horizontal"
                        defaultValue={[1.0]} 
                        min={-5.0} 
                        max={5.0} 
                        step={0.1} 
                        onValueChange={handleSlopeChange} 
                        value={slope} />
                </div>
                <div className="col-span-1">
                    <Label className="mb-2 justify-self-center">Noise Factor {noise}</Label>
                    <Slider 
                        className="mb-4 w-3/4 mx-auto"
                        orientation="horizontal"
                        defaultValue={[10.0]} 
                        min={0.0} 
                        max={30.0} 
                        step={1} 
                        onValueChange={handleNoiseChange} 
                        value={noise} />
                </div>
                </>) : null}
            <SectionHeading title="What's Going On Here?" description="Let's hit the slopes..."/>
            <SectionTitle>The Basic Idea</SectionTitle>
            <Paragraph>
                Linear regression is a simple form of machine learning. It is a mathematical algorithm that processes a set of data points and determines the best possible trend line among the data points. In this example the green dots in the graph on the left are the data points. The red dashed line is the learned trend line identified by the algorithm. As you change the true slope and noise level using the sliders, the data set changes and the learned trend line is recalculated on the fly.
            </Paragraph>
            <SectionTitle>What is Learned</SectionTitle>
            <Paragraph>
                Each green dot is a point with coordinates x and y. These points are the training data. The learning algorithm is designed around this notion: “If I am given x as input, then y is the correct output.” The algorithm takes this set of known x&apos;s and y&apos;s and finds the trend line slope that best approximates the linear trend of the training data. With the trend identified, we can predict a likely value of y for an x we&apos;ve never seen before. This is how the machine applies what it learned.
            </Paragraph>
            <SectionTitle>How it Learns</SectionTitle>
            <Paragraph>
                The graph on the right reveals more detail about how the trend line is learned. For each set of green data points, a range of hypothetical slopes is considered and represented along the x axis. For each hypothetical slope an error is calculated using the mean squared error (MSE) formula borrowed from the field of statistics. This error is along the y axis and it is a measurement of how far off all of the data points are from the hypothetical trend line. The vertex of the U-shaped parabola is the point where the error is the least. The x coordinate at the vertex is the best guess at the slope of the trend line. This is known as the estimated slope coefficient.
            </Paragraph>
            <Paragraph>
                From calculus, we know that the slope at the vertex of a parabola is zero. So we take the derivative of the MSE function, set it to zero, and solve for x. The derivative of MSE is the straight yellow line labeled MSE Prime in this example.
            </Paragraph>
        </div>
    )

}