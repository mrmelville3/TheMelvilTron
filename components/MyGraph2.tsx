import { GraphData } from "@/lib/types";
import React from "react";

interface GridProps  {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  graphDataSets: GraphData[];
  uid: string;
};

export default function MyGraph2({ xMin, xMax, yMin, yMax, graphDataSets, uid }: GridProps) {

    const xAxis = 50 - (100 * (0 - yMin) / (yMax - yMin));
    const yAxis = -50 + (100 * (0 - xMin) / (xMax - xMin));
    // const xScale = (xMax - xMin) / 20;

    function moveX(x: number): number {
        return (100 * (x - xMin) / (xMax - xMin)) - 50;
    }
    function moveY(y: number): number {
        return -(100 * (y - yMin) / (yMax - yMin)) + 50;
    }

    const spacers = [];
    for(let i=0;i<20;i++){
        spacers[i] = -50 + 5 * i ;
    }

    //const pointString = data.map(([x, y]) => `${moveX(x)},${moveY(y)}`).join(' ');

    return (
        <div className="border">
            <svg className="border" 
                viewBox="-50 -50 100 100"
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid meet">
                <rect x="-50" y="-50" width="100" height="100" fill="green" /> 
                <line x1={-50} y1={xAxis} x2={50} y2={xAxis} stroke="darkgray" strokeWidth="0.5" />
                <line x1={yAxis} y1="-50" x2={yAxis} y2="50" stroke="darkgray" strokeWidth="0.5" />
                {
                    spacers.map((y, index) => (
                        <line key={`horiz-${index}-${uid}`} x1="-50" y1={y} x2="50" y2={y} stroke="darkgray" strokeWidth="0.1" />
                ))}
                {
                    spacers.map((x, index) => (
                        <line key={`vert-${index}-${uid}`} x1={x} y1="-50" x2={x} y2="50" stroke="darkgray" strokeWidth="0.1" />
                ))}
                
                {
                    graphDataSets.map((graphData, index) => (
                        <React.Fragment key={`fragment1-${index}-${uid}`}>
                        {graphData.displayType === "points" ? 
                        <React.Fragment key={`fragment2-${index}-${uid}`}>
                            {graphData.points.map((point, pointIndex) => (
                                <circle key={`point-${index}-${pointIndex}-${uid}`} cx={moveX(point.x)} cy={moveY(point.y)} r="0.8" fill={graphData.color} />  
                            ))}
                        </React.Fragment>
                            :<polyline key={`line-${index}-${uid}`} points={graphData.points.map(p => `${moveX(p.x)},${moveY(p.y)}`).join(' ')} fill="none" stroke={graphData.color} strokeWidth="0.5" strokeDasharray={graphData.displayType === "dashed-line" ? "2,2" : undefined} />
                        } 
                        </React.Fragment>
                    ))
                }
                { (graphDataSets.length > 0) ?
                <rect x={-48} y={-46} width={32} height={10} fill="white" stroke="black" strokeWidth="0.1" />
                : <circle cx={0} cy={0} r="1.0" fill="limegreen">
                    <animate
                        attributeName="opacity"
                        begin="0s"
                        dur="5s"
                        from="0.5"
                        to="0"
                        repeatCount="indefinite" />
                    <animate
                        attributeName="r"
                        begin="0s"
                        dur="5s"
                        from="1"
                        to="100"
                        repeatCount="indefinite" />
                    </circle>
        }
                {
                    graphDataSets.map((graphData, index) => (
                        <React.Fragment key={`fragment3-${index}-${uid}`}>
                            <text key={`legendLabel-${index}-${uid}`} x={-47} y={-43 + (index * 3)} textAnchor="start" fill="black" fontSize="2.75">{graphData.label}</text>
                            {
                            graphData.displayType === "points" ?                             
                                <circle id={`legendDot-${index}-${uid}`} key={`legendDot-${index}-${uid}`} cx={-22.5} cy={-44 + (index * 3)} r="0.8" fill={graphData.color} />
                                :<line id={`legendLine-${index}-${uid}`} key={`legendLine-${index}-${uid}`} x1={-26} y1={-44 + (index * 3)} x2={-19} y2={-44 + (index * 3)} stroke={graphData.color} strokeWidth="0.5" strokeDasharray={graphData.displayType === "dashed-line" ? "1,1" : undefined} />
                            }
                        </React.Fragment>
                    ))
                }
                {/* add lables to min and max values of axes */}
                <text x={yAxis} y="-47" textAnchor="middle" fill="white" fontSize="3" fontWeight="bold">{yMax} </text>
                <text x={yAxis} y="49" textAnchor="middle" fill="white" fontSize="3" fontWeight="bold">{yMin} </text>
                <text x="-49" y={xAxis+1} textAnchor="start" fill="white" fontSize="3" fontWeight="bold">{xMin} </text>
                <text x="49" y={xAxis+1} textAnchor="end" fill="white" fontSize="3" fontWeight="bold">{xMax} </text>
            </svg>
        </div>
    );
}