// File: src/pages/doctor/Register.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { registerDoctor, verifyDoctorSignupOtp } from "../../services/doctorApi";
import { useDoctorStore } from "../../store/useDoctorStore";

export default function DoctorRegister() {
  const navigate = useNavigate();
  const setDoctor = useDoctorStore(s => s.setDoctor);
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otp, setOtp] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    nmcNumber: "",
    specialty: "",
    experience: "",
    hospitalName: "",
    city: ""
  });

  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = "Full name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.nmcNumber.trim()) errors.nmcNumber = "NMC registration number is required";
    if (!formData.specialty.trim()) errors.specialty = "Specialty is required";
    if (!formData.experience.trim()) errors.experience = "Experience is required";
    if (!formData.hospitalName.trim()) errors.hospitalName = "Hospital/Clinic name is required";
    if (!formData.city.trim()) errors.city = "City is required";
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    // Phone validation (basic)
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = "Please enter a valid 10-digit phone number";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError("");
    try {
      await registerDoctor(formData);
      setStep(2);
      setSuccess("Registration submitted! OTP sent to your phone for verification.");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      const response = await verifyDoctorSignupOtp(formData.phone, otp);
      setDoctor(response.doctor);
      setSuccess("Registration successful! Welcome to MediSync!");
      setTimeout(() => navigate("/doctor/location"), 1500);
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const specialties = [
    "General Medicine", "Cardiology", "Neurology", "Orthopedics", 
    "Pediatrics", "Gynecology", "Dermatology", "Psychiatry",
    "Emergency Medicine", "Radiology", "Pathology", "Surgery",
    "Anesthesiology", "Ophthalmology", "ENT", "Other"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-8 text-white text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14l9-5-9-5-9 5 9 5z"/>
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Doctor Registration</h1>
          <p className="text-teal-100">Join MediSync - Secure Healthcare Platform</p>
        </div>

        <div className="p-8">
          {/* Step Indicator */}
          <div className="flex justify-center space-x-2 mb-8">
            {[1, 2].map(s => (
              <div
                key={s}
                className={`w-12 h-12 flex items-center justify-center rounded-full font-semibold transition-all ${
                  step === s
                    ? 'bg-teal-600 text-white shadow-lg'
                    : step > s
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step > s ? '✓' : s}
              </div>
            ))}
          </div>

          {/* Success Message */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg text-center"
              >
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 1: Registration Form */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name *"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors ${
                        formErrors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.name && <p className="text-red-600 text-xs mt-1">{formErrors.name}</p>}
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors ${
                        formErrors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.email && <p className="text-red-600 text-xs mt-1">{formErrors.email}</p>}
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number *"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors ${
                        formErrors.phone ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.phone && <p className="text-red-600 text-xs mt-1">{formErrors.phone}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="nmcNumber"
                      placeholder="NMC Registration No. *"
                      value={formData.nmcNumber}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors ${
                        formErrors.nmcNumber ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.nmcNumber && <p className="text-red-600 text-xs mt-1">{formErrors.nmcNumber}</p>}
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Professional Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <select
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors ${
                        formErrors.specialty ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Specialty *</option>
                      {specialties.map(specialty => (
                        <option key={specialty} value={specialty}>{specialty}</option>
                      ))}
                    </select>
                    {formErrors.specialty && <p className="text-red-600 text-xs mt-1">{formErrors.specialty}</p>}
                  </div>
                  <div>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors ${
                        formErrors.experience ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Years of Experience *</option>
                      <option value="0-1">0-1 years</option>
                      <option value="2-5">2-5 years</option>
                      <option value="6-10">6-10 years</option>
                      <option value="11-15">11-15 years</option>
                      <option value="16-20">16-20 years</option>
                      <option value="20+">20+ years</option>
                    </select>
                    {formErrors.experience && <p className="text-red-600 text-xs mt-1">{formErrors.experience}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="hospitalName"
                      placeholder="Hospital/Clinic Name *"
                      value={formData.hospitalName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors ${
                        formErrors.hospitalName ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.hospitalName && <p className="text-red-600 text-xs mt-1">{formErrors.hospitalName}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="city"
                      placeholder="City *"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors ${
                        formErrors.city ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.city && <p className="text-red-600 text-xs mt-1">{formErrors.city}</p>}
                  </div>
                </div>
              </div>

              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-4 rounded-xl font-semibold hover:from-teal-700 hover:to-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Registering...</span>
                  </div>
                ) : 'Register & Get OTP'}
              </button>
            </motion.div>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6 text-center"
            >
              <div className="space-y-4">
                <div className="w-20 h-20 bg-teal-100 rounded-full mx-auto flex items-center justify-center">
                  <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Verify Your Phone Number</h3>
                <p className="text-gray-600">Enter the 6-digit OTP sent to {formData.phone}</p>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="6-digit OTP (Demo: 123456)"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  maxLength={6}
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors text-center text-xl font-mono"
                />
                <p className="text-xs text-gray-500 mt-2">Demo OTP: 123456</p>
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Verifying...</span>
                  </div>
                ) : 'Complete Registration'}
              </button>
            </motion.div>
          )}

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-2">
            <p className="text-gray-600 text-sm">
              Already registered?{" "}
              <Link to="/doctor/login" className="text-teal-600 hover:text-teal-700 font-semibold">
                Login here
              </Link>
            </p>
            <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm block">
              ← Back to Home
            </Link>
          </div>

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
            <p className="text-xs text-teal-700 text-center">
              <span className="font-semibold">Demo Mode:</span> Fill the form and use OTP "123456" for verification
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}