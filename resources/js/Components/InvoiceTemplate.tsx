import { Currency } from '@/types';

export interface Transaction {
    id: number;
    invoice_number: string;
    template_id?: number;
    currency: Currency;
    amount: number;
    rate: number;
    total_idr: number;
    customer_name: string;
    payment_method: string;
    created_at: string;
    type: string;
    user: {
        name: string;
    };
    financial_account?: {
        type: string;
    };
}

interface Props {
    transaction: any;
    templateId: number;
    items: any[];
    invoiceTemplate?: {
        company_name: string;
        address: string;
        footer_note?: string; // ⬅️ WAJIB OPTIONAL
    };
}

type LayoutItem = {
    key: string; // contoh: "invoice_number", "customer_name", dll
    label?: string;
    show?: boolean;
};

export default function InvoiceTemplate({
    transaction,
    templateId,
    items,
    invoiceTemplate,
}: Props) {
    console.log('invoiceTemplate:', invoiceTemplate);

    const companyName =
        invoiceTemplate?.company_name || 'PT. MONEY CHANGER SEJAHTERA';

    const companyAddress =
        invoiceTemplate?.address ||
        'Jl. Jendral Sudirman No. 88, Jakarta Pusat\nTelp: 021-555-9999';

    const footerNote =
        invoiceTemplate?.footer_note ||
        'Terima kasih. Harap hitung kembali uang Anda sebelum meninggalkan kasir.';

    const formatIDR = (val: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(val);

    const renderValue = (key: string) => {
        switch (key) {
            case 'invoice_number':
                return transaction.invoice_number;

            case 'customer_name':
                return transaction.customer_name;

            case 'created_at':
                return new Date(transaction.created_at).toLocaleString('id-ID');

            case 'currency_code':
                return transaction.currency.code;

            case 'amount':
                return Number(transaction.amount).toLocaleString('id-ID');

            case 'rate':
                return Number(transaction.rate).toLocaleString('id-ID');

            case 'total_idr':
                return formatIDR(transaction.total_idr);

            case 'payment_method':
                return paymentMethod;

            case 'type':
                return transaction.type;

            default:
                return '-';
        }
    };

    const renderItems = () => {
        if (!items || items.length === 0) return null;

        return (
            <div className="w-full rounded-md border border-gray-300 bg-white p-4 text-black">
                <div className="mb-3 text-lg font-bold">
                    NOTA (Custom Layout)
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                    {items.map((it: any, idx: number) => {
                        const item: LayoutItem = {
                            key: it.key ?? it.field ?? it.name ?? '',
                            label: it.label ?? it.title ?? it.key ?? 'Field',
                            show: it.show ?? true,
                        };

                        if (!item.key) return null;
                        if (item.show === false) return null;

                        return (
                            <div
                                key={`${item.key}-${idx}`}
                                className="rounded border border-gray-200 p-2"
                            >
                                <div className="text-xs font-semibold text-gray-500">
                                    {item.label}
                                </div>
                                <div className="font-mono text-sm">
                                    {renderValue(item.key)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const paymentMethod =
        transaction.financial_account?.type ||
        transaction.payment_method ||
        'CASH';

    const isUSD = transaction.currency.code === 'USD';
    const isUSDC = transaction.currency.code === 'USDC';

    if (templateId === 1) {
        return (
            <div className="relative w-full">
                <div className="w-full overflow-visible border-2 border-dashed border-gray-400 bg-white p-1 font-mono text-sm text-black shadow-sm">
                    <div className="flex min-w-[800px] border border-black">
                        {/* LEFT SIDE */}
                        <div className="flex w-1/4 flex-col justify-between border-r border-black p-4">
                            <div>
                                <div className="mb-6">
                                    <p className="mb-1 font-bold">Payment :</p>
                                    <p className="text-lg uppercase">
                                        {paymentMethod}
                                    </p>
                                </div>

                                <div className="relative">
                                    <p className="mb-1 font-bold">Amount :</p>

                                    <div className="relative h-8">
                                        <p className="text-xl font-bold">
                                            {formatIDR(transaction.total_idr)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* SIGNATURE */}
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

                        {/* RIGHT SIDE */}
                        <div className="w-3/4 p-0">
                            {/* HEADER */}
                            <div className="flex items-center border-b border-black p-4">
                                <div className="mr-4 text-4xl font-black text-blue-800">
                                    $
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold uppercase">
                                        {companyName}
                                    </h1>
                                    <p className="text-xs">
                                        Penukaran Valuta Asing
                                    </p>
                                    {companyAddress
                                        .split('\n')
                                        .map((line, idx) => (
                                            <p key={idx} className="text-xs">
                                                {line}
                                            </p>
                                        ))}
                                </div>
                            </div>

                            {/* TABLE HEADER */}
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

                            {/* TABLE BODY */}
                            <div className="flex h-32 text-center">
                                {/* CURRENCY */}
                                <div className="w-1/4 border-r border-black py-4 text-lg font-bold">
                                    {transaction.currency.code}
                                </div>

                                {/* AMOUNT */}
                                <div className="w-1/4 border-r border-black py-4">
                                    {Number(transaction.amount).toLocaleString(
                                        'id-ID',
                                    )}
                                </div>

                                {/* RATE */}
                                <div className="w-1/4 border-r border-black py-4">
                                    {formatIDR(transaction.rate)}
                                </div>

                                {/* TOTAL */}
                                <div className="w-1/4 py-4 font-bold">
                                    {formatIDR(transaction.total_idr)}
                                </div>
                            </div>

                            {/* FOOTER INFO */}
                            <div className="relative flex border-t border-black">
                                <div className="w-1/2 border-r border-black p-2">
                                    <p className="text-xs font-bold">
                                        JUAL KE / SOLD TO :
                                    </p>
                                    <p className="mt-1 font-medium uppercase">
                                        {transaction.customer_name ||
                                            '.........................'}
                                    </p>
                                </div>

                                <div className="flex w-1/2">
                                    <div className="w-1/2 border-r border-black p-2">
                                        <p className="text-xs font-bold">
                                            NO :
                                        </p>
                                        <p className="mt-1">
                                            {transaction.invoice_number ||
                                                `TRX-${new Date()
                                                    .getTime()
                                                    .toString()
                                                    .slice(-6)}`}
                                        </p>
                                    </div>

                                    <div className="w-1/2 p-2">
                                        <p className="text-xs font-bold">
                                            DATE :
                                        </p>
                                        <p className="mt-1">
                                            {new Date(
                                                transaction.created_at,
                                            ).toLocaleDateString('id-ID')}
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

    if (templateId === 2) {
        return (
            <div className="w-full border border-black bg-white p-4 font-mono text-sm text-black">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold">USD RECEIPT</h1>
                    <p>{companyName}</p>
                    <p>USD SPECIAL TRANSACTION</p>
                </div>

                <div className="mb-4 flex justify-between border-b border-black pb-4">
                    <div>
                        <p>INV: {transaction.invoice_number}</p>
                        <p>
                            DATE:{' '}
                            {new Date(
                                transaction.created_at,
                            ).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="text-right">
                        <p>CUSTOMER: {transaction.customer_name}</p>
                    </div>
                </div>

                <div className="mb-8">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-black">
                                <th className="text-left">CURRENCY</th>
                                <th className="text-center">AMOUNT</th>
                                <th className="text-center">RATE</th>
                                <th className="text-right">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="py-2">
                                    {transaction.currency.code}
                                </td>
                                <td className="text-center">
                                    {transaction.amount}
                                </td>
                                <td className="text-center">
                                    {formatIDR(transaction.rate)}
                                </td>
                                <td className="text-right">
                                    {formatIDR(transaction.total_idr)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="border-t border-black pt-2 text-right text-xl font-bold">
                    GRAND TOTAL: {formatIDR(transaction.total_idr)}
                </div>
            </div>
        );
    }

    if (templateId === 3) {
        return (
            <div className="w-full rounded-xl border-2 border-blue-900 bg-white p-6 font-sans text-sm text-blue-900">
                <div className="mb-6 border-b-2 border-blue-900 pb-4 text-center">
                    <h1 className="text-3xl font-bold tracking-widest">USDC</h1>
                    <p className="font-bold">DIGITAL CURRENCY NOTE</p>
                </div>

                <div className="mb-6 grid grid-cols-2 gap-4">
                    <div>
                        <span className="block text-xs font-bold opacity-50">
                            CUSTOMER
                        </span>
                        <span className="text-lg">
                            {transaction.customer_name}
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="block text-xs font-bold opacity-50">
                            INVOICE
                        </span>
                        <span className="text-lg">
                            {transaction.invoice_number}
                        </span>
                    </div>
                </div>

                <div className="mb-4 flex items-center justify-between rounded-lg bg-blue-50 p-4">
                    <div>
                        <span className="block text-xs font-bold">
                            AMOUNT (USDC)
                        </span>
                        <span className="text-2xl font-bold">
                            {transaction.amount}
                        </span>
                    </div>
                    <div>
                        <span className="block text-right text-xs font-bold">
                            RATE
                        </span>
                        <span className="text-xl">
                            {formatIDR(transaction.rate)}
                        </span>
                    </div>
                </div>

                <div className="border-t border-blue-200 pt-4 text-center">
                    TOTAL RP: {formatIDR(transaction.total_idr)}
                </div>
            </div>
        );
    }

    if (templateId === 4) {
        return (
            <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 text-black shadow-md">
                {/* HEADER */}
                <div className="mb-6 flex items-start justify-between border-b border-gray-200 pb-4">
                    <div>
                        <h1 className="text-xl font-bold uppercase tracking-wide">
                            {companyName}
                        </h1>
                        {companyAddress.split('\n').map((line, idx) => (
                            <p key={idx} className="text-xs text-gray-500">
                                {line}
                            </p>
                        ))}
                    </div>

                    <div className="text-right">
                        <p className="text-xs font-semibold text-gray-500">
                            INVOICE
                        </p>
                        <p className="text-lg font-bold">
                            {transaction.invoice_number}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                            {new Date(transaction.created_at).toLocaleString(
                                'id-ID',
                            )}
                        </p>
                    </div>
                </div>

                {/* INFO */}
                <div className="mb-6 grid grid-cols-2 gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div>
                        <p className="text-xs font-semibold text-gray-500">
                            CUSTOMER
                        </p>
                        <p className="text-base font-bold uppercase">
                            {transaction.customer_name || '-'}
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="text-xs font-semibold text-gray-500">
                            PAYMENT METHOD
                        </p>
                        <p className="text-base font-bold uppercase">
                            {paymentMethod}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-semibold text-gray-500">
                            TYPE
                        </p>
                        <p className="text-sm font-medium uppercase">
                            {transaction.type || '-'}
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="text-xs font-semibold text-gray-500">
                            CREATED BY
                        </p>
                        <p className="text-sm font-medium">
                            {transaction.user?.name || '-'}
                        </p>
                    </div>
                </div>

                {/* TABLE */}
                <div className="overflow-hidden rounded-xl border border-gray-200">
                    <div className="grid grid-cols-4 bg-gray-100 text-center text-xs font-bold uppercase text-gray-600">
                        <div className="border-r border-gray-200 p-3">
                            Mata Uang
                        </div>
                        <div className="border-r border-gray-200 p-3">
                            Jumlah
                        </div>
                        <div className="border-r border-gray-200 p-3">Kurs</div>
                        <div className="p-3">Total</div>
                    </div>

                    <div className="grid grid-cols-4 text-center text-sm">
                        <div className="border-r border-gray-200 p-4 text-lg font-bold">
                            {transaction.currency.code}
                        </div>
                        <div className="border-r border-gray-200 p-4">
                            {Number(transaction.amount).toLocaleString('id-ID')}
                        </div>
                        <div className="border-r border-gray-200 p-4">
                            {formatIDR(transaction.rate)}
                        </div>
                        <div className="p-4 font-bold">
                            {formatIDR(transaction.total_idr)}
                        </div>
                    </div>
                </div>

                {/* TOTAL SUMMARY */}
                <div className="mt-6 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
                    <div>
                        <p className="text-xs font-semibold text-gray-500">
                            GRAND TOTAL
                        </p>
                        <p className="text-xl font-black">
                            {formatIDR(transaction.total_idr)}
                        </p>
                    </div>

                    <div className="text-right text-xs text-gray-500">
                        {/* <p>Terima kasih 🙏</p>
                        <p>Harap simpan nota ini sebagai bukti transaksi</p> */}
                        {footerNote}
                    </div>
                </div>

                {/* SIGNATURE */}
                <div className="mt-6 grid grid-cols-3 gap-4 text-center text-xs text-gray-600">
                    <div className="rounded-xl border border-gray-200 p-4">
                        <div className="mb-10 h-[1px] w-full bg-gray-300"></div>
                        Authorized
                    </div>
                    <div className="rounded-xl border border-gray-200 p-4">
                        <div className="mb-10 h-[1px] w-full bg-gray-300"></div>
                        Kasir
                    </div>
                    <div className="rounded-xl border border-gray-200 p-4">
                        <div className="mb-10 h-[1px] w-full bg-gray-300"></div>
                        Nasabah
                    </div>
                </div>
            </div>
        );
    }

    // fallback kalau templateId gak cocok
    return (
        <div className="w-full bg-white p-4 text-sm text-black">
            <p className="font-bold">Template tidak ditemukan.</p>
        </div>
    );
}
