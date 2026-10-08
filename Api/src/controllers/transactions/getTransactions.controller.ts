import type { FastifyReply, FastifyRequest } from "fastify";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import type { GetTransactionsQuery } from "../../schemas/transaction.schema";
import type { TransactionFilter } from "../../types/transaction.types";

import prisma from "../../config/prisma";

dayjs.extend(utc);

export const getTransactions = async (
  request: FastifyRequest<{
    Querystring: GetTransactionsQuery;
  }>,
  reply: FastifyReply
): Promise<void> => {
  const userId = "###F#F#DFSDGE";

  if (!userId) {
    reply.status(401).send({
      error: "Usuário não autenticado",
    });

    return;
  }

  const { month, categoryId, year, type } = request.query;

  const filters = {
    userId,
  } as TransactionFilter;

  if (month && year) {
    const startDate = dayjs
      .utc(`${year}-${month}-01`)
      .startOf("month")
      .toDate();

    const endDate = dayjs
      .utc(startDate)
      .endOf("month")
      .toDate();

    filters.date = {
      gte: startDate,
      lte: endDate,
    };
  }

  if (type) {
    filters.type = type;
  }

  if (categoryId) {
    filters.categoryId = categoryId;
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where: filters,
      orderBy: {
        date: "desc",
      },
      include: {
        category: {
          select: {
            color: true,
            name: true,
            type: true,
          },
        },
      },
    });

    reply.send(transactions);
  } catch (err) {
    request.log.error({ err }, "Erro ao trazer transações");

    reply.status(500).send({
      error: "Erro do servidor",
    });
  }
};