import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import { Box, Button, Input, Text } from "@chakra-ui/react";
import ModalComponent from "./ModalComponent"; // Your existing Modal component
import { Form } from "react-router-dom";

const QrReader = ({ onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrCodeMessage, setQrCodeMessage] = useState();
  const scannerRef = useRef(null); // Ref to manage scanner instance
  const cleanupRef = useRef(false); // Ref to prevent state updates after unmount

  useEffect(() => {
    cleanupRef.current = false; // Reset cleanup flag

    // Initialize the scanner only once
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner("qr-reader", {
        fps: 10,
        qrbox: 250,
      });

      scannerRef.current.render(
        (result) => {
          if (!cleanupRef.current) {
            const obj = JSON.parse(result);

            setQrCodeMessage(obj); // Set QR code result
            setIsModalOpen(true); // Open the modal
          }
        },
        (error) => {
          // Suppress frequent errors
          if (error !== "NotFoundException") {
            console.warn("QR Code scanning error:", error);
          }
        }
      );
    }

    // Cleanup scanner on component unmount
    return () => {
      cleanupRef.current = true; // Prevent state updates
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    };
  }, []);

  const handleCancel = () => {
    setIsModalOpen(false); // Close the modal
    if (!cleanupRef.current) {
      scannerRef.current?.render(); // Restart scanner for new scans
    }
    onClose(); // Close QR Reader
  };

  return (
    <Box>
      <div id="qr-reader" /> {/* QR Code Scanner */}
      {isModalOpen && (
        <ModalComponent
          isOpen={isModalOpen}
          onClose={handleCancel}
          title="QR Code Scanned"
          components={
            <Form method="post">
              <Box textAlign="center">
                {Object.keys(qrCodeMessage)?.map((key) => (
                  <Text key={key} fontSize="lg" fontWeight="bold" mb={4}>
                    {key !== "id" && qrCodeMessage[key]}
                  </Text>
                ))}

                <Box display="flex" justifyContent="space-around" mt={4}>
                  <Input
                    type="date"
                    name="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                    display="none"
                  />
                  <Input
                    id="status"
                    display="none"
                    type="text"
                    name="status"
                    value="موجود"
                  />
                  <Input
                    id="studentId"
                    display="none"
                    type="text"
                    name="studentId"
                    value={qrCodeMessage?.id}
                  />
                  <Button colorScheme="red" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" colorScheme="green">
                    Add
                  </Button>
                </Box>
              </Box>
            </Form>
          }
        />
      )}
    </Box>
  );
};

export default QrReader;
