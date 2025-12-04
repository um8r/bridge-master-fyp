"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface University {
  id: string;
  name: string;
  address: string;
  estYear: number;
}

interface Interest {
  id: string;
  interest: string;
}

const FacultyRegistration: React.FC = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [universityId, setUniversityId] = useState<string>('');
  const [universities, setUniversities] = useState<University[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [availableInterests, setAvailableInterests] = useState<Interest[]>([]);
  const [post, setPost] = useState<string>('');
  const [registeredEmails, setRegisteredEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  const [department, setDepartment] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [universitiesRes, interestsRes, emailsRes] = await Promise.all([
          fetch('https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/universities/get-all-universities'),
          fetch('https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/Interests/get-interests'),
          fetch('https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/register-user/get-all-emails'),
        ]);

        if (universitiesRes.ok) {
          setUniversities(await universitiesRes.json());
        } else {
          throw new Error('Failed to load universities.');
        }

        if (interestsRes.ok) {
          setAvailableInterests(await interestsRes.json());
        } else {
          throw new Error('Failed to load interests.');
        }

        if (emailsRes.ok) {
          setRegisteredEmails(await emailsRes.json());
        } else {
          throw new Error('Failed to load registered emails.');
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
      universityId &&
      post &&
      interests.length > 0 &&
      department &&
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
    universityId,
    post,
    interests,
    
    department,
    emailError,
    passwordError,
  ]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enteredEmail = e.target.value;
    setEmail(enteredEmail);
  
    // Regex for validating faculty email
    // const facultyEmailRegex = /^[a-zA-Z]+\.[a-zA-Z]+@students\.au\.edu\.pk$/;
  
    // if (!facultyEmailRegex.test(enteredEmail)) {
    //   setEmailError("Please use a valid faculty email (e.g., warda.aslam@students.au.edu.pk).");
    //   setIsSubmitDisabled(true);
    // } else if (registeredEmails.includes(enteredEmail)) {
    //   setEmailError("This email is already registered.");
    //   setIsSubmitDisabled(true);
    // } else {
    //   setEmailError(null);
    // }
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
      setPasswordError('Passwords do not match.');
    } else {
      setPasswordError(null);
    }
  };

  const validatePassword = (pass: string) => {
    if (pass.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
    } else if (!/[!@#$%^&*(),.?":{}|<>]/g.test(pass)) {
      setPasswordError('Password must contain at least one special character.');
    } else {
      setPasswordError(null);
    }
  };

  const addInterest = (interest: string) => {
    if (interest && !interests.includes(interest)) {
      setInterests([...interests, interest]);
      console.log('Updated Interests:', interests);
    }
  };
  

  const removeInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest)); // Remove the interest
  };
  


 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (emailError) {
      toast.error('Please provide a unique email address.', {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (passwordError) {
      toast.error('Please correct the password issues.', {
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
      universityId,
      department,
      interests,
      role: "Faculty",
      post,
    };

    try {
      sessionStorage.setItem("facultyRegistrationData", JSON.stringify(registrationData));

      const generateOtpResponse = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/otp/generate-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(email),
      });

      if (generateOtpResponse.ok) {
        const sendOtpResponse = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/otp/send-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(email),
        });

        if (sendOtpResponse.ok) {
          toast.success("OTP sent to your email. Please check your inbox.", {
            position: "top-center",
            autoClose: 3000,
          });

          router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}&role=faculty`);
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
      console.error('Error during OTP process:', error);
      toast.error('An error occurred during the OTP process.', {
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
        Faculty Registration
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
  
        {/* University */}
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
  
        {/* Department */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">Department</label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="mt-1 block w-full p-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="off"
          />
        </div>
  
        {/* Interests */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">Interests</label>
          <select
            value=""
            onChange={(e) => addInterest(e.target.value)}
            className="mt-1 block w-full p-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select an interest
            </option>
            {availableInterests.map((interest) => (
              <option key={interest.id} value={interest.interest}>
                {interest.interest}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap gap-2 mt-2">
            {interests.map((interest) => (
              <span
                key={interest}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500 text-white"
              >
                {interest}
                <button
                  type="button"
                  onClick={() => removeInterest(interest)}
                  className="ml-2 focus:outline-none"
                >
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
  
        {/* Post */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">Post</label>
          <input
            type="text"
            value={post}
            onChange={(e) => setPost(e.target.value)}
            className="mt-1 block w-full p-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="off"
          />
        </div>
  
        {/* Submit */}
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

export default FacultyRegistration;

