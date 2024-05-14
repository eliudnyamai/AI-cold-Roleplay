import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head,useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TextAreaInput from "@/Components/TextAreaInput";
export default function Create({success,auth,AI_seller}) {
    const { data, setData, post, errors, processing, reset } = useForm({
        name: AI_seller.name,
        seller_desc:AI_seller.seller_desc,
        _method: "PUT",
    });
    const onsubmit = (e) => {
        e.preventDefault();
        post(route("assistants.update",AI_seller));
    }
    
    return (
        <AuthenticatedLayout user={auth.user}>
        <Head title="Edit Seller" />
        <div className="container h-screen mx-auto">
        {success&&
            <div className="bg-green-500 text-center text-white p-2 relative">
                {success}
                </div>} 
            <div className="flex h-screen items-center">
            {/* First div */}
            <div className="w-full p-4">
                <form onSubmit={onsubmit} className="max-w-md mx-auto">
                <div className="mb-4">
                    <InputLabel
                    htmlFor="name"
                    className="block text-sm font-medium text-white"
                    >
                    Name
                    </InputLabel>
                    <TextInput
                    type="text"
                    id="name"
                    name="name"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>
                <div className="mb-4">
                    <InputLabel
                    htmlFor="seller_desc"
                    className="block text-sm font-medium text-gray-700"
                    >
                    Describe the seller
                    </InputLabel>
                    <TextAreaInput
                    id="seller_desc"
                    name="seller_desc"
                    rows="4"
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={data.seller_desc}
                    onChange={(e) =>
                        setData({ ...data, seller_desc: e.target.value })
                    }
                    ></TextAreaInput>
                    <InputError message={errors.seller_desc} className="mt-2" />
                </div>
                <div className="mt-4">
                    <PrimaryButton
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                    {processing ? "editing..." : "Edit"}
                    </PrimaryButton>
                </div>
                </form>
            </div>
            </div>
        </div>
        </AuthenticatedLayout>
    );
}
