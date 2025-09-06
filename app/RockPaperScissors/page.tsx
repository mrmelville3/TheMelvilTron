"use client";

import { useRef, useState } from "react";
import ControllableCamera, { CameraHandle } from "@/components/ControllableCamera";
import PageHeading from "@/components/PageHeading";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import SectionTitle from "@/components/SectionTitle";

export default function Page() {
  const gestures = ['rock', 'paper', 'scissors'];
  const cameraRef = useRef<CameraHandle>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [gestureIndex, setGestureIndex] = useState(0);
  const [trainingNow, setTrainingNow] = useState(false);



  const takePhoto = () => {
    const photoData = cameraRef.current?.takePhoto();
    if (photoData) setPhoto(photoData);
    if(gestureIndex == 2) {
        stopCamera();
        setTrainingNow(false);
    }
    setGestureIndex((gestureIndex + 1) % gestures.length);
  };

  const startTrainingRound = () => {
    cameraRef.current?.startCamera();
    setTrainingNow(true);
    // set prompt lable to 'rock'
    setGestureIndex(0);
  };

  const stopCamera = () => {
    cameraRef.current?.stopCamera();
    setTrainingNow(false);
  }

  return (
    <div className="flex flex-col items-center gap-4">

        
        <PageHeading title="Rock Paper Scissors" description="***Training Mode***" />
        <p className="text-center mx-auto px-9 lg:w-1/2">Help train the Melvi-Tron to play Rock Paper Scissors! I need your help. The Melvi-Tron cannot play rock paper scissors YET. It is currently learning what different peoples&apos; hands look like when making the rock, paper, scissors hand gestures.</p>

        <Button
        //   onClick={() => cameraRef.current?.startCamera()}
        onClick={startTrainingRound}
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >Start Training Round</Button>
        <SectionTitle>Make the following hand gesture</SectionTitle>
        <SectionTitle>{gestures[gestureIndex]}</SectionTitle>

      <ControllableCamera ref={cameraRef} />

      <div className="flex gap-2">
        <Button
          onClick={stopCamera}
          className="px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          Stop Camera
        </Button>
        <Button
        //   onClick={() => {
        //     const photoData = cameraRef.current?.takePhoto();
        //     if (photoData) setPhoto(photoData);
        //   }}
            onClick={takePhoto}
            disabled={!trainingNow}

          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >Take Photo</Button>
      </div>

      {photo && <img src={photo} alt="snapshot" className="mt-4 border" />}
    </div>
  );
}

/*
'use client';

import Camera from "@/components/Camera";
import PageHeading from "@/components/PageHeading";
import Paragraph from "@/components/Paragraph";
import { Button } from "@/components/ui/button";
import {useState} from "react";

export default function Page() {

    const defaultInstruction = 'Click "Start Training"';

    const [countDown, setCountDown] = useState(3);
    const [countDownMode, setCountDownMode] = useState(false);
    const [instruction, setInstruction] = useState(defaultInstruction);
    const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);

    const instructions = ['Show Rock', 'Show Paper', 'Show Scissors'];

      // Simple delay function that returns a Promise
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    // Async function to run the countdown
    const startTrainingClicked = async () => {

        setCurrentInstructionIndex((currentInstructionIndex + 1) % instructions.length); // cycle through instructions
        console.log(currentInstructionIndex);
        setInstruction(instructions[currentInstructionIndex]);

        setCountDownMode(true);
        for (let i = 3; i > 0; i--) {
        setCountDown(i);       // update the countdown number
        await delay(1000);     // wait 1 second before next iteration
        }
        setCountDownMode(false);      // hide div after countdown finishes
        
        setInstruction(defaultInstruction);
    };

    return (
    <div>
        <PageHeading title="Rock Paper Scissors" description="Training Mode" />
        <p className="text-center mx-auto px-9 lg:w-1/2">Help train the Melvi-Tron to play Rock Paper Scissors! I need your help. The Melvi-Tron cannot play rock paper scissors YET. It is currently learning what different peoples' hands look like when making the rock, paper, scissors hand gestures.</p>
    
        <div className="mx-auto w-fit my-8">
        <p className="mb-4 text-center">Instruction: {instruction}</p>


            <p className="mb-4 text-center">
                {countDownMode && 
                <span>Taking photo in {countDown}</span>
                }
            </p>
            
            <Camera />
        </div>
        <div className="text-center mb-8">
            <Button onClick={startTrainingClicked}>Start Training</Button>
        </div>
    </div>
  );
}

*/