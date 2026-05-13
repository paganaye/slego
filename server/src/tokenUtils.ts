import crypto from "crypto";

const SECRET_SESSION_HASH_SEED = "We+TAke+AnOther+SE*d+Ju5t+4+I0"

export function computeHash(rawString: string) {
    const hexString = crypto.createHash("sha256").update(rawString + SECRET_SESSION_HASH_SEED).digest("hex");
    return hexString;
}
