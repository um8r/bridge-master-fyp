"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface University {
  id: string;
  name: string;
  address: string;
  estYear: number;
}

const UniversityAdminRegistration: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [officeAddress, setOfficeAddress] = useState<string>("");
  const [universityId, setUniversityId] = useState<string>("");
  const [universities, setUniversities] = useState<University[]>([]);
  const [registeredEmails, setRegisteredEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [universitiesRes, emailsRes] = await Promise.all([
          fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/universities/get-all-universities"),
          fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/register-user/get-all-emails"),
        ]);

        if (universitiesRes.ok) {
          setUniversities(await universitiesRes.json());
        } else {
          throw new Error("Failed to load universities.");
        }

        if (emailsRes.ok) {
          setRegisteredEmails(await emailsRes.json());
        } else {
          throw new Error("Failed to load registered emails.");
        }
      } catch (error: any) {
        console.error(error);
        toast.error(error.message, {
          position: "top-center",
          autoClose: 3000,
        });
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (
      firstName &&
      lastName &&
      email &&
      password.length >= 8 &&
      /[!@#$%^&*(),.?":{}|<>]/g.test(password) &&
      password === confirmPassword &&
      contact &&
      officeAddress &&
      universityId &&
      !emailError &&
      !passwordError
    ) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    contact,
    officeAddress,
    universityId,
    emailError,
    passwordError,
  ]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enteredEmail = e.target.value;
    setEmail(enteredEmail);

    if (registeredEmails.includes(enteredEmail)) {
      setEmailError("This email is already registered.");
    } else {
      setEmailError(null);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmedPassword = e.target.value;
    setConfirmPassword(confirmedPassword);
    if (confirmedPassword !== password) {
      setPasswordError("Passwords do not match.");
    } else {
      setPasswordError(null);
    }
  };

  const validatePassword = (pass: string) => {
    if (pass.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
    } else if (!/[!@#$%^&*(),.?":{}|<>]/g.test(pass)) {
      setPasswordError("Password must contain at least one special character.");
    } else {
      setPasswordError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (emailError) {
      toast.error("Please provide a unique email address.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (passwordError) {
      toast.error("Please correct the password issues.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);

    const registrationData = {
      firstName,
      lastName,
      email,
      password,
      role: "UniversityAdmin",
      contact,
      officeAddress,
      universityId,
    };

    try {
      sessionStorage.setItem(
        "universityAdminRegistrationData",
        JSON.stringify(registrationData)
      );

      const generateOtpResponse = await fetch(
        "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/otp/generate-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(email),
        }
      );

      if (generateOtpResponse.ok) {
        const sendOtpResponse = await fetch(
          "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/otp/send-otp",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(email),
          }
        );

        if (sendOtpResponse.ok) {
          toast.success("OTP sent to your email. Please check your inbox.", {
            position: "top-center",
            autoClose: 3000,
          });

          router.push(
            `/auth/verify-otp?email=${encodeURIComponent(
              email
            )}&role=universityAdmin`
          );
        } else {
          const errorText = await sendOtpResponse.text();
          toast.error(`Failed to send OTP email: ${errorText}`, {
            position: "top-center",
            autoClose: 3000,
          });
        }
      } else {
        const errorText = await generateOtpResponse.text();
        toast.error(`Failed to generate OTP: ${errorText}`, {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during the OTP process.", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-semibold mb-6 text-blue-600">
        University Admin Registration
      </h2>
      <form
        autoComplete="off"
        method="post"
        action=""
        onSubmit={handleSubmit}
        className="space-y-6 w-full"
      >
        <input autoComplete="false" name="hidden" type="text" style={{ display: "none" }} />
  
        {/* First Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 block w-full p-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="off"
          />
        </div>
  
        {/* Last Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1 block w-full p-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="off"
          />
        </div>
  
        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            className="mt-1 block w-full p-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="off"
          />
          {emailError && <p className="text-red-500 mt-2">{emailError}</p>}
        </div>
  
        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            className="mt-1 block w-full p-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="off"
            placeholder="At least 8 characters and a special character"
          />
          {passwordError && <p className="text-red-500 mt-2">{passwordError}</p>}
        </div>
  
        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className="mt-1 block w-full p-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="off"
            placeholder="Confirm your password"
          />
          {passwordError && <p className="text-red-500 mt-2">{passwordError}</p>}
        </div>
  
        {/* Contact Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">Contact Number</label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="mt-1 block w-full p-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="off"
          />
        </div>
  
        {/* Office Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">Office Address</label>
          <input
            type="text"
            value={officeAddress}
            onChange={(e) => setOfficeAddress(e.target.value)}
            className="mt-1 block w-full p-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="off"
          />
        </div>
  
        {/* University Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">University</label>
          <select
            value={universityId}
            onChange={(e) => setUniversityId(e.target.value)}
            className="mt-1 block w-full p-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>
              Select your university
            </option>
            {universities.map((university) => (
              <option key={university.id} value={university.id}>
                {university.name} ({university.estYear})
              </option>
            ))}
          </select>
        </div>
  
        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className={`w-full py-3 px-6 rounded-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white text-white transition-colors duration-300 ${
              loading || isSubmitDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading || isSubmitDisabled}
          >
            {loading ? "Sending OTP..." : "Register"}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
  
};

export default UniversityAdminRegistration;

