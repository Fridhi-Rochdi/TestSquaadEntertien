import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createOperation } from "../lib/actions/creatOperation";
import { sharedMemory } from "../lib/adapters/memory/SharedMemory";
import { Operation } from "../lib/models/operation";

describe("createOperation", () => {
    let initialOperations: Operation[];

    beforeEach(() => {
        initialOperations = [...sharedMemory.operations];
        sharedMemory.operations = [
            {
                id: 1,
                commercialName: "Operation Alpha",
                companyId: 1,
                deliveryDate: new Date("2024-07-01"),
                address: "123 Main St",
                availableLots: 10,
                reservedLots: 2,
                totalArea: 1500,
                estimatedCost: 500000,
                picture: "op_1.jpg"
            }
        ];
    });

    afterEach(() => {
        sharedMemory.operations = initialOperations;
    });

    it("devrait créer une opération avec X lots disponibles et 0 lots réservés", async () => {
        const result = await createOperation({
            commercialName: "Nouvelle Opération",
            companyId: 1,
            deliveryDate: new Date("2025-12-31"),
            address: "123 Rue Exemple",
            availableLots: 15,
            totalArea: 2000,
            estimatedCost: 750000
        });

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.operation.availableLots).toBe(15);
            expect(result.operation.reservedLots).toBe(0);
            expect(result.message).toBe("Nouvelle opération enregistrée");
        }
    });

    it("devrait rejeter un nom commercial dépassant 24 caractères", async () => {
        const result = await createOperation({
            commercialName: "Ce nom est beaucoup trop long pour être accepté",
            companyId: 1,
            deliveryDate: new Date("2025-12-31"),
            address: "123 Rue Exemple",
            availableLots: 10,
            totalArea: 1500,
            estimatedCost: 500000
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error).toBe("Le nom d'une opération ne doit pas dépasser 24 caractères");
        }
    });

    it("devrait rejeter une opération rattachée à une société inexistante", async () => {
        const result = await createOperation({
            commercialName: "Opération Test",
            companyId: 9999, // ID inexistant
            deliveryDate: new Date("2025-12-31"),
            address: "123 Rue Exemple",
            availableLots: 10,
            totalArea: 1500,
            estimatedCost: 500000
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error).toBe("La société rattachée n'existe pas");
        }
    });

    it("devrait rejeter une opération avec un nom déjà utilisé dans les +/- 10 ans", async () => {
        const result = await createOperation({
            commercialName: "Operation Alpha",
            companyId: 1,
            deliveryDate: new Date("2025-12-31"),
            address: "456 Rue Nouvelle",
            availableLots: 10,
            totalArea: 1500,
            estimatedCost: 500000
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error).toBe("Une opération portant le même nom existe déjà");
        }
    });

    it("devrait accepter une opération avec un nom identique si hors de la fenêtre de +/- 10 ans", async () => {
        sharedMemory.operations = [
            {
                id: 1,
                commercialName: "Operation Ancienne",
                companyId: 1,
                deliveryDate: new Date("2005-01-01"),
                address: "123 Main St",
                availableLots: 10,
                reservedLots: 2,
                totalArea: 1500,
                estimatedCost: 500000,
                picture: "op_1.jpg"
            }
        ];

        const result = await createOperation({
            commercialName: "Operation Ancienne",
            companyId: 1,
            deliveryDate: new Date("2025-12-31"),
            address: "789 Rue Nouvelle",
            availableLots: 10,
            totalArea: 1500,
            estimatedCost: 500000
        });

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.message).toBe("Nouvelle opération enregistrée");
        }
    });

    it("devrait créer une opération avec toutes les données correctes", async () => {
        const operationData = {
            commercialName: "Résidence du Parc",
            companyId: 1,
            deliveryDate: new Date("2026-06-15"),
            address: "45 Avenue des Champs",
            availableLots: 20,
            totalArea: 3000,
            estimatedCost: 1200000
        };

        const result = await createOperation(operationData);

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.operation.commercialName).toBe(operationData.commercialName);
            expect(result.operation.companyId).toBe(operationData.companyId);
            expect(result.operation.address).toBe(operationData.address);
            expect(result.operation.availableLots).toBe(operationData.availableLots);
            expect(result.operation.totalArea).toBe(operationData.totalArea);
            expect(result.operation.estimatedCost).toBe(operationData.estimatedCost);
            expect(result.operation.id).toBeGreaterThan(0);
        }
    });
});
