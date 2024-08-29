export interface MercadoLibre {
    reputation_level?: string,
    mercado_libre_first_name: string;
    mercado_libre_last_name: string;
    mercado_libre_email: string;
    mercado_libre_identification_number: string;
    mercado_libre_identification_type: string;
    mercado_libre_seller_experience: string;
    mercado_libre_seller_reputation_transactions_total: number | string;
    mercado_libre_seller_reputation_transactions_completed: number | string;
    mercado_libre_seller_reputation_transactions_canceled: number | string;
    mercado_libre_seller_reputation_ratings_positive: number | string;
    mercado_libre_seller_reputation_ratings_negative: number | string;
    mercado_libre_seller_reputation_ratings_neutral: number | string;
    mercado_libre_buyer_reputation_canceled_transactions: number | string;
    mercado_libre_buyer_reputation_transactions_total: number | string;
    mercado_libre_buyer_reputation_transactions_completed: number | string;
    mercado_libre_nickname: string;
}