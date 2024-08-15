import prisma from "./prisma-client";

export const createStock = async (
  name: string,
  purchaseDate: string,
  userId: bigint,
  image?: string,
) => {
  try {
    const newStock = await prisma.stocks.create({
      data: {
        name: name,
        purchaseDate: purchaseDate,
        userId: userId,
        image: image,
      },
    });

    const serializedStock = {
      ...newStock,
      id: newStock.id.toString(),
      userId: newStock.userId.toString(),
    };

    return { data: serializedStock, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
};

export const getStocks = async (userId: bigint) => {
  try {
    const stocks = await prisma.stocks.findMany({
      where: {
        userId: userId,
      },
    });

    const serializedStocks = stocks.map((stock) => ({
      ...stock,
      id: stock.id.toString(),
      userId: stock.userId.toString(),
    }));

    return { data: serializedStocks, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
};

export const getStock = async (userId: bigint, stockId: bigint) => {
  try {
    const stock = await prisma.stocks.findFirst({
      where: {
        userId: userId,
        id: stockId,
      },
    });
    return { data: stock, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
};

export const updateStock = async (
  id: bigint,
  userId: bigint,
  name: string,
  purchaseDate: string,
  image?: string,
) => {
  try {
    const updatedStock = await prisma.stocks.update({
      where: {
        id: id,
        userId: userId,
      },
      data: {
        name: name,
        purchaseDate: purchaseDate,
        image: image,
      },
    });

    const serializedStock = {
      ...updatedStock,
      id: updatedStock.id.toString(),
      userId: updatedStock.userId.toString(),
    };

    return { data: serializedStock, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
};

export const deleteStock = async (id: bigint) => {
  try {
    const deletedStock = await prisma.stocks.delete({
      where: {
        id: id,
      },
    });

    const serializedStock = {
      ...deletedStock,
      id: deletedStock.id.toString(),
      userId: deletedStock.userId.toString(),
    };

    return { data: serializedStock, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
};
