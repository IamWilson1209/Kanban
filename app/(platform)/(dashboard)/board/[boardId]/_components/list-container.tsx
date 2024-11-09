'use client';

import { ListWithCards } from '@/type';
import { ListForm } from './list-form';
import { useEffect, useState } from 'react';
import { ListItem } from './list-item';

import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useAction } from '@/hooks/use-action';
import { updateListOrder } from '@/actions/update-list-order/handler';
import { toast } from 'sonner';
import { updateCardOrder } from '@/actions/update-card-order/handler';

interface ListContainerProps {
  boardId: string;
  data: ListWithCards[];
}

// reorder([1, 2, 3, 4], 1, 3);
// output: [1, 3, 4, 2]
function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export const ListContainer = ({ boardId, data }: ListContainerProps) => {
  const [orderData, setOrderData] = useState(data);

  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success('List order updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update list order');
    },
  });

  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success('Card order updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update card order');
    },
  });

  // 每次移動都要用 useEffect 去 update
  useEffect(() => {
    setOrderData(data);
  }, [data]);

  const handleOnDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    // 如果放在同一位置
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // 如果移動 list
    if (type === 'list') {
      const items = reorder(orderData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index })
      );
      // 每次移動都要用 useEffect 去 update
      setOrderData(items);

      // Server Action更新資料庫
      executeUpdateListOrder({ items, boardId });
    }

    // 如果移動 Card
    if (type === 'card') {
      const newOrderData = [...orderData];

      const sourceList = newOrderData.find(
        (list) => list.id === source.droppableId
      );
      const destList = newOrderData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destList) {
        return;
      }

      // 檢查source list是否有card
      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      // 檢查destination list是否有card
      if (!destList.cards) {
        destList.cards = [];
      }

      // 如果card是在同一個list移動
      if (source.droppableId === destination.droppableId) {
        const reorderCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );

        reorderCards.forEach((card, index) => {
          card.order = index;
        });

        sourceList.cards = reorderCards;

        // 每次移動都要用 useEffect 去 update
        setOrderData(newOrderData);
        executeUpdateCardOrder({ items: reorderCards, boardId });
      } else {
        // 如果card不在同一個list移動

        // 從 source list 移除掉 card
        const movedCard = sourceList.cards.splice(source.index, 1)[0];

        // 更新listId
        movedCard.listId = destination.droppableId;

        // 將 card 加到 destination list
        destList.cards.splice(destination.index, 0, movedCard);

        // 重新排序 card order
        sourceList.cards.forEach((card, index) => {
          card.order = index;
        });
        destList.cards.forEach((card, index) => {
          card.order = index;
        });

        // 每次移動都要用 useEffect 去 update
        setOrderData(newOrderData);
        // executeUpdateCardOrder({ items: sourceList.cards, boardId });
        executeUpdateCardOrder({ items: destList.cards, boardId });
      }
    }
  };
  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderData.map((list, index) => {
              return <ListItem key={list.id} index={index} data={list} />;
            })}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};
