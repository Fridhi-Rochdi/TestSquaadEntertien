"use server";

import { Operation } from "../models/operation";
import { operationRepository, companyRepository } from "../config";

type CreateOperationInput = {
    commercialName: string;
    companyId: number;
    deliveryDate: Date;
    address: string;
    availableLots: number;
    totalArea: number;
    estimatedCost: number;
};

type CreateOperationResult = 
    | { success: true; operation: Operation; message: string }
    | { success: false; error: string };

export async function createOperation(input: CreateOperationInput): Promise<CreateOperationResult> {
    try {
        if (input.commercialName.length > 24) {
            return { 
                success: false, 
                error: "Le nom d'une opération ne doit pas dépasser 24 caractères" 
            };
        }

        try {
            await companyRepository.readCompanyById(input.companyId);
        } catch (error) {
            return { 
                success: false, 
                error: "La société rattachée n'existe pas" 
            };
        }

        const existingOperations = await operationRepository.readOperations();
        const creationDate = new Date();
        const tenYearsInMs = 10 * 365.25 * 24 * 60 * 60 * 1000;

        const duplicateOperation = existingOperations.find(op => {
            if (op.commercialName === input.commercialName) {
                const timeDiff = Math.abs(op.deliveryDate.getTime() - creationDate.getTime());
                return timeDiff <= tenYearsInMs;
            }
            return false;
        });

        if (duplicateOperation) {
            return { 
                success: false, 
                error: "Une opération portant le même nom existe déjà" 
            };
        }

        const newOperation = await operationRepository.createOperation({
            commercialName: input.commercialName,
            companyId: input.companyId,
            deliveryDate: input.deliveryDate,
            address: input.address,
            availableLots: input.availableLots,
            reservedLots: 0,
            totalArea: input.totalArea,
            estimatedCost: input.estimatedCost,
            picture: ""
        });

        return {
            success: true,
            operation: newOperation,
            message: "Nouvelle opération enregistrée"
        };

    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Une erreur est survenue"
        };
    }
}
