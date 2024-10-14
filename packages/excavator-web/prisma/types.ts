declare global {
  namespace PrismaJson {
    type SpadingDataObject = {
      [key: string]: string | number | boolean;
    };
  }
}
