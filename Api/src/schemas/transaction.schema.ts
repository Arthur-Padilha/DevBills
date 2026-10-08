import { z } from "zod";
import { ObjectId } from "mongodb";
import { deleteTransaction } from "../controllers/transactions/deleteTransaction.controller";
import { TransactionType } from "../../generated/prisma";

const isValidObjectId = (id: string): boolean => ObjectId.isValid(id);

export const createTransactionSchema = z.object({
  description: z.string().min(1, "Descrição obrigatória"),

  amount: z.number().positive("Valor deve ser positivo"),

  date: z.coerce.date({
    error: "Data inválida",
  }),

  categoryId: z.string().refine(isValidObjectId, {
    message: "Categoria inválida",
  }),

  type: z.enum(
    [TransactionType.expense, TransactionType.income],
    {
      error: "Tipo inválido",
    }
  ),
});

export const getTransactionSchema = z.object({
  month: z.string().optional(),

  year: z.string().optional(),

  type: z
    .enum(
      [TransactionType.expense, TransactionType.income],
      {
        error: "Tipo inválido",
      }
    )
    .optional(),

  categoryId: z
    .string()
    .refine(isValidObjectId, {
      message: "Categoria inválida",
    })
    .optional(),
});

export const getTransactionsSummarySchema = z.object({
  month: z.string({
    message: "O mês é obrigatório",
  }),

  year: z.string({
    message: "O ano é obrigatório",
  }),
});

export const deleteTransactionSchema = z.object({
	id: z.string().refine(isValidObjectId, {
		message: "Id inválido",
})});

export type DeleteTransactionParams = z.infer<
  typeof deleteTransactionSchema
>;

export type GetTransactionsQuery = z.infer<
  typeof getTransactionSchema
>;

export type GetTransactionsSummaryQuery = z.infer<
  typeof getTransactionsSummarySchema
>;
