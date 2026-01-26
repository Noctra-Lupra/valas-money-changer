import React, { useRef } from "react";

type EditorItem = {
  id: string;
  content: string;
  x: number;
  y: number;
  fontSize: number;
  bold?: boolean;
};

type NotaProps = {
  items?: EditorItem[];
  onDrag?: (id: string, dx: number, dy: number) => void;

  data: any;
  total: number;
  selectedCurrency: any;
  amount: any;
  customRate: any;
  formatIDR: any;
  formatNumber: any;
};

function EditableText({
  item,
  text,
  onMouseDown,
}: {
  item?: EditorItem;
  text: React.ReactNode;
  onMouseDown?: (e: React.MouseEvent) => void;
}) {
  if (!item) return <>{text}</>;

  return (
    <div
      onMouseDown={onMouseDown}
      style={{
        position: "absolute",
        left: item.x,
        top: item.y,
        fontSize: item.fontSize,
        fontWeight: item.bold ? "bold" : "normal",
        cursor: "grab",
        userSelect: "none",
        whiteSpace: "nowrap",
        zIndex: 50,
      }}
    >
      {text}
    </div>
  );
}

export default function NotaTemplate2(props: NotaProps) {
  const {
    data,
    selectedCurrency,
    amount,
    customRate,
    total,
    formatIDR,
    formatNumber,
    items,
    onDrag,
  } = props;

  const dragPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    dragPos.current = { x: e.clientX, y: e.clientY };

    const move = (ev: MouseEvent) => {
      onDrag?.(itemId, ev.clientX - dragPos.current.x, ev.clientY - dragPos.current.y);
      dragPos.current = { x: ev.clientX, y: ev.clientY };
    };

    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const getItemById = (id: string) => items?.find((i) => i.id === id);

  return (
    <div className="relative w-full overflow-x-auto border-2 border-dashed border-gray-400 bg-white p-1 font-mono text-sm text-black shadow-sm">
      <div className="relative w-full border border-black p-4 font-mono text-xs">
        {/* HEADER */}
        <div className="relative text-center">
          <div className="relative h-6 w-full">
            <EditableText
              item={getItemById("title")}
              text={<h1 className="font-bold uppercase">PT. MONEY CHANGER</h1>}
              onMouseDown={(e) => handleMouseDown(e, "title")}
            />
          </div>

          <div className="relative h-5 w-full">
            <EditableText
              item={getItemById("address")}
              text={<p className="mb-2">Jl. Sudirman No.88</p>}
              onMouseDown={(e) => handleMouseDown(e, "address")}
            />
          </div>
        </div>

        <div className="my-2 border-t border-dashed" />

        {/* INFO */}
        <div className="relative">
          <div className="flex justify-between relative">
            <span>Tanggal:</span>

            <div className="relative h-4 w-full">
              <EditableText
                item={getItemById("date")}
                text={new Date().toLocaleDateString("id-ID")}
                onMouseDown={(e) => handleMouseDown(e, "date")}
              />
            </div>
          </div>

          <div className="flex justify-between relative">
            <span>Payment:</span>

            <div className="relative h-4 w-full">
              <EditableText
                item={getItemById("payment")}
                text={data?.payment_method ?? "-"}
                onMouseDown={(e) => handleMouseDown(e, "payment")}
              />
            </div>
          </div>
        </div>

        <div className="my-2 border-t border-dashed" />

        {/* DETAIL */}
        <div className="relative">
          <div className="flex justify-between relative">
            <div className="relative h-4 w-full">
              <EditableText
                item={getItemById("currency")}
                text={selectedCurrency?.code ?? "-"}
                onMouseDown={(e) => handleMouseDown(e, "currency")}
              />
            </div>

            <div className="relative h-4 w-full">
              <EditableText
                item={getItemById("amount")}
                text={amount ? formatNumber(amount) : "-"}
                onMouseDown={(e) => handleMouseDown(e, "amount")}
              />
            </div>
          </div>

          <div className="flex justify-between relative">
            <span>Kurs</span>

            <div className="relative h-4 w-full">
              <EditableText
                item={getItemById("rate")}
                text={customRate ? formatIDR(Number(customRate)) : "-"}
                onMouseDown={(e) => handleMouseDown(e, "rate")}
              />
            </div>
          </div>
        </div>

        <div className="my-2 border-t border-dashed" />

        {/* TOTAL */}
        <div className="flex justify-between font-bold relative">
          <span>TOTAL</span>

          <div className="relative h-5 w-full">
            <EditableText
              item={getItemById("total")}
              text={formatIDR(total)}
              onMouseDown={(e) => handleMouseDown(e, "total")}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="relative mt-4 text-center">
          <div className="relative h-5 w-full">
            <EditableText
              item={getItemById("thanks")}
              text="Terima Kasih 🙏"
              onMouseDown={(e) => handleMouseDown(e, "thanks")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
