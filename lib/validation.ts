import { templates, type PlatformKey } from './templates';

type ValidationResult = {
  isValid: boolean;
  issues: string[];
};

export const validatePost = (platform: PlatformKey, content: string): ValidationResult => {
  const issues: string[] = [];
  const trimmed = content.trim();

  if (!trimmed) {
    issues.push('O conteúdo não pode ficar em branco.');
  }

  const maxLength = templates[platform].maxLength;
  if (trimmed.length > maxLength) {
    issues.push(`O conteúdo excede o limite de ${maxLength} caracteres.`);
  }

  if (!trimmed.includes('?')) {
    issues.push('Inclua uma pergunta para estimular comentários.');
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
};
