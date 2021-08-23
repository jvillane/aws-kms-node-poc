import { encrypt } from "./index";
import { KMS } from "aws-sdk";

describe('AWS KMS usage', () => {
  it('Encrypt hola', async () => {
    const text = "hola";
    const result = await encrypt(text) as KMS.EncryptResponse;
    console.log(text, result);
    expect(result).toBeDefined();
  
    if(result.CiphertextBlob) {
      const buff = Buffer.from(result.CiphertextBlob as string);
      const encryptedBase64data = buff.toString('base64');
      console.log('encryptedBase64data', encryptedBase64data);
    }
  })
  
  it('Encrypt b64 hola', async () => {
    const text = "hola";
    let buff = Buffer.from(text);
    let base64text = buff.toString('base64');
    const result = await encrypt(base64text) as KMS.EncryptResponse;
    console.log(`b64 ${text}`, base64text, result);
    expect(result).toBeDefined();
    
    if(result.CiphertextBlob) {
      const buff = Buffer.from(result.CiphertextBlob as string);
      const encryptedBase64data = buff.toString('base64');
      console.log('b64 encryptedBase64data', encryptedBase64data);
    }
  })
})
