import { Operation } from "../../models/operation";
import { IOperationRepository } from "../../repositories/OperationRepository";
import { sharedMemory } from "./SharedMemory";

export class MemoryOperationRepository implements IOperationRepository {

    async readOperations(): Promise<Operation[]> {
        return sharedMemory.operations;
    }

    async deleteOperation(id: number): Promise<void> {
        const operation = sharedMemory.operations.find((operation) => operation.id === id);
        if (!operation) {
            throw new Error("Operation not found");
        }
        sharedMemory.operations = sharedMemory.operations.filter((operation) => operation.id !== id);
    }
    async createOperation(operation: Omit<Operation, 'id'>): Promise<Operation> {
        const newId= Math.max(...sharedMemory.operations.map(op=>op.id),0)+1;
        const newoperation ={id:newId, ...operation};
        sharedMemory.operations.push(newoperation);
        return newoperation;
    }

}