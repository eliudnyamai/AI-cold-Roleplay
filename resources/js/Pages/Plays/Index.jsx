import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
export default function Index({ auth, success, plays }) {
    console.table(plays);
    const [showMessage, setShowMessage] = useState(true);
    const closeMessage = () => {
        setShowMessage(false);
    };
    const deletePlay= (play) => {
        if (!window.confirm("Are you sure you want to delete the AI Seller?")) {
        return;
        }
        setShowMessage(true);
        router.delete(route("plays.destroy", play));
    };
    return (
        <AuthenticatedLayout
        user={auth.user}
        header={
            <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            My Plays
            </h2>
        }
        >
        <Head title="My Plays" />
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
            <div className="text-white mb-4 text-2xl text-center">
                        Your Attempted Cold Role Plays
                </div>
                <Link
                href="/clearPlays"
                className=" bg-blue-700 hover:bg-blue-400 text-white font-bold p-2 rounded mb-8"
                >
                Clear
                </Link>
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 text-gray-900 dark:text-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                        <th className="px-3 py-2">ID</th>
                        <th className="px-3 py-2">Seller Profile</th>
                        <th className="px-3 py-2">Seller Description</th>
                        <th className="px-3 py-2 ">Status</th>
                        <th className="px-3 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        {plays.map((play, index) => (
                        <tr
                            className={`dark:bg-${
                            index % 2 === 0 ? "gray-900" : "gray-800"
                            } `}
                            key={play.id}
                        >
                            <td className="px-6 py-4 whitespace-nowrap">
                            {play.id}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                            {play.assistant.name}
                            </td>
                            <td className="px-6 py-4 max-w-xs truncate">
                            {play.assistant.seller_desc}
                            </td>
                            <td className="px-6 py-4 max-w-xs truncate">
                            {play.status}
                            </td>
                            <td>
                            <div className="flex">
                                <button
                                onClick={(e) => deletePlay(play)}
                                className="bg-red-500 w-1/2 hover:bg-red-700 text-white font-bold p-2 rounded"
                                >
                                Delete
                                </button>
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
