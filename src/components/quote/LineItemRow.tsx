import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { SalesforceQuote } from '../../types/quote';
import { lineItemTotal, formatCurrency } from '../../lib/quoteCalculations';

interface LineItemRowProps {
  index: number;
  itemId: string;
  register: UseFormRegister<SalesforceQuote>;
  errors: FieldErrors<SalesforceQuote>;
  onRemove: () => void;
  watchedItem: SalesforceQuote['lineItems'][number];
}

export function LineItemRow({ index, itemId, register, errors, onRemove, watchedItem }: LineItemRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: itemId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  const fieldErrors = (errors.lineItems as Record<number, Record<string, { message?: string }>> | undefined)?.[index];
  const rowTotal = watchedItem ? lineItemTotal(watchedItem) : 0;

  const cellClass = 'px-2 py-1.5';
  const inputClass = 'w-full border border-[#dddbda] rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#0070D2] focus:border-[#0070D2]';

  return (
    <tr ref={setNodeRef} style={style} className="border-b border-[#f3f2f2] hover:bg-[#f9f9f9] group">
      <td className={`${cellClass} w-8`}>
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="text-[#c9c7c5] hover:text-[#706e6b] cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical size={14} />
        </button>
      </td>
      <td className={`${cellClass} text-xs text-[#706e6b] w-8`}>{index + 1}</td>
      <td className={`${cellClass} min-w-[140px]`}>
        <input
          {...register(`lineItems.${index}.productName`)}
          placeholder="Product name"
          className={`${inputClass} ${fieldErrors?.productName ? 'border-[#c23934]' : ''}`}
        />
      </td>
      <td className={`${cellClass} min-w-[80px]`}>
        <input
          {...register(`lineItems.${index}.productCode`)}
          placeholder="Code"
          className={inputClass}
        />
      </td>
      <td className={`${cellClass} min-w-[140px]`}>
        <input
          {...register(`lineItems.${index}.description`)}
          placeholder="Description"
          className={inputClass}
        />
      </td>
      <td className={`${cellClass} w-20`}>
        <input
          type="number"
          min="0"
          step="any"
          {...register(`lineItems.${index}.quantity`, { valueAsNumber: true })}
          className={`${inputClass} text-right`}
        />
      </td>
      <td className={`${cellClass} w-28`}>
        <input
          type="number"
          min="0"
          step="0.01"
          {...register(`lineItems.${index}.unitPrice`, { valueAsNumber: true })}
          className={`${inputClass} text-right`}
          placeholder="0.00"
        />
      </td>
      <td className={`${cellClass} w-20`}>
        <div className="relative">
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            {...register(`lineItems.${index}.discount`, { valueAsNumber: true })}
            className={`${inputClass} text-right pr-5`}
            placeholder="0"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#706e6b]">%</span>
        </div>
      </td>
      <td className={`${cellClass} w-28 text-right font-medium text-sm text-[#181818]`}>
        {formatCurrency(rowTotal)}
      </td>
      <td className={`${cellClass} w-8`}>
        <button
          type="button"
          onClick={onRemove}
          className="text-[#706e6b] hover:text-[#c23934] cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 size={14} />
        </button>
      </td>
    </tr>
  );
}
