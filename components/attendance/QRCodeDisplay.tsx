
import React, { useEffect, useRef } from 'react';
import { Modal } from '../common/Modal';

declare const QRCode: any; // From script tag in index.html

interface QRCodeDisplayProps {
  isOpen: boolean;
  onClose: () => void;
}

const generateQRData = () => {
    const data = {
        timestamp: Date.now(),
        secret: 'HR_CORE_SECRET', // Should be an env var in a real app
    };
    return btoa(JSON.stringify(data));
};

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ isOpen, onClose }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!isOpen || !canvasRef.current) return;

        let intervalId: number;

        const generateAndDisplayQR = () => {
            const data = generateQRData();
            if (canvasRef.current) {
                QRCode.toCanvas(canvasRef.current, data, { width: 300, margin: 2 }, (error: Error | null) => {
                    if (error) console.error(error);
                });
            }
        };

        generateAndDisplayQR();
        intervalId = window.setInterval(generateAndDisplayQR, 30000); // New QR every 30 seconds

        return () => {
            clearInterval(intervalId);
        };
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Attendance QR Code" size="sm">
            <div className="flex flex-col items-center text-center space-y-4">
                <p className="text-neutral-600">Scan this QR code with the HR Core app to clock in. A new code will be generated every 30 seconds.</p>
                <canvas ref={canvasRef} id="qr-canvas"></canvas>
                <p className="text-sm text-neutral-500 font-semibold">Please display this on a tablet or monitor at the entrance.</p>
            </div>
        </Modal>
    );
};
