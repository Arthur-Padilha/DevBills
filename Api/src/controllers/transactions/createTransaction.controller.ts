import type { FastifyReply, FastifyRequest } from "fastify";
import { createTransactionSchema } from "../../schemas/transaction.schema";
import prisma from "../../config/prisma";

const createTransaction = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
	const userId = "###F#F#DFSDGE"

	if(!userId){
		return reply.status(401).send({ error: "Usuário não autenticado"});
	}


	const result = createTransactionSchema.safeParse(request.body);

	if(!result.success){
		const errorMessageJSON = result.error.message || "Validação inválida"

		const errorMessage = JSON.parse(errorMessageJSON);
		console.log(errorMessage[0].message);

		reply.status(400).send({ error: errorMessage[0].message })
		return
	}
	
	const transaction = result.data;

	try {

	const category = await prisma.category.findFirst({
		where: {
			id: transaction.categoryId,
			type: transaction.type,
		}
	})

	if(!category) {
		reply.status(400).send({ error: "Categoria inválida" });
		return;
	}

	const parsedDate = new Date(transaction.date);

	const newTransaction = await prisma.transaction.create({
		data: {
			...transaction,
			userId,
			date: parsedDate,
		},
		include: {
			category: true,
		},
	});

	reply.status(201).send(newTransaction);
	} catch(err){
		request.log.error({ err }, "Erro ao criar transação")
		reply.status(500).send({ error: "Erro interno do servidor" });
	}
};

export default createTransaction;