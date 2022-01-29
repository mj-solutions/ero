import { Collection, Document } from "@ero/types";
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { Db, Filter, MongoClient } from "mongodb";

@Injectable()
export class MongoService implements OnModuleInit, OnModuleDestroy {
  private client = new MongoClient(`${process.env.MONGO_URL}`);
  private logger = new Logger(MongoService.name);
  private db: Db;

  public async onModuleInit() {
    this.logger.log("Connecting to MongoDB...");
    await this.client.connect();
    this.db = this.client.db();
    this.logger.log("Connected to MongoDB!");
  }

  public async find<T>(
    collection: Collection,
    options: Filter<Document<T>> = {}
  ) {
    const res = await this.db
      .collection<Document<T>>(collection)
      .find(options)
      .toArray();
    return res.map((res) => ({
      ...res,
      id: res._id.toString(),
    }));
  }

  public async findOne<T>(collection: Collection, filter: Filter<Document<T>>) {
    const res = await this.db
      .collection<Document<T>>(collection)
      .findOne(filter);
    if (!res) return;
    res.id = res._id.toString();
    return res;
  }

  public insertOne<T>(collection: Collection, doc: T) {
    return this.db.collection(collection).insertOne(doc);
  }

  public insertMany<T>(collection: Collection, ...docs: T[]) {
    return this.db.collection(collection).insertMany(docs);
  }

  public updateMany<T>(collection: Collection, ...docs: Document<T>[]) {
    const bulk = this.db.collection<T>(collection).initializeUnorderedBulkOp();
    for (let i = 0; i < docs.length; i++) {
      const doc = docs[i];
      bulk.find({ _id: doc._id }).replaceOne(doc);
    }
    return bulk.execute();
  }

  public async onModuleDestroy() {
    await this.client.close();
  }
}
