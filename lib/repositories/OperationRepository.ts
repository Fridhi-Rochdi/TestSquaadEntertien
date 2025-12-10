import { Operation } from "../models/operation";

export interface IOperationRepository {
    readOperations(): Promise<Operation[]>;
    deleteOperation(id: number): Promise<void>;
    createOperation(operation :Omit<Operation,'id'>) : Promise<Operation>;
}