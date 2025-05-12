import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const publicPem = join(__dirname, '../keys/public.pem');
const publicPemExample = join(__dirname, '../keys/public.pem.example');

const privatePem = join(__dirname, '../keys/private.pem');
const privatePemExample = join(__dirname, '../keys/private.pem.example');

const env = join(__dirname, '../.env');
const envExample = join(__dirname, '../.env.example');

const envTest = join(__dirname, '../.env.test');
const envTestExample = join(__dirname, '../.env.test.example');

if (!existsSync(publicPem)) {
  writeFileSync(publicPem, new Uint8Array(readFileSync(publicPemExample)));
  console.log('keys/public.pem created')
}

if (!existsSync(privatePem)) {
  writeFileSync(privatePem, new Uint8Array(readFileSync(privatePemExample)));
  console.log('keys/private.pem created');
}

if (!existsSync(env)) {
  writeFileSync(env, new Uint8Array(readFileSync(envExample)));
  console.log('.env created');
}

if (!existsSync(envTest)) {
  writeFileSync(envTest, new Uint8Array(readFileSync(envTestExample)));
  console.log('.env.test created');
}
