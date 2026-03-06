export interface InvoiceItem {
  invoiceItemId: number;
  firmId: number;
  invoiceId: number;
  particulars: string;
  quantity: number;
  price: number;
  totalPrice: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
  isDeleted: boolean;
}

export interface CreateInvoiceItemDto {
  firmId: number;
  invoiceId: number;
  particulars: string;
  quantity: number;
  price: number;
  totalPrice: number;
  isActive?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}