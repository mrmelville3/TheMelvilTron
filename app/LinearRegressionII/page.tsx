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
                <div className="col-span-12 my-4 py-4">
                    <SectionHeading title="What's Going On Here?" description="Let's hit the slopes..."/>
                    <div className="px-8 xl:px-24 font-bold">The basic idea (graph on the left):</div>
                    <p className="px-8 py-2 xl:px-24">
You (the user) set the blue true trend line using the first slider. You set the noise level of the green data points with second slider. The learning algorithm takes the green dots as input and is not aware of the blue line. The output of the learning algorithm is the red dashed line. This is the algorithm&#39;s best guess at what the blue line is. The value of &quot;learned Slope&quot; on the right should be close to &quot;True Slope&quot; on the left. It has also learned the trend line of the data so it “knows” where new data points should go.  </p>
                    <div className="px-8 xl:px-24 font-bold">Let&#39;s get nerdy:</div>
                    <p className="px-8 py-2 xl:px-24">
Each green dot is a point with coordinates x and y. These points are the training data. The learning algorithm is designed around this notion: “If I am given x as input, then y is the correct output.” The algorithm takes this set of known x&#39;s and y&#39;s and finds the trend line slope that best approximates the linear trend of the training data. With the trend identified, we can predict a likely value of y for an x we&#39;ve never seen before. The machine learned!</p>
                    <div className="px-8 xl:px-24 font-bold">Next level nerds only:</div>
                    <p className="px-8 py-2 xl:px-24">
The graph on the right reveals more detail on how the trend line is learned. The purple U-shaped graph is a parabola. It represents how far hypothetical trend lines are from the data points for a range of slopes. The formula for that graph is called mean squared error (MSE). The error is the smallest at the bottom of the U-shape graph where the slope is zero. The straight yellow line is the derivative of the MSE parabola. It is called MSE Prime in this example. If you set MSE Prime equal to zero and solve for x, you will have the estimated slope coefficient. That is the slope of the learned trend line.</p>
            </div>
        </div>
    )

}