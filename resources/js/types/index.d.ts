export type UserRole = 'admin' | 'staff';

export interface User {
    id: number;
    name: string;
    username: string;
    role: UserRole;
    email_verified_at?: string;
}


export interface FinancialAccount {
    id: number;
    account_name: string;
    account_number: string | null;
    balance: number;
    type: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};

export interface Currency {
    id: number;
    code: string;
    name: string;
    variant: string;
    stock_amount: number;
    average_rate: number;
    created_at: string;
    updated_at: string;
}


export interface TransactionHistory {
    id: number;
    formatted_time: string;
    invoice_number: string;
    transaction_type: string;
    customer: string;
    currency_code: string;
    rate: string | number;
    payment_method: string;
    total_idr: number;
    user_name: string;
    user_name: string;
    amount_valas: number;
    is_operational?: boolean;
}

export interface ReportData {
    saldo_awal: {
        cash: number;
        bca: number;
        mandiri: number;
        [key: string]: number;
    };
    mutations: {
        salesCash: number;
        buyCash: number;
        salesBca: number;
        buyBca: number;
        salesMandiri: number;
        buyMandiri: number;
        [key: string]: number;
    };
    totals: {
        buy: number;
        sales: number;
        asset_valas: number;
    };
    transactions: TransactionHistory[];
    ops: {
        cash_in: number;
        cash_out: number;
        bca_in: number;
        bca_out: number;
        mandiri_in: number;
        mandiri_out: number;
        bca2_net: number;
        mandiri2_net: number;
        transfer_from_bank_to_cash: number;
        transfer_to_bank: number;
        ghost_adjustment: number;
    };
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedData<T> {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}
