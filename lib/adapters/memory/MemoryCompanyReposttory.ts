import { Company } from "@/lib/models/company";
import { ICompanyRepository } from "../../repositories/CompanyRepository";
import { sharedMemory } from "./SharedMemory";

export class MemoryCompanyRepository implements ICompanyRepository {
    async readCompanyById(id: number): Promise<Company> {
        const company = sharedMemory.companies.find(c => c.id === id);
        if (!company) {
            throw new Error("Company not found");
        }
        return company;
    }
 
    async readCompanies(): Promise<Company[]> {
        return sharedMemory.companies;
    }
}