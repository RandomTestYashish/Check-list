import * as Checkbox from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import type { ChecklistItem } from '@/data/checklist'
import { cn } from '@/lib/utils'

export function ChecklistRow({
  item,
  checked,
  onToggle,
}: {
  item: ChecklistItem
  checked: boolean
  onToggle: () => void
}) {
  return (
    <Checkbox.Root
      checked={checked}
      onCheckedChange={onToggle}
      className={cn(
        'group flex w-full cursor-pointer items-start gap-3.5 py-3 text-left',
        // A comfortable thumb target without making the row look like a button.
        'min-h-11 rounded-[3px] px-1 -mx-1 transition-colors hover:bg-paper-edge/70',
      )}
    >
      <span
        className={cn(
          'mt-[3px] grid size-[18px] shrink-0 place-items-center rounded-[3px] border transition-colors duration-100',
          checked ? 'border-accent bg-accent/10' : 'border-rule-strong bg-transparent',
        )}
      >
        <Checkbox.Indicator forceMount>
          <Check
            className={cn(
              'size-3 text-accent transition-opacity duration-100',
              checked ? 'opacity-100' : 'opacity-0',
            )}
            strokeWidth={3}
          />
        </Checkbox.Indicator>
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={cn(
            'block text-[0.9375rem] leading-snug transition-colors duration-150',
            checked ? 'text-ink-faint line-through decoration-rule-strong' : 'text-ink',
          )}
        >
          {item.label}
        </span>
        {item.note && (
          <span
            className={cn(
              'mt-0.5 block text-[0.75rem] leading-snug transition-colors duration-150',
              checked ? 'text-ink-faint/70' : 'text-ink-muted',
            )}
          >
            {item.note}
          </span>
        )}
      </span>
    </Checkbox.Root>
  )
}
