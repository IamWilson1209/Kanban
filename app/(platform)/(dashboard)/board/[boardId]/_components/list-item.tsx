'use client';

import { ListWithCards } from '@/type';
import { ListHeader } from './list-header';
import { useRef, useState } from 'react';
import { CardForm } from './card-form';
import { cn } from '@/lib/utils';
import { CardItem } from './card-items';
import { Draggable, Droppable } from '@hello-pangea/dnd';

interface ListItemProps {
  data: ListWithCards;
  index: number;
}

export const ListItem = ({ data, index }: ListItemProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [isEditing, setIsEditing] = useState(false);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textAreaRef.current?.focus();
      textAreaRef.current?.select();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };
  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="shrink-0 h-full w-[272px] select-none"
        >
          <div
            {...provided.dragHandleProps}
            className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2"
          >
            <ListHeader onAddCard={enableEditing} data={data} />
            <Droppable droppableId={data.id} type="card">
              {(provided) => (
                <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    'flex flex-col gap-y-2 mx-1 px-1 py-1',
                    data.cards.length > 0 ? 'mt-2' : 'mt-0'
                  )}
                >
                  {data.cards.map((card, index) => (
                    <CardItem index={index} key={card.id} data={card} />
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
            <CardForm
              listId={data.id}
              ref={textAreaRef}
              isEditing={isEditing}
              enableEditing={enableEditing}
              disableEditing={disableEditing}
            />
          </div>
        </li>
      )}
    </Draggable>
  );
};
