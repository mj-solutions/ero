import { ObjectId } from "mongodb";

export type Document<T> = T & {
  _id: ObjectId;
  id: string;
};

export type Collection = "products" | "retailers";
