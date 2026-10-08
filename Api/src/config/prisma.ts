import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const prismaConnect = async() => {
	try{
		await prisma.$connect();
		console.log("Db conectado")
	}catch{
		console.error("Falha ao conectar")
	}
}

export default prisma;