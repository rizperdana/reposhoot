'use client'
import { TemplateId, templates } from '@/lib/templates'

interface TemplateSelectorProps {
  selected: TemplateId
  onChange: (id: TemplateId) => void
}

export function TemplateSelector({ selected, onChange }: TemplateSelectorProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {templates.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
            selected === t.id 
              ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
              : 'bg-white/5 text-white/50 border border-white/5 hover:text-white/80 hover:border-white/10'
          }`}
        >
          {t.name}
        </button>
      ))}
    </div>
  )
}