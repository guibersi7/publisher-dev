'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { PERSONAS, Persona } from '@/lib/constants/personas'
import { ScrollArea } from '@/components/ui/scroll-area'

interface PersonaSelectorProps {
    activePersonaId: string
    onSelectPersona: (persona: Persona) => void
}

export function PersonaSelector({ activePersonaId, onSelectPersona }: PersonaSelectorProps) {
    return (
        <div className="w-80 border-r border-warm-gray/10 bg-warm-white/50 hidden lg:flex flex-col">
            <div className="p-6 border-b border-warm-gray/10">
                <h2 className="font-semibold text-warm-black">Agentes IA</h2>
                <p className="text-sm text-warm-gray">Escolha seu especialista</p>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-3">
                    {PERSONAS.map((persona) => {
                        const Icon = persona.icon
                        const isActive = activePersonaId === persona.id

                        return (
                            <motion.button
                                key={persona.id}
                                onClick={() => onSelectPersona(persona)}
                                className={cn(
                                    "w-full text-left p-3 rounded-xl transition-all border border-transparent",
                                    isActive
                                        ? "bg-white shadow-sm border-warm-gray/10"
                                        : "hover:bg-warm-gray/5"
                                )}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={cn(
                                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                                        isActive ? "bg-orange-accent/10" : "bg-warm-gray/10"
                                    )}>
                                        <Icon className={cn(
                                            "w-5 h-5",
                                            isActive ? persona.color : "text-warm-gray"
                                        )} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className={cn(
                                            "font-medium truncate",
                                            isActive ? "text-warm-black" : "text-warm-gray"
                                        )}>
                                            {persona.name}
                                        </h3>
                                        <p className="text-xs text-warm-gray truncate">
                                            {persona.role}
                                        </p>
                                    </div>
                                </div>
                            </motion.button>
                        )
                    })}
                </div>
            </ScrollArea>
        </div>
    )
}
