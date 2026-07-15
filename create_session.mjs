import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-for-development';
const APP_ID = process.env.VITE_APP_ID || 'test-app-id';

const secret = new TextEncoder().encode(JWT_SECRET);
const openId = 'test_user_lunabelle_20260714';
const name = '루나벨 테스트사용자';

const issuedAt = Date.now();
const expiresInMs = 365 * 24 * 60 * 60 * 1000; // 1 year
const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1000);

const token = await new SignJWT({
  openId,
  appId: APP_ID,
  name,
})
  .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
  .setExpirationTime(expirationSeconds)
  .sign(secret);

console.log('세션 토큰 생성 완료:');
console.log(token);
