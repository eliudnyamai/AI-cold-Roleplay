import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TextAreaInput from "@/Components/TextAreaInput";

export default function Create({ success, auth }) {
    const { data, setData, post, errors, processing, reset } = useForm({
        name: "",
        seller_desc: "",
        image: null, // Add image field to hold the selected image file
        gender: "", // Add a gender field
    });

    const onsubmit = (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append("name", data.name);
        formData.append("seller_desc", data.seller_desc);
        formData.append("image", data.image);
        formData.append("gender", data.gender); // Append gender to form data
        post(route("assistants.store"), formData);
        reset();
    };

    return (
        <AuthenticatedLayout user={auth.user}>
        <Head title="Create Seller" />
        <div className="container h-screen mx-auto">
            <div className="flex h-screen items-center">
            <div className="w-full p-2">
            {success && (
            <div className="bg-green-500 text-center text-white relative">
                {success}
            </div>
            )}
                <Link
                href={route("assistants.index")}
                className="hover:underline text-white font-bold p-2 rounded mr-2"
                >
                &larr; Back
                </Link>
                <div className="text-white text-2xl text-center">
                Create A New AI seller
                </div>
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
                <div className="mb-4">
                    <InputLabel
                    htmlFor="gender"
                    className="block text-sm font-medium text-white"
                    >
                    Gender
                    </InputLabel>
                    <select
                    id="gender"
                    name="gender"
                    value={data.gender}
                    onChange={(e) => setData({ ...data, gender: e.target.value })}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    </select>
                    <InputError message={errors.gender} className="mt-2" />
                </div>
                <div className="mb-4">
                    <InputLabel
                    htmlFor="image"
                    className="block text-sm font-medium text-white"
                    >
                    Avatar
                    </InputLabel>
                    <input
                    type="file"
                    id="image"
                    name="image"
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    onChange={(e) =>
                        setData({ ...data, image: e.target.files[0] })
                    }
                    accept="image/*"
                    />
                    <InputError message={errors.image} className="mt-2" />
                </div>
                <div className="mt-4">
                    <PrimaryButton
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                    {processing ? "Creating..." : "Create "}
                    </PrimaryButton>
                </div>
                </form>
            </div>
            </div>
        </div>
        </AuthenticatedLayout>
    );
}
