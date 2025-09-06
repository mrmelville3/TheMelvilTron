"use client";

import { useRef, useEffect, useImperativeHandle, forwardRef } from "react";

export type CameraHandle = {
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  takePhoto: () => string | null;
};

  const ControllableCamera = forwardRef<CameraHandle>((props, ref) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  let stream: MediaStream | null = null;

  // Expose functions to parent
  useImperativeHandle(ref, () => ({
    startCamera: async () => {
      try {
        // stream = await navigator.mediaDevices.getUserMedia({ video: true });
        
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: { ideal: "environment" } }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error starting camera:", err);
      }
    },
    stopCamera: () => {
    //   if (stream) {
    //     stream.getTracks().forEach((track) => track.stop());
    //     stream = null;
    //   }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    },
    takePhoto: () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas) {
        const ctx = canvas.getContext("2d");
        canvas.width = 320;
        canvas.height = 240;
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL("image/jpeg"); // base64 photo
      }
      return null;
    },
  }));

  // Stop camera if component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline muted className="w-full max-w-md" />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
});

ControllableCamera.displayName = "ControllableCamera";
export default ControllableCamera;