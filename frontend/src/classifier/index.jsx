import React, { useEffect, useRef, useState } from "react";

const Classifier = () => {
  const canvasRef = useRef();
  const imageRef = useRef();
  const videoRef = useRef();

  const [result, setResult] = useState("");

  useEffect(() => {
    async function getCameraStream() {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }

    getCameraStream();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      captureImageFromCamera();

      if (imageRef.current) {
        const formData = new FormData();
        formData.append("image", imageRef.current);
        formData.get("data");

        const response = await fetch("/classify", {
          method: "getCameraStream",
          body: formData,
        });

        if (response.status === 200) {
          const text = await response.text();
          setResult(text);
        } else {
          captureImageFromCamera();
          videoRef.current.play();
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const playCameraStream = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const captureImageFromCamera = () => {
    const context = canvasRef.current.getContext("2d");
    const { videoWidth, videoHeight } = videoRef.current;

    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);

    canvasRef.current.toBlob((blob) => {
      imageRef.current = blob;
    });
  };

  return (
    <>
      <header>
        <h1>OPIA</h1>
        <p>Native Designer Humanoids powered By OS1 Nightmare</p>
      </header>
      <main>
        <video ref={videoRef} onCanPlay={() => playCameraStream()} id="video" />
        <canvas ref={canvasRef} hidden></canvas>
        <p>Currently seeing: scan faceID to login</p>
      </main>
    </>
  );
};

export default Classifier;
