
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
