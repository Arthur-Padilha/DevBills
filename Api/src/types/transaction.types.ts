import type { TransactionType } from "../../generated/prisma";
import type { CategorySummary } from "./category.types";

export interface TransactionFilter {
	userId: string,
	date?: {
		gte: Date
		lte: Date	
	},
	type?: TransactionType
	categoryId: string;
}

export interface TransactionSummary {
	totalExpenses: number;
	totalIncomes: number;
	balance: number;
	expensesByCategory: CategorySummary[];
}
