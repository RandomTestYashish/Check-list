import type { ChecklistItem } from '@/data/checklist'
import { Checkbox } from '@/components/ui/checkbox'
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
    <label
      className={cn(
        'group flex min-h-12 cursor-pointer items-start gap-3.5 rounded-2xl px-3 py-3 transition-colors',
        'hover:bg-muted/70 active:bg-muted has-[:focus-visible]:bg-muted/70',
      )}
    >
      <Checkbox checked={checked} onCheckedChange={onToggle} className="mt-px" />

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'text-sm leading-snug transition-colors',
            checked ? 'text-muted-foreground line-through decoration-border' : 'text-card-foreground',
          )}
        >
          {item.label}
        </p>
        {item.note && (
          <p
            className={cn(
              'text-muted-foreground mt-0.5 text-xs leading-snug transition-colors',
              checked && 'opacity-60',
            )}
          >
            {item.note}
          </p>
        )}
      </div>
    </label>
  )
}
