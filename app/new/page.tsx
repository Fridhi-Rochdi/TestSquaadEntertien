import { ArrowLeft } from "lucide-react";
import { createOperation } from "@/lib/actions/creatOperation";
import { redirect } from "next/navigation";

export default function NewOperationPage() {
    async function handleSubmit(formData: FormData) {
        "use server";
        
        const commercialName = formData.get("commercialName") as string;
        const companyId = parseInt(formData.get("companyId") as string);
        const deliveryDate = new Date(formData.get("deliveryDate") as string);
        const address = formData.get("address") as string;
        const availableLots = parseInt(formData.get("availableLots") as string);
        const totalArea = parseFloat(formData.get("totalArea") as string);
        const estimatedCost = parseFloat(formData.get("estimatedCost") as string);

        const result = await createOperation({
            commercialName,
            companyId,
            deliveryDate,
            address,
            availableLots,
            totalArea,
            estimatedCost
        });

        if (result.success) {
            redirect("/?message=" + encodeURIComponent(result.message));
        } else {
            redirect("/?error=" + encodeURIComponent(result.error));
        }
    }

    return (
        <div className="container mx-auto pt-10 px-4">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-bold">Nouvelle Opération</h1>
                <a href="/" className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800">
                    <ArrowLeft /> Retour
                </a>
            </div>
            
            <div className="max-w-2xl">
                <form action={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="commercialName" className="block text-sm font-medium mb-2">
                            Nom commercial *
                        </label>
                        <input
                            type="text"
                            id="commercialName"
                            name="commercialName"
                            placeholder="Entrer le nom commercial (max 24 caractères)"
                            required
                            maxLength={24}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label htmlFor="companyId" className="block text-sm font-medium mb-2">
                            Société *
                        </label>
                        <select
                            id="companyId"
                            name="companyId"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Sélectionner une société</option>
                            <option value="1">Acme Corp</option>
                            <option value="2">Globex Inc.</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="deliveryDate" className="block text-sm font-medium mb-2">
                            Date de livraison *
                        </label>
                        <input
                            type="date"
                            id="deliveryDate"
                            name="deliveryDate"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label htmlFor="address" className="block text-sm font-medium mb-2">
                            Adresse *
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            placeholder="Adresse complète de l'opération"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label htmlFor="availableLots" className="block text-sm font-medium mb-2">
                            Nombre de lots disponibles *
                        </label>
                        <input
                            type="number"
                            id="availableLots"
                            name="availableLots"
                            placeholder="Nombre de lots"
                            required
                            min="1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label htmlFor="totalArea" className="block text-sm font-medium mb-2">
                            Surface totale habitable (m²) *
                        </label>
                        <input
                            type="number"
                            id="totalArea"
                            name="totalArea"
                            placeholder="Surface en m²"
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label htmlFor="estimatedCost" className="block text-sm font-medium mb-2">
                            Coût de l'opération estimée (€) *
                        </label>
                        <input
                            type="number"
                            id="estimatedCost"
                            name="estimatedCost"
                            placeholder="Coût estimé"
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Créer l'opération
                    </button>
                </form>
            </div>
        </div>
    );
}