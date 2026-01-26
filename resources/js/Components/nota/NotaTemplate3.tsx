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

export default function NotaTemplate3(props: NotaProps) {
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
            <div className="relative min-w-full border border-gray-800 p-6 font-sans">
                {/* HEADER */}
                <div className="mb-4 flex justify-between">
                    <div className="relative">
                        <div className="relative h-7">
                            <EditableText
                                item={getItemById('company_name')}
                                text={
                                    <h1 className="text-xl font-bold">
                                        Money Changer
                                    </h1>
                                }
                                onMouseDown={(e) =>
                                    handleMouseDown(e, 'company_name')
                                }
                            />
                        </div>

                        <div className="relative h-4">
                            <EditableText
                                item={getItemById('company_city')}
                                text={<p className="text-xs">Jakarta</p>}
                                onMouseDown={(e) =>
                                    handleMouseDown(e, 'company_city')
                                }
                            />
                        </div>
                    </div>

                    <div className="relative text-right text-sm">
                        <div className="relative h-5">
                            <EditableText
                                item={getItemById('trx_number')}
                                text={`#${Date.now().toString().slice(-6)}`}
                                onMouseDown={(e) =>
                                    handleMouseDown(e, 'trx_number')
                                }
                            />
                        </div>

                        <div className="relative h-5">
                            <EditableText
                                item={getItemById('date')}
                                text={new Date().toLocaleDateString('id-ID')}
                                onMouseDown={(e) => handleMouseDown(e, 'date')}
                            />
                        </div>
                    </div>
                </div>

                {/* TABLE */}
                <table className="w-full border text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2">Valas</th>
                            <th className="border p-2">Jumlah</th>
                            <th className="border p-2">Kurs</th>
                            <th className="border p-2">Total</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr className="text-center">
                            {/* VALAS */}
                            <td className="relative border p-2">
                                <div className="relative flex h-5 items-center justify-center">
                                    <EditableText
                                        item={getItemById('currency')}
                                        text={selectedCurrency?.code ?? '-'}
                                        onMouseDown={(e) =>
                                            handleMouseDown(e, 'currency')
                                        }
                                    />
                                </div>
                            </td>

                            {/* JUMLAH */}
                            <td className="relative border p-2">
                                <div className="relative flex h-5 items-center justify-center">
                                    <EditableText
                                        item={getItemById('amount')}
                                        text={
                                            amount ? formatNumber(amount) : '-'
                                        }
                                        onMouseDown={(e) =>
                                            handleMouseDown(e, 'amount')
                                        }
                                    />
                                </div>
                            </td>

                            {/* KURS */}
                            <td className="relative border p-2">
                                <div className="relative flex h-5 items-center justify-center">
                                    <EditableText
                                        item={getItemById('rate')}
                                        text={
                                            customRate
                                                ? formatIDR(Number(customRate))
                                                : '-'
                                        }
                                        onMouseDown={(e) =>
                                            handleMouseDown(e, 'rate')
                                        }
                                    />
                                </div>
                            </td>

                            {/* TOTAL */}
                            <td className="relative border p-2 font-bold">
                                <div className="relative flex h-5 items-center justify-center">
                                    <EditableText
                                        item={getItemById('total')}
                                        text={formatIDR(total)}
                                        onMouseDown={(e) =>
                                            handleMouseDown(e, 'total')
                                        }
                                    />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* FOOTER INFO */}
                <div className="mt-4 space-y-2 text-sm">
                    {/* CUSTOMER */}
                    <div className="relative flex items-start gap-2">
                        <span className="w-[80px]">Customer:</span>

                        <div className="relative min-h-[24px] flex-1">
                            <EditableText
                                item={getItemById('customer')}
                                text={<b>{data?.customer_name || '-'}</b>}
                                onMouseDown={(e) =>
                                    handleMouseDown(e, 'customer')
                                }
                            />
                        </div>
                    </div>

                    {/* PAYMENT */}
                    <div className="relative flex items-start gap-2">
                        <span className="w-[80px]">Payment:</span>

                        <div className="relative min-h-[24px] flex-1">
                            <EditableText
                                item={getItemById('payment')}
                                text={<b>{data?.payment_method ?? '-'}</b>}
                                onMouseDown={(e) =>
                                    handleMouseDown(e, 'payment')
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
