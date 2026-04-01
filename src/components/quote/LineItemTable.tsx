import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import type { UseFormRegister, FieldErrors, UseFieldArrayMove, UseFieldArrayAppend } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import type { SalesforceQuote } from '../../types/quote';
import { LineItemRow } from './LineItemRow';
import { Button } from '../ui/Button';

interface LineItemTableProps {
  fields: { id: string }[];
  register: UseFormRegister<SalesforceQuote>;
  errors: FieldErrors<SalesforceQuote>;
  onRemove: (index: number) => void;
  onMove: UseFieldArrayMove;
  onAppend: UseFieldArrayAppend<SalesforceQuote, 'lineItems'>;
  watchedItems: SalesforceQuote['lineItems'];
}

export function LineItemTable({ fields, register, errors, onRemove, onMove, onAppend, watchedItems }: LineItemTableProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex(f => f.id === active.id);
      const newIndex = fields.findIndex(f => f.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onMove(oldIndex, newIndex);
      }
    }
  }

  function addLineItem() {
    onAppend({
      id: uuidv4(),
      sortOrder: fields.length + 1,
      productName: '',
      productCode: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
    });
  }

  return (
    <div className="bg-white rounded-lg border border-[#dddbda] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#dddbda] flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#181818]">Line Items</h3>
        <Button type="button" size="sm" variant="secondary" onClick={addLineItem}>
          <Plus size={12} /> Add Line Item
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="border-b border-[#dddbda] bg-[#f4f6f9]">
              <th className="w-8 px-2 py-2"></th>
              <th className="w-8 px-2 py-2 text-left text-xs font-semibold text-[#706e6b] uppercase tracking-wide">#</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-[#706e6b] uppercase tracking-wide">Product</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-[#706e6b] uppercase tracking-wide">Code</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-[#706e6b] uppercase tracking-wide">Description</th>
              <th className="w-20 px-2 py-2 text-right text-xs font-semibold text-[#706e6b] uppercase tracking-wide">Qty</th>
              <th className="w-28 px-2 py-2 text-right text-xs font-semibold text-[#706e6b] uppercase tracking-wide">Unit Price</th>
              <th className="w-20 px-2 py-2 text-right text-xs font-semibold text-[#706e6b] uppercase tracking-wide">Discount</th>
              <th className="w-28 px-2 py-2 text-right text-xs font-semibold text-[#706e6b] uppercase tracking-wide">Total</th>
              <th className="w-8 px-2 py-2"></th>
            </tr>
          </thead>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
              <tbody>
                {fields.map((field, index) => (
                  <LineItemRow
                    key={field.id}
                    index={index}
                    itemId={field.id}
                    register={register}
                    errors={errors}
                    onRemove={() => onRemove(index)}
                    watchedItem={watchedItems?.[index]}
                  />
                ))}
              </tbody>
            </SortableContext>
          </DndContext>
        </table>
        {fields.length === 0 && (
          <div className="py-10 text-center text-sm text-[#706e6b]">
            No line items yet.{' '}
            <button type="button" onClick={addLineItem} className="text-[#0070D2] hover:underline cursor-pointer">
              Add one
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
