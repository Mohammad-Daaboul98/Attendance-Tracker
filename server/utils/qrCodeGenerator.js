import cloudinary from "cloudinary";
import QRCode from "qrcode";
import { createCanvas, loadImage } from "canvas";
import { formatImage } from "../middleware/multerMiddleware.js";

const qrCodeGenerator = async (info, studentName) => {
  const serializedInfo = JSON.stringify(info);

  const qrCode = await QRCode.toDataURL(serializedInfo.toString());

  if (qrCode) {
    // Define canvas size
    const canvasWidth = 400;
    const canvasHeight = 450; // Extra height for the text

    // Create a canvas
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext("2d");

    // Draw a white background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add the student name at the top
    ctx.font = "bold 24px Arial"; // Use a bold and large font for visibility
    ctx.fillStyle = "black"; // Use black text color
    ctx.textAlign = "center"; // Center the text
    ctx.fillText(studentName, canvas.width / 2, 30); // Text centered horizontally, positioned vertically at 30px

    // Draw the QR code below the text
    const qrImage = await loadImage(qrCode);
    ctx.drawImage(qrImage, 0, 50, canvasWidth, canvasWidth); // Offset vertically by 50px for text

    // Convert the canvas to a base64 image
    const finalImage = canvas.toDataURL("image/png");
    const file = formatImage(finalImage);

    // Upload the updated image to Cloudinary
    const response = await cloudinary.v2.uploader.upload(
      `data:image/png;base64,${file.content.toString("base64")}`
    );

    return response;
  }
};

export default qrCodeGenerator;
