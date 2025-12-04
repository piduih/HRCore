

import React, { useEffect, useState, useRef } from 'react';
import { Modal } from '../common/Modal';
import { useAppActions } from '../../hooks/useAppContext';
import { Icon } from '../common/Icon';
import { Button } from '../common/Button';

declare const Html5QrcodeScanner: any;

interface QRCodeScannerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ isOpen, onClose }) => {
    const { recordAttendanceWithQr } = useAppActions();
    const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);
    const [isScanning, setIsScanning] = useState(true);
    const scannerRef = useRef<any>(null);

    useEffect(() => {
        if (isOpen) {
            setScanResult(null);
            setIsScanning(true);

            // Delay initialization slightly to ensure modal is rendered
            setTimeout(() => {
                if (!document.getElementById('qr-reader')) return;

                const scanner = new Html5QrcodeScanner(
                    'qr-reader',
                    { fps: 10, qrbox: { width: 250, height: 250 } },
                    false // verbose
                );
                scannerRef.current = scanner;
    
                const onScanSuccess = async (decodedText: string) => {
                    if (isScanning) { // Prevent multiple scans
                        setIsScanning(false);
                        scanner.pause(true);
                        const result = await recordAttendanceWithQr(decodedText);
                        setScanResult(result);
                    }
                };
    
                const onScanFailure = (error: any) => {
                    // ignore scan failure
                };
    
                scanner.render(onScanSuccess, onScanFailure);

            }, 100);

        } else {
            if (scannerRef.current) {
                scannerRef.current.clear().catch((err: any) => console.error("Failed to clear scanner on close", err));
                scannerRef.current = null;
            }
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch((err: any) => console.error("Failed to clear scanner on unmount", err));
                scannerRef.current = null;
            }
        };
    }, [isOpen, isScanning, recordAttendanceWithQr]);

    const handleClose = () => {
        setIsScanning(false);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Clock In">
            <div className="flex flex-col items-center text-center min-h-[300px] justify-center">
                {isScanning && !scanResult && (
                    <>
                        <div id="qr-reader" className="w-full"></div>
                        <p className="mt-4 text-neutral-600">Position the QR code within the frame.</p>
                    </>
                )}
                {scanResult && (
                    <div className="p-4 space-y-4">
                        <Icon 
                            name={scanResult.success ? 'check' : 'cross'} 
                            className={`w-16 h-16 mx-auto ${scanResult.success ? 'text-green-500' : 'text-red-500'}`} 
                        />
                        <p className="text-lg font-semibold">{scanResult.message}</p>
                        <Button onClick={handleClose}>Close</Button>
                    </div>
                )}
            </div>
        </Modal>
    );
};
