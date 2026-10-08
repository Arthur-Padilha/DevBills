import type { FastifyInstance } from "fastify";
import { zodToJsonSchema } from "zod-to-json-schema";
import createTransaction from "../controllers/transactions/createTransaction.controller";
import { getTransactions } from "../controllers/transactions/getTransactions.controller";
import { getTransactionsSummary } from "../controllers/transactions/getTransactionsSummary.controller";
import {
getTransactionSchema,
getTransactionsSummarySchema,
createTransactionSchema,
deleteTransactionSchema,
} from "../schemas/transaction.schema";
import { deleteTransaction } from "../controllers/transactions/deleteTransaction.controller";

const transactionRoutes = async (fastify: FastifyInstance) => {
	fastify.route({
		method: "POST",
		url: "/",
		schema: {
			body: zodToJsonSchema(createTransactionSchema as any),
		},
		handler: createTransaction
	});

	fastify.route({
	method: "GET",
	url: "/",
	schema: {
		querystring: zodToJsonSchema(getTransactionSchema as any),
	},
	handler: getTransactions,
});

fastify.route({
	method: "GET",
	url: "/summary",
	schema: {
		querystring: zodToJsonSchema(getTransactionsSummarySchema as any),
	},
	handler: getTransactionsSummary
})

fastify.route({
	method: "DELETE",
	url: "/:id",
	schema: {
		params: zodToJsonSchema(deleteTransactionSchema as any),
	},
	handler: deleteTransaction
})
};



export default transactionRoutes;