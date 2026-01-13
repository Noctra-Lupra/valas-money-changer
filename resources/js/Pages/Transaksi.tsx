import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head } from "@inertiajs/react"

export default function Transaksi() {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                            Transaksi
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Transaksi"/>

        </AuthenticatedLayout>
    )
}