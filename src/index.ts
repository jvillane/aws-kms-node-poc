import AWS, { KMS } from "aws-sdk";

AWS.config.update({ region: 'us-west-2' });
const kms = new KMS();
const KeyId = "60fb4134-72cf-48c6-ab2a-c4a2ab8cc96c";

export function encrypt(text: string) {
  var params = { KeyId, Plaintext: text };
  return kms.encrypt(params).promise();
}
