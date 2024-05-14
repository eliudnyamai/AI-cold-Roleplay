import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
export default function Index({ auth, success, AI_sellers }) {
    console.log(auth);
    const [showMessage, setShowMessage] = useState(true);
    const closeMessage = () => {
        setShowMessage(false);
    };
    const deleteSeller= (AI_seller) => {
        if (!window.confirm("Are you sure you want to delete the AI Seller?")) {
        return;
        }
        setShowMessage(true);
        router.delete(route("assistants.destroy", AI_seller.id));
    };
    return (
        <AuthenticatedLayout
        user={auth.user}
        header={
            <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            AI_sellers
            </h2>
        }
        >
        <Head title="AI Sellers" />
        <div className="py-12">
            {success && showMessage && (
            <div className="bg-green-500 text-center text-white p-2 relative">
                {success}
                <button
                className="absolute bg-red-500  hover:bg-red-300 px-3 m-1 font-bold top-0 right-0"
                onClick={closeMessage}
                >
                Close
                </button>
            </div>
            )}
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="text-white text-2xl text-center p-2">
                AI sellers - Press Play to try negotiating
            </div>
            <div className="mb-4">
            <Link
                href={route("assistants.create")}
                className="bg-blue-500 w-1/2 hover:bg-blue-700 text-white font-bold p-2 rounded mr-2"
                >
                Create AI seller
            </Link>
            </div>
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 text-gray-900 dark:text-gray-100">
                
                <div className="overflow-x-auto">
                    
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                        <th className="px-3 py-2">ID</th>
                        <th className="px-3 py-2">Name</th>
                        <th className="px-3 py-2 ">Seller Description</th>
                        <th className="px-3 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        {AI_sellers.map((AI_seller, index) => (
                        <tr
                            className={`dark:bg-${
                            index % 2 === 0 ? "gray-900" : "gray-800"
                            } `}
                            key={AI_seller.id}
                        >
                            <td className="px-6 py-4 whitespace-nowrap">
                            {AI_seller.id}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                            {AI_seller.name}
                            </td>
                            <td className="px-6 py-4 max-w-xs truncate">
                            {AI_seller.seller_desc}
                            </td>
                            <td>
                            <div className="flex">
                            <Link
                                href={route("plays.create", AI_seller)}
                                className="bg-blue-500 w-1/2 hover:bg-blue-700 text-white font-bold p-2 rounded mr-2"
                                >
                                Play
                                </Link>
                                <Link
                                href={route("assistants.show", AI_seller)}
                                className="bg-blue-500 w-1/2 hover:bg-blue-700 text-white font-bold p-2 rounded mr-2"
                                >
                                View
                                </Link>
                                {auth.user&&<button
                                onClick={(e) => deleteSeller(AI_seller)}
                                className="bg-red-500 w-1/2 hover:bg-red-700 text-white font-bold p-2 rounded"
                                >
                                Delete
                                </button>}
                            </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </div>
            </div>
            </div>
        </div>
        </AuthenticatedLayout>
    );
}
