import InvoiceTemplate, { Transaction } from '@/Components/InvoiceTemplate';
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

interface Props {
    transaction: Transaction;
}

export default function Print({ transaction }: Props) {
    useEffect(() => {
        window.print();
    }, []);

    return (
        <div className="w-full h-screen bg-white p-4">
            <Head title={`Print Nota - ${transaction.invoice_number}`} />
            <InvoiceTemplate transaction={transaction} />
            <style>{`
                @page {
                    size: auto;
                    margin: 0mm;
                }
                body {
                    margin: 20px;
                }
                @media print {
                    .no-print {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
}
