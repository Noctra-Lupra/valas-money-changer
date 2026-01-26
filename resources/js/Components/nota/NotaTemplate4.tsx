import React, { useRef } from 'react';

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
                position: 'absolute',
                left: item.x,
                top: item.y,
                fontSize: item.fontSize,
                fontWeight: item.bold ? 'bold' : 'normal',
                cursor: 'grab',
                userSelect: 'none',
                whiteSpace: 'nowrap',
                zIndex: 50,
            }}
        >
            {text}
        </div>
    );
}

export default function NotaTemplate4(props: NotaProps) {
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
            onDrag?.(
                itemId,
                ev.clientX - dragPos.current.x,
                ev.clientY - dragPos.current.y,
            );
            dragPos.current = { x: ev.clientX, y: ev.clientY };
        };

        const up = () => {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', up);
        };

        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', up);
    };

    const getItemById = (id: string) => items?.find((i) => i.id === id);

    return (
        <div className="relative w-full overflow-x-auto border-2 border-dashed border-gray-400 bg-white p-1 font-mono text-sm text-black shadow-sm">
            <div className="relative min-w-full border-2 border-black p-6 font-mono">
                {/* TITLE */}
                <div className="relative mb-4 flex justify-center">
                    <h1 className="text-center text-lg font-bold">
                        NOTA TRANSAKSI
                    </h1>
                </div>

                {/* GRID INFO */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    {/* CUSTOMER */}
                    <div className="relative">
                        <p>Customer</p>
                        <div className="relative h-6">
                            <EditableText
                                item={getItemById('customer')}
                                text={
                                    <p className="font-bold">
                                        {data?.customer_name || '—'}
                                    </p>
                                }
                                onMouseDown={(e) =>
                                    handleMouseDown(e, 'customer')
                                }
                            />
                        </div>
                    </div>

                    {/* CURRENCY */}
                    <div className="relative">
                        <p>Currency</p>
                        <div className="relative h-6">
                            <EditableText
                                item={getItemById('currency')}
                                text={
                                    <p className="font-bold">
                                        {selectedCurrency?.code ?? '-'}
                                    </p>
                                }
                                onMouseDown={(e) =>
                                    handleMouseDown(e, 'currency')
                                }
                            />
                        </div>
                    </div>

                    {/* PAYMENT */}
                    <div className="relative">
                        <p>Payment</p>
                        <div className="relative h-6">
                            <EditableText
                                item={getItemById('payment')}
                                text={
                                    <p className="font-bold">
                                        {data?.payment_method ?? '-'}
                                    </p>
                                }
                                onMouseDown={(e) =>
                                    handleMouseDown(e, 'payment')
                                }
                            />
                        </div>
                    </div>

                    {/* TOTAL */}
                    <div className="relative">
                        <p>Total</p>
                        <div className="relative h-6">
                            <EditableText
                                item={getItemById('total')}
                                text={
                                    <p className="font-bold">
                                        {formatIDR(total)}
                                    </p>
                                }
                                onMouseDown={(e) => handleMouseDown(e, 'total')}
                            />
                        </div>
                    </div>
                </div>

                {/* OPTIONAL: AMOUNT + RATE (kalau kamu mau tetap bisa drag juga walau ga ditampilkan sebelumnya) */}
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="relative">
                        <p>Amount</p>
                        <div className="relative h-6">
                            <EditableText
                                item={getItemById('amount')}
                                text={
                                    <p className="font-bold">
                                        {amount ? formatNumber(amount) : '-'}
                                    </p>
                                }
                                onMouseDown={(e) =>
                                    handleMouseDown(e, 'amount')
                                }
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <p>Rate</p>
                        <div className="relative h-6">
                            <EditableText
                                item={getItemById('rate')}
                                text={
                                    <p className="font-bold">
                                        {customRate
                                            ? formatIDR(Number(customRate))
                                            : '-'}
                                    </p>
                                }
                                onMouseDown={(e) => handleMouseDown(e, 'rate')}
                            />
                        </div>
                    </div>
                </div>

                {/* SIGNATURE */}
                <div className="mt-10 flex justify-between">
                    <div className="relative">
                        <div className="mb-1 h-0.5 w-32 bg-black"></div>
                        <div className="relative h-5">
                            <EditableText
                                item={getItemById('sign_kasir')}
                                text={'Kasir'}
                                onMouseDown={(e) =>
                                    handleMouseDown(e, 'sign_kasir')
                                }
                            />
                        </div>
                    </div>

                    <div className="relative text-right">
                        <div className="mb-1 h-0.5 w-32 bg-black"></div>
                        <div className="relative h-5">
                            <EditableText
                                item={getItemById('sign_nasabah')}
                                text={'Nasabah'}
                                onMouseDown={(e) =>
                                    handleMouseDown(e, 'sign_nasabah')
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
