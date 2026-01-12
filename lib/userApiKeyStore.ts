import crypto from 'crypto';

const FALLBACK_SECRET = 'dev-secret-change-me';
const store = new Map<string, StoredKey>();

type StoredKey = {
  encrypted: string;
  iv: string;
  tag: string;
  last4: string;
  createdAt: string;
  updatedAt: string;
};

type DecryptedKey = {
  apiKey: string;
  last4: string;
  updatedAt: string;
};

const getEncryptionKey = () => {
  const secret = process.env.API_KEY_ENCRYPTION_SECRET || FALLBACK_SECRET;
  return crypto.createHash('sha256').update(secret).digest();
};

const encrypt = (value: string) => {
  const iv = crypto.randomBytes(12);
  const key = getEncryptionKey();
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    encrypted: encrypted.toString('base64'),
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
  };
};

const decrypt = (payload: Pick<StoredKey, 'encrypted' | 'iv' | 'tag'>) => {
  const key = getEncryptionKey();
  const iv = Buffer.from(payload.iv, 'base64');
  const tag = Buffer.from(payload.tag, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payload.encrypted, 'base64')),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
};

export const validateApiKey = (apiKey: string) => {
  if (!apiKey || apiKey.trim().length < 20) {
    return 'Informe uma API-key válida (mínimo 20 caracteres).';
  }

  if (/\s/.test(apiKey)) {
    return 'A API-key não pode conter espaços.';
  }

  return null;
};

export const getUserApiKey = (userId: string): DecryptedKey | null => {
  const stored = store.get(userId);
  if (!stored) {
    return null;
  }

  const apiKey = decrypt(stored);
  return {
    apiKey,
    last4: stored.last4,
    updatedAt: stored.updatedAt,
  };
};

export const getUserApiKeySummary = (userId: string) => {
  const stored = store.get(userId);
  if (!stored) {
    return null;
  }

  return {
    last4: stored.last4,
    updatedAt: stored.updatedAt,
  };
};

export const saveUserApiKey = (userId: string, apiKey: string) => {
  const payload = encrypt(apiKey);
  const now = new Date().toISOString();
  const last4 = apiKey.slice(-4);
  const existing = store.get(userId);

  store.set(userId, {
    ...payload,
    last4,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  });

  return {
    last4,
    updatedAt: now,
  };
};
