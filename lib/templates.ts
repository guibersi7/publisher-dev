export type PlatformKey = 'linkedin';

type TemplateConfig = {
  platform: PlatformKey;
  label: string;
  description: string;
  maxLength: number;
  buildPost: (prompt: string) => string;
};

const linkedinTemplate: TemplateConfig = {
  platform: 'linkedin',
  label: 'LinkedIn',
  description: 'Tom profissional com chamada para ação curta e até 3 hashtags.',
  maxLength: 3000,
  buildPost: (prompt) => {
    const headline = prompt.trim().replace(/\.$/, '');
    return [
      `Ideia principal: ${headline}`,
      '',
      '• Contexto rápido: por que isso importa agora.',
      '• Insight acionável: o que testar ou aplicar hoje.',
      '• Pergunta: como você tem visto esse tema?',
      '',
      '#marketing #produtividade #conteudo',
    ].join('\n');
  },
};

export const templates = {
  linkedin: linkedinTemplate,
} satisfies Record<PlatformKey, TemplateConfig>;

export const templateList = Object.values(templates);
