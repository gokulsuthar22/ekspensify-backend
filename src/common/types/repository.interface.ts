export interface Repository<T, Create, Update, Where> {
  create(data: Create): Promise<T>;
  findById(id: number): Promise<T | null>;
  findByIdAndUpdate(id: number, data: Update): Promise<T | null>;
  findByIdAndDelete(id: number): Promise<T | null>;
  findOne(where: any): Promise<T | null>;
  findOneAndUpdate(where: Where, data: any): Promise<T | null>;
  findOneAndDelete(where: Where): Promise<T | null>;
}
