import { z } from "zod";

export const InvoiceItemSchema = z.object({
  invoiceItemId: z.number().optional(),

  firmId: z.number(),
  invoiceId: z.number(),

  particulars: z.string().min(1),

  quantity: z.number(),
  price: z.number(),
  totalPrice: z.number(),

  isActive: z.boolean().optional(),
});

export const InvoiceItemListSchema = z.array(InvoiceItemSchema);