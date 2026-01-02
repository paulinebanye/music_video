export interface DataReadOptions {
  readonly collectionName: string;
  readonly filter?: Record<string, unknown>;
  readonly objectId?: string;
}

export interface DataWriteOptions {
  readonly collectionName: string;
  readonly payload: Record<string, unknown>;
  readonly objectId?: string;
  readonly bulkWrite?: boolean;
}

export abstract class DataStorage {
  abstract read<T = unknown>(options: DataReadOptions): Promise<T>;
  abstract write<T = unknown>(options: DataWriteOptions): Promise<T>;
  abstract delete<T = unknown>(options: DataWriteOptions): Promise<T>;
}
