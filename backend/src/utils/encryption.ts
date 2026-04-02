import crypto from "crypto";

const ENECRYPTION_ALGORITH = "aes-256-gcm";
const IV_LENGTH = 12;

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;

if (!ENCRYPTION_KEY) {
  throw new Error("Encryption key not found");
}

const key = Buffer.from(ENCRYPTION_KEY, "hex");

if (key.length !== 32) {
  throw new Error("ENCRYPTION KEY must bit of 32 bytes");
}

export const encrypt = (text: string) => {
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ENECRYPTION_ALGORITH, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return {
    content: encrypted.toString("hex"),
    iv: iv.toString("hex"),
    tag: tag.toString("hex"),
  };
};

export const decrypt = (data: { content: string; iv: string; tag: string }) => {
  const decipher = crypto.createDecipheriv(
    ENECRYPTION_ALGORITH,
    key,
    Buffer.from(data.iv, "hex")
  );

  decipher.setAuthTag(Buffer.from(data.tag, "hex"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(data.content, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
};
