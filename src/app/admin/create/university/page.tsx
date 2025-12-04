"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface AddUniversityFormData {
  name: string;
  address: string;
  estYear: number;
  uniImage: string; // Base64 image (without metadata)
}

const AddUniversityPage: React.FC = () => {
  const [formData, setFormData] = useState<AddUniversityFormData>({
    name: "",
    address: "",
    estYear: new Date().getFullYear(),
    uniImage: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();

  // Convert image to Base64 and strip metadata
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Strip the metadata (e.g. "data:image/jpeg;base64,")
        const base64String = (reader.result as string).split(",")[1];
        setFormData({ ...formData, uniImage: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate the form data
      if (!formData.name || !formData.address || !formData.estYear || !formData.uniImage) {
        setError("All fields are required.");
        setLoading(false);
        return;
      }

      // Make POST request using fetch
      const response = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/universities/add-university", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess("University added successfully.");
        setTimeout(() => router.push("/admin/view/universities"), 2000); // Redirect after success
      } else {
        const errorData = await response.text();
        setError(`Failed to add university: ${errorData}`);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while adding the university.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100p-8 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-extrabold text-green-400 mb-6">
        Add New University
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-lg w-full bg-gray-800 shadow-xl rounded-lg p-6 space-y-6 text-gray-200"
      >
        {/* Error & Success Messages */}
        {error && <p className="text-red-400 font-semibold">{error}</p>}
        {success && <p className="text-green-400 font-semibold">{success}</p>}

        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-lg font-medium text-gray-200">
            University Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md shadow-sm 
                       focus:ring-blue-500 focus:border-blue-500 outline-none"
            required
          />
        </div>

        {/* Address Field */}
        <div>
          <label htmlFor="address" className="block text-lg font-medium text-gray-200">
            Address
          </label>
          <input
            type="text"
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="mt-1 block w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md shadow-sm 
                       focus:ring-blue-500 focus:border-blue-500 outline-none"
            required
          />
        </div>

        {/* Establishment Year Field */}
        <div>
          <label htmlFor="estYear" className="block text-lg font-medium text-gray-200">
            Establishment Year
          </label>
          <input
            type="number"
            id="estYear"
            value={formData.estYear}
            onChange={(e) => setFormData({ ...formData, estYear: Number(e.target.value) })}
            className="mt-1 block w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md shadow-sm 
                       focus:ring-blue-500 focus:border-blue-500 outline-none"
            required
          />
        </div>

        {/* University Image Field */}
        <div>
          <label htmlFor="uniImage" className="block text-lg font-medium text-gray-200">
            University Image
          </label>
          <input
            type="file"
            id="uniImage"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-1 block w-full px-4 py-2 bg-gray-900 border border-gray-700 
                       rounded-md shadow-sm cursor-pointer outline-none"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-2 px-4 bg-blue-700 rounded-md shadow-lg text-white font-bold 
                     hover:bg-blue-600 transition duration-300 focus:outline-none ${
                       loading ? "opacity-50 cursor-not-allowed" : ""
                     }`}
          disabled={loading}
        >
          {loading ? "Adding University..." : "Add University"}
        </button>
      </form>
    </div>
  );
};

export default AddUniversityPage;
