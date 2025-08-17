import { useState, useRef, useEffect } from "react";
import { BrowserQRCodeReader } from "@zxing/library";
import classes from "./Scanner.module.css";

const Scanner = (props) => {
  const [camera, setCamera] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const codeReader = useRef(new BrowserQRCodeReader());

  const startReader = async () => {
    if (camera) {
      // Stop camera
      codeReader.current.reset();
      setCamera(false);
      setError(null);
    } else {
      // Start camera
      try {
        setError(null);
        setCamera(true);

        // Get video devices
        const videoInputDevices =
          await codeReader.current.getVideoInputDevices();

        if (videoInputDevices.length > 0) {
          const selectedDeviceId = videoInputDevices[0].deviceId;

          // Start decoding from video device
          codeReader.current.decodeFromVideoDevice(
            selectedDeviceId,
            videoRef.current,
            (result, error) => {
              if (result) {
                props.scan(result.getText());
                codeReader.current.reset();
                setCamera(false);
              }
              if (error && error.name !== "NotFoundException") {
                console.error("QR Scanner error:", error);
              }
            }
          );
        } else {
          setError("No camera devices found");
          setCamera(false);
        }
      } catch (err) {
        console.error("Error starting camera:", err);
        setError("Failed to start camera");
        setCamera(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      codeReader.current.reset();
    };
  }, []);

  return (
    <div className={classes.camera}>
      <div className={classes.action}>
        <button type="button" onClick={startReader}>
          {camera ? "Close Camera" : "Open Camera"}
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className={classes.camera}>
        {camera && (
          <video
            ref={videoRef}
            style={{
              width: "100%",
              maxWidth: "400px",
              height: "auto",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Scanner;
