import Image from "next/image";
import { Building, House, Plus } from "lucide-react";
import { listOperations } from "@/lib/actions/listOperations";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const operations = await listOperations();
  const params = await searchParams;
  
  return (
    <>
    <div className="h-[60vh] min-h-[600px] flex items-bottom justify-center relative">
      <Image src="/retrato-inmobiliario-eLG6MsOeupk-unsplash.jpg" alt="Hero" fill className="object-cover absolute inset-0 z-0" />
      <div className="inset-0 bg-black/20 z-10 w-full pb-4">
        <div className="container mx-auto h-full flex flex-col place-content-between">
          <div className="grid grid-cols-3 items-center h-20">
            <div className="flex items-center gap-2 text-white text-2xl">
              <div className="bg-white p-2 rounded-sm w-8 h-8">
                <Building className="text-black" size={16} />
              </div>
              RealEstate
            </div>
            <div className="flex justify-center">
              <div className="rounded-full bg-white/30 backdrop-blur-md p-1 flex gap-4">
                {
                  ["Home", "About", "Properties", "Contact"].map((item) => (
                    <div key={item} className={`px-4 py-2 rounded-full ${item === "Home" ? "bg-white text-black font-bold" : "text-white font-medium"}`}>{item}</div>
                  ))
                }</div>
            </div>
          </div>
          <div>
            <div className="flex gap-2">
              {
                ["House", "Residential", "Commercial"].map((item) => (
                  <div key={item} className="text-black bg-white px-4 py-2 rounded-full">{item}</div>
                ))
              }

            </div>
            <div className="text-white text-9xl font-thin">Build Your Future, One Property at a Time</div>
          </div>

        </div>
      </div>
    </div>
    <div className="container mx-auto pt-10 px-4">
      {params.message && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {params.message}
        </div>
      )}
      {params.error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {params.error}
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Explore Our Properties</h1>
        <a href="/new" className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full"><Plus /> Add Property</a>
      </div>
      <div className="grid grid-cols-3 gap-10 mt-10">
        {
          operations.map((operation) => (
            <div key={operation.id} className="w-full flex flex-col gap-4">
              <div className="w-full h-[300px">
                <img src={`/${operation.picture}`} alt={operation.commercialName} className="rounded-xl w-full h-96  object-cover" />
              </div>
              <div className="">
                <div className="flex items-center text-sm text-gray-400 gap-2"><House size={16} /> {operation.availableLots} / {operation.reservedLots + operation.availableLots} lots available</div>
                <div className="text-2xl font-bold">{operation.commercialName}</div>
                <div className="text-sm text-gray-500">{operation.address}</div>
                <div className="text-sm text-gray-500">Delivery Date: {operation.deliveryDate.toLocaleDateString()}</div>
                <div className="text-sm text-gray-500">Estimated Cost: ${operation.estimatedCost.toLocaleString()}</div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
    </>
  );
}
