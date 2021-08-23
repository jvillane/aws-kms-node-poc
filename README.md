## Create a new external symmetric key

### Step 1 - Create and empty key with origin set to external

`aws kms create-key --origin EXTERNAL`

The result will be something like:

```json
{
  "KeyMetadata": {
    "Origin": "EXTERNAL",
    "KeyId": "external-key-id",
    "Description": "",
    "KeyManager": "CUSTOMER",
    "Enabled": false,
    "KeyUsage": "ENCRYPT_DECRYPT",
    "KeyState": "PendingImport",
    "CreationDate": 1538511755.698,
    "Arn": "arn:aws:kms:eu-west-1::key/ca",
    "AWSAccountId": "your-account-id"
  }
}
```

### Step 2 - Download public key and import token from AWS KMS 

`aws kms get-parameters-for-import --key-id external-key-id  --wrapping-algorithm RSAES_OAEP_SHA_1 --wrapping-key-spec RSA_2048`

As a response, you will obtain a JSON file with the public key base64 encoded, key id and import token base64 encoded. Copy the public key, this is the value of "PublicKey" field in the JSON response, into a new file and name it, for example public-key.b64. You can use vim or nano or any other Linux text editor of your choice to create the file and paste the public key value copied. Do the same for the import token, this is the value from the "ImportToken" field in the JSON response, naming the file for example import-token.b64. You will finally have two files in your directory:

```bash
$ ls -l
total 0
-rw-r--r--  1 juliovillane  staff  0 Aug 19 20:54 import-token.b64
-rw-r--r--  1 juliovillane  staff  0 Aug 19 20:54 public-key.b64
```

We are ready to decode the b64 format. We will use the OpenSSL, issuing the following command that will produce a binary file with the same filename but extension .bin:

```bash
$ openssl enc -d -base64 -A -in public-key.b64 -out public-key.bin
```

We need to do the same for the import token:

```bash
$ openssl enc -d -base64 -A -in import-token.b64 -out import-token.bin
```

### Step 3 - Create the import material and encrypt it for the import

Generate the key with the OpenSSL library producing the b64, binary and hexadecimal formats:

```bash
$ openssl rand 32 -base64 -out generated-key.b64
$ openssl enc -d -base64 -A -in generated-key.b64 -out generated-key.bin
$ xxd -l 16 -p generated-key.bin > generated-key.hex
```

We now will wrap this key material with the public key obatined from AWS KMS before (pkey.bin):

```bash
$ openssl rsautl -encrypt -in generated-key.bin -oaep -inkey public-key.bin -keyform DER -pubin -out WrappedKeyMaterial.bin
```

### Step 4 - Import your key material

```bash
$ aws kms import-key-material --key-id [your-key-id] --encrypted-key-material fileb://WrappedKeyMaterial.bin --import-token fileb://token.bin --expiration-model KEY_MATERIAL_EXPIRES --valid-to 2021-02-01T12:00:00-08:00
$ aws kms import-key-material --key-id [your-key-id] --encrypted-key-material fileb://WrappedKeyMaterial.bin --import-token fileb://token.bin --expiration-model KEY_MATERIAL_DOES_NOT_EXPIRE
```

## Decrypt an encrypted text

It's feasible to use the aws-cli to decrypt an encrypted value using:

```bash
$ aws kms decrypt --ciphertext-blob [the-encrypted-text] --key-id [your-key-id] --output text --query Plaintext | base64 --decode
```

## References

1. [aws-kms-workshop](https://github.com/aws-samples/aws-kms-workshop)
2. [aws-cli-kms-decrypt-reference](https://docs.aws.amazon.com/cli/latest/reference/kms/decrypt.html)
