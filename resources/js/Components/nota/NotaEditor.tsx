import { useRef } from 'react';

export default function NotaEditor({
  items,
  setItems,
  children,
}: any) {
  const handleDrag = (id: string, dx: number, dy: number) => {
    setItems((prev: any[]) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, x: item.x + dx, y: item.y + dy }
          : item,
      ),
    );
  };

  return (
    <div className="relative">
      {children(handleDrag)}
    </div>
  );
}
