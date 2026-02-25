import InvoiceTemplate, { Transaction } from '@/components/InvoiceTemplate';
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

interface Props {
    transaction: Transaction;
    items?: any[]; // ⬅️ kalau template 4 butuh custom layout items
    notaLayouts: any[];
    invoiceTemplate: {
        company_name: string;
        address: string;
        footer_note?: string;
    };
}

export default function Print({
    transaction,
    items = [],
    notaLayouts,
    invoiceTemplate,
}: Props) {
    useEffect(() => {
        const t = setTimeout(() => window.print(), 300);
        return () => clearTimeout(t);
    }, []);

    return (
        <div className="min-h-screen w-full bg-white p-4 print:p-0">
            <Head title={`Print Nota - ${transaction.invoice_number}`} />

            {/* WRAPPER biar layout nota rapi pas print */}
            <div className="mx-auto w-full max-w-[900px] print:w-full print:max-w-none">
                <InvoiceTemplate
                    transaction={transaction}
                    templateId={transaction.template_id ?? 1}
                    // ⬅️ ikut template transaksi
                    items={items} // ⬅️ kalau template 4
                    invoiceTemplate={invoiceTemplate}
                />
            </div>

            <style>{`
                @page {
                    size: auto;
                    margin: 10mm;
                }

                @media print {
                    body {
                        margin: 0;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }

                    .print\\:p-0 {
                        padding: 0 !important;
                    }
                }
            `}</style>
        </div>
    );
}
