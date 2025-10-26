import QRCode from "qrcode";

export const generateQrCode = async (gymId) => {
  const qrCodeData = JSON.stringify({ gymId });
  const qrImage = await QRCode.toDataURL(qrCodeData);
  return qrImage; // Base64 image
}