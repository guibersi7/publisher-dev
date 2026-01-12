import { templates, type PlatformKey } from './templates';
import { validatePost } from './validation';

type GenerationResult = {
  content: string;
  validation: ReturnType<typeof validatePost>;
};

export const generatePost = (prompt: string, platform: PlatformKey): GenerationResult => {
  const template = templates[platform];
  const content = template.buildPost(prompt);
  const validation = validatePost(platform, content);

  return { content, validation };
};
