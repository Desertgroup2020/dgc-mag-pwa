import crypto from "crypto";

export function generateSignature(
  params: Record<string, string>,
  requestPhrase: string
): string {
  // Step 1: Sort the parameters alphabetically
  const sortedKeys = Object.keys(params).sort();

  // Step 2: Concatenate `param_name=param_value`
  const concatenatedString = sortedKeys
    .map((key) => `${key}=${params[key]}`)
    .join("");

  // Step 3: Add the request phrase at the beginning and end
  const signatureString = `${requestPhrase}${concatenatedString}${requestPhrase}`;

  // console.log("signature phrase", signatureString);
  

  // Step 4: Generate the SHA256 hash
  return crypto.createHash("sha256").update(signatureString).digest("hex");
}
