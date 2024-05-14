import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TextAreaInput from "@/Components/TextAreaInput";
export default function Create({ success, auth, AI_seller }) {
    const { data, setData, post, errors, processing, reset } = useForm({
        name: "",
        seller_desc: "",
    });
    const onsubmit = (e) => {
        e.preventDefault();
        post(route("assistants.store"));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
        <Head title="View Seller" />
        <div className="container h-screen mx-auto">
            {success && (
            <div className="bg-green-500 text-center text-white p-2 relative">
                {success}
            </div>
            )}
            <div className="flex h-screen items-center">
            <div className="w-full border border-white p-4">
                <div className="text-white text-center mb-4">
                AI Seller Profile: {AI_seller.name}
                </div>
                <div className="text-white text-center mb-4">
                Seller Description: <br /> {AI_seller.seller_desc}{" "}
                </div>
                <div className="flex justify-center space-x-4">
                <Link
                    href={route("assistants.edit", AI_seller)}
                    className="bg-blue-500  hover:bg-blue-700 text-white font-bold p-2 rounded mr-2"
                    >
                    Edit
                </Link>
                </div>
            </div>
            </div>
        </div>
        </AuthenticatedLayout>
    );
}
