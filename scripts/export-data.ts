async function exportData() {
  // const client = new PrismaClient();
  // await client.$connect();
  // const products = await client.product.findMany({
  //   include: { company: true },
  // });
  // const prefixPath = "exports";
  // const outPath = `${prefixPath}/products.json`;
  // try {
  //   await fs.rm(prefixPath, { recursive: true });
  // } catch {
  //   // Do nothing
  // }
  // await fs.mkdir(prefixPath);
  // await fs.writeFile(outPath, JSON.stringify(products));
  // await client.$disconnect();
}

exportData();
