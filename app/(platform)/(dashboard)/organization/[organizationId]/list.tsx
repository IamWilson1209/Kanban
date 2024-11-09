import { deleteBoard } from '@/actions/delete-board';
import { FormDeleteButton } from './formdeletebutton';

interface BoardProps {
  id: string;
  title: string;
}

export const SimpleList = ({ id, title }: BoardProps) => {
  // 1st argument: this 參照，不用的話用 null 代替
  // 依然按照 server, client 分離原則，bind 只是允許一個server的操作傳遞給表單
  const handledeleteBoard = deleteBoard.bind(null, id);

  return (
    // handledeleteBoard 預期 backend url 而非 js function
    <form action={handledeleteBoard} className="flex items-center gap-x-2">
      <div className="space-y-2">
        <p>Board title: {title}</p>
        <FormDeleteButton />
      </div>
    </form>
  );
};
