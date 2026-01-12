"use client";

import { useChatStore } from "@/store/chat-store";

export default function ChatShell() {
  const { messages, addMessage } = useChatStore();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const prompt = formData.get("prompt")?.toString().trim();

    if (!prompt) {
      return;
    }

    addMessage({ role: "user", content: prompt });
    addMessage({
      role: "assistant",
      content: "Em breve responderemos com conteúdo gerado pela IA."
    });

    event.currentTarget.reset();
  };

  return (
    <section className="flex w-full max-w-5xl flex-col gap-6 rounded-3xl border border-white/10 bg-panel/80 p-8 shadow-xl">
      <header className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[0.2em] text-white/40">
          Publisher Dev
        </p>
        <h1 className="text-3xl font-semibold text-white">
          Seu estúdio de criação para redes sociais
        </h1>
        <p className="max-w-2xl text-white/60">
          Envie um tema e receba um post completo, pronto para publicar e agendar em
          múltiplas plataformas.
        </p>
      </header>

      <div className="flex min-h-[320px] flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-6">
        {messages.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-white/40">
            Comece descrevendo o tema que deseja publicar.
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                message.role === "user"
                  ? "ml-auto max-w-[70%] bg-accent text-white"
                  : "mr-auto max-w-[70%] bg-white/10 text-white/80"
              }`}
            >
              {message.content}
            </div>
          ))
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-4"
      >
        <label className="text-xs uppercase tracking-[0.2em] text-white/50">
          Prompt
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            name="prompt"
            placeholder="Ex: 5 dicas para engajar no LinkedIn..."
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
          />
          <button
            type="submit"
            className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            Enviar
          </button>
        </div>
      </form>
    </section>
  );
}
