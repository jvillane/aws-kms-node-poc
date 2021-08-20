import { encrypt } from "./index";
import { KMS } from "aws-sdk";

describe('AWS KMS usage', () => {
  it('Encrypt', async () => {
    const text = "hola";
    const result = await encrypt(text) as KMS.EncryptResponse;
    console.log('result', result);
    expect(result).toBeDefined();
  
    if(result.CiphertextBlob) {
      const buff = Buffer.from(result.CiphertextBlob as string);
      const encryptedBase64data = buff.toString('base64');
      console.log('encryptedBase64data', encryptedBase64data);
    }
    
  })
})
