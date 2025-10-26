import QRCode from "qrcode";

export const generateQrCode = async (gymId) => {
  const qrCodeData = JSON.stringify({ gymId });
  const qrImage = await QRCode.toDataURL(qrCodeData, {
    width: 600, // 🔹 increase size (default ~200)
    margin: 2, // 🔹 space around QR
    scale: 10, // 🔹 finer pixels = sharper quality
    color: {
      dark: "#000000", // QR color
      light: "#ffffff", // background color
    },
  });
  return qrImage; // Base64 image
};
