import { useRef } from 'react';

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

export default function NotaTemplate1(props: NotaProps) {
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
        <div className="relative w-full">
            <div className="w-full overflow-visible border-2 border-dashed border-gray-400 bg-white p-1 font-mono text-sm text-black shadow-sm">
                <div className="flex min-w-[800px] border border-black">
                    <div className="flex w-1/4 flex-col justify-between border-r border-black p-4">
                        <div>
                            <div className="mb-6">
                                <p className="mb-1 font-bold">Payment :</p>
                                <p className="text-lg uppercase">
                                    {data.payment_method}
                                </p>
                            </div>
                            <div className="relative">
                                <p className="mb-1 font-bold">Amount :</p>

                                <div className="relative h-8">
                                    <EditableText
                                        item={getItemById('amount_left')}
                                        text={formatIDR(total)}
                                        onMouseDown={(e) =>
                                            handleMouseDown(e, 'amount_left')
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 space-y-8">
                            <div>
                                <div className="mb-1 h-0.5 w-24 bg-black"></div>
                                <p className="text-xs">Authorized</p>
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <div className="mb-1 h-0.5 w-20 bg-black"></div>
                                    <p className="text-xs">Kasir</p>
                                </div>
                                <div className="text-right">
                                    <div className="mb-1 h-0.5 w-20 bg-black"></div>
                                    <p className="text-xs">Nasabah</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-3/4 p-0">
                        <div className="flex items-center border-b border-black p-4">
                            <div className="mr-4 text-4xl font-black text-blue-800">
                                $
                            </div>
                            <div>
                                <h1 className="text-xl font-bold uppercase">
                                    PT. MONEY CHANGER SEJAHTERA
                                </h1>
                                <p className="text-xs">
                                    Penukaran Valuta Asing
                                </p>
                                <p className="text-xs">
                                    Jl. Jendral Sudirman No. 88, Jakarta Pusat
                                </p>
                                <p className="text-xs">Telp: 021-555-9999</p>
                            </div>
                        </div>

                        <div className="flex border-b border-black bg-gray-100 text-center font-bold">
                            <div className="w-1/4 border-r border-black py-2">
                                Mata Uang
                            </div>
                            <div className="w-1/4 border-r border-black py-2">
                                Jumlah
                            </div>
                            <div className="w-1/4 border-r border-black py-2">
                                Kurs
                            </div>
                            <div className="w-1/4 py-2">Jumlah Total</div>
                        </div>

                        <div className="flex h-32 text-center">
                            {/* CURRENCY */}
                            <div className="relative w-1/4 border-r border-black py-4 text-lg font-bold">
                                <EditableText
                                    item={getItemById('currency')}
                                    text={selectedCurrency?.code ?? '-'}
                                    onMouseDown={(e) =>
                                        handleMouseDown(e, 'currency')
                                    }
                                />
                            </div>

                            {/* AMOUNT */}
                            <div className="relative w-1/4 border-r border-black py-4">
                                <EditableText
                                    item={getItemById('amount')}
                                    text={amount ? formatNumber(amount) : '-'}
                                    onMouseDown={(e) =>
                                        handleMouseDown(e, 'amount')
                                    }
                                />
                            </div>

                            {/* RATE (TANPA renderFromItems) */}
                            <div className="relative w-1/4 border-r border-black py-4">
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

                            {/* TOTAL (TANPA renderFromItems) */}
                            <div className="relative w-1/4 py-4 font-bold">
                                <EditableText
                                    item={getItemById('total')}
                                    text={formatIDR(total)}
                                    onMouseDown={(e) =>
                                        handleMouseDown(e, 'total')
                                    }
                                />
                            </div>
                        </div>

                        <div className="relative flex border-t border-black">
                            <div className="w-1/2 border-r border-black p-2">
                                <p className="text-xs font-bold">
                                    JUAL KE / SOLD TO :
                                </p>
                                <p className="mt-1 font-medium uppercase">
                                    <EditableText
                                        item={getItemById('customer')}
                                        text={
                                            data.customer_name ||
                                            '.........................'
                                        }
                                        onMouseDown={(e) =>
                                            handleMouseDown(e, 'customer')
                                        }
                                    />
                                </p>
                            </div>

                            <div className="flex w-1/2">
                                <div className="w-1/2 border-r border-black p-2">
                                    <p className="text-xs font-bold">NO :</p>
                                    <p className="mt-1">
                                        TRX-
                                        {new Date()
                                            .getTime()
                                            .toString()
                                            .slice(-6)}
                                    </p>
                                </div>
                                <div className="w-1/2 p-2">
                                    <p className="text-xs font-bold">DATE :</p>
                                    <p className="mt-1">
                                        {new Date().toLocaleDateString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
