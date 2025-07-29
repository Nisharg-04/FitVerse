import crypto from "crypto";

//* Utility function to generate hash of a string
const generateHash = (inputText) => {
  return crypto
    .createHmac("sha256", process.env.HASH_SECRET)
    .update(inputText)
    .digest("hex");
};

export { generateHash };
