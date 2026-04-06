'use client'
import { TemplateId, templates } from '@/lib/templates'

interface TemplateSelectorProps {
  selected: TemplateId
  onChange: (id: TemplateId) => void
}

export function TemplateSelector({ selected, onChange }: TemplateSelectorProps) {
  return (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value as TemplateId)}
      className="h-10 px-3 rounded-md border border-gray-200 bg-white"
    >
      {templates.map((t) => (
        <option key={t.id} value={t.id}>
          {t.name}
        </option>
      ))}
    </select>
  )
}