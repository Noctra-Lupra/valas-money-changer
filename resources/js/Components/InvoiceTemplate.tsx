import { Currency } from "@/types";

export interface Transaction {
    id: number;
    invoice_number: string;
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
    transaction: Transaction;
}

export default function InvoiceTemplate({ transaction }: Props) {
    const formatIDR = (val: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

    const paymentMethod = transaction.financial_account?.type || transaction.payment_method || 'CASH';

    // Different layouts based on currency code
    const isUSD = transaction.currency.code === 'USD';
    const isUSDC = transaction.currency.code === 'USDC';

    if (isUSD) {
        return (
            <div className="w-full bg-white text-black font-mono text-sm border border-black p-4">
                <div className="text-center mb-6">
                    <h1 className="font-bold text-2xl">USD RECEIPT</h1>
                    <p>PT. MONEY CHANGER SEJAHTERA</p>
                    <p>USD SPECIAL TRANSACTION</p>
                </div>

                <div className="flex justify-between border-b border-black pb-4 mb-4">
                    <div>
                        <p>INV: {transaction.invoice_number}</p>
                        <p>DATE: {new Date(transaction.created_at).toLocaleDateString()}</p>
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
                                <td className="py-2">{transaction.currency.code}</td>
                                <td className="text-center">{transaction.amount}</td>
                                <td className="text-center">{formatIDR(transaction.rate)}</td>
                                <td className="text-right">{formatIDR(transaction.total_idr)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="text-right font-bold text-xl border-t border-black pt-2">
                    GRAND TOTAL: {formatIDR(transaction.total_idr)}
                </div>
            </div>
        );
    }

    if (isUSDC) {
        return (
            <div className="w-full bg-white text-blue-900 font-sans text-sm border-2 border-blue-900 p-6 rounded-xl">
                <div className="text-center mb-6 border-b-2 border-blue-900 pb-4">
                    <h1 className="font-bold text-3xl tracking-widest">USDC</h1>
                    <p className="font-bold">DIGITAL CURRENCY NOTE</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <span className="font-bold block text-xs opacity-50">CUSTOMER</span>
                        <span className="text-lg">{transaction.customer_name}</span>
                    </div>
                    <div className="text-right">
                        <span className="font-bold block text-xs opacity-50">INVOICE</span>
                        <span className="text-lg">{transaction.invoice_number}</span>
                    </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center mb-4">
                    <div>
                        <span className="block text-xs font-bold">AMOUNT (USDC)</span>
                        <span className="text-2xl font-bold">{transaction.amount}</span>
                    </div>
                    <div>
                        <span className="block text-xs font-bold text-right">RATE</span>
                        <span className="text-xl">{formatIDR(transaction.rate)}</span>
                    </div>
                </div>

                <div className="text-center pt-4 border-t border-blue-200">
                    TOTAL RP: {formatIDR(transaction.total_idr)}
                </div>
            </div>
        );
    }

    // Default Format (from Transaksi/Index.tsx)
    return (
        <div className="w-full bg-white text-black font-mono text-sm border-2 border-dashed border-gray-400 p-1 shadow-sm">
            <div className="min-w-[800px] border border-black flex">
                <div className="w-1/4 border-r border-black p-4 flex flex-col justify-between">
                    <div>
                        <div className="mb-6">
                            <p className="font-bold mb-1">Payment :</p>
                            <p className="text-lg uppercase">{paymentMethod}</p>
                        </div>
                        <div>
                            <p className="font-bold mb-1">Amount :</p>
                            <p className="text-xl font-bold">{formatIDR(transaction.total_idr)}</p>
                        </div>
                    </div>
                    <div className="mt-8 space-y-8">
                        <div>
                            <div className="h-0.5 w-24 bg-black mb-1"></div>
                            <p className="text-xs">Authorized</p>
                        </div>
                        <div className="flex justify-between">
                            <div>
                                <div className="h-0.5 w-20 bg-black mb-1"></div>
                                <p className="text-xs">Kasir</p>
                            </div>
                            <div className="text-right">
                                <div className="h-0.5 w-20 bg-black mb-1"></div>
                                <p className="text-xs">Nasabah</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-3/4 p-0">
                    <div className="flex border-b border-black p-4 items-center">
                        <div className="text-4xl font-black mr-4 text-blue-800">$</div>
                        <div>
                            <h1 className="font-bold text-xl uppercase">PT. MONEY CHANGER SEJAHTERA</h1>
                            <p className="text-xs">Penukaran Valuta Asing</p>
                            <p className="text-xs">Jl. Jendral Sudirman No. 88, Jakarta Pusat</p>
                            <p className="text-xs">Telp: 021-555-9999</p>
                        </div>
                    </div>
                    <div className="flex border-b border-black text-center font-bold bg-gray-100">
                        <div className="w-1/4 py-2 border-r border-black">Mata Uang</div>
                        <div className="w-1/4 py-2 border-r border-black">Jumlah</div>
                        <div className="w-1/4 py-2 border-r border-black">Kurs</div>
                        <div className="w-1/4 py-2">Jumlah Total</div>
                    </div>
                    <div className="flex text-center h-32">
                        <div className="w-1/4 py-4 border-r border-black font-bold text-lg">
                            {transaction.currency.code}
                        </div>
                        <div className="w-1/4 py-4 border-r border-black">
                            {Number(transaction.amount).toLocaleString('id-ID')}
                        </div>
                        <div className="w-1/4 py-4 border-r border-black">
                            {Number(transaction.rate).toLocaleString('id-ID')}
                        </div>
                        <div className="w-1/4 py-4 font-bold">
                            {formatIDR(transaction.total_idr)}
                        </div>
                    </div>
                    <div className="flex border-t border-black">
                        <div className="w-1/2 p-2 border-r border-black">
                            <p className="text-xs font-bold">JUAL KE / SOLD TO :</p>
                            <p className="mt-1 font-medium uppercase">{transaction.customer_name || '.........................'}</p>
                        </div>
                        <div className="w-1/2 flex">
                            <div className="w-1/2 p-2 border-r border-black">
                                <p className="text-xs font-bold">NO :</p>
                                <p className="mt-1">{transaction.invoice_number}</p>
                            </div>
                            <div className="w-1/2 p-2">
                                <p className="text-xs font-bold">DATE :</p>
                                <p className="mt-1">{new Date(transaction.created_at).toLocaleDateString('id-ID')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
