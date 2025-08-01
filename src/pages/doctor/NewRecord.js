// File: src/pages/doctor/NewRecord.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveRecord } from "../../services/doctorApi";
import { useDoctorStore } from "../../store/useDoctorStore";
import SidebarNav from "../../components/doctor/SidebarNav";
import FancyButton from "../../components/FancyButton";
import { uploadRecord } from "../../services/mockApi";

export default function NewRecord() {
  const navigate = useNavigate();
  const { doctor, patient, location } = useDoctorStore();
  const [symptoms, setSymptoms] = useState("");
  const [medicines, setMedicines] = useState("");
  const [timer, setTimer] = useState(15 * 60);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!doctor) return navigate("/doctor/login");
    if (!patient) return navigate("/doctor/access");
  }, [doctor, patient, navigate]);

  useEffect(() => {
    if (timer <= 0) {
      alert("Session expired. Returning to dashboard.");
      return navigate("/doctor/dashboard");
    }
    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setFeedback("");
    try {
      await uploadRecord(patient.id, {
        doctorName: doctor.name,
        symptoms,
        medicines,
        location,
        // Optionally add diagnosis/notes if available
      });
      setFeedback("Record saved successfully!");
      setTimeout(() => {
        navigate("/doctor/dashboard");
      }, 1000);
    } catch (err) {
      setFeedback("Failed to save record. Please try again.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNav />
      <main className="flex-1 p-8 overflow-auto">
        <div className="bg-white rounded-2xl shadow p-8 max-w-2xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">New Consultation</h2>
            <span className="text-gray-500">{`${Math.floor(timer/60)}:${String(timer%60).padStart(2,"0")}`}</span>
          </div>
          {/* Show feedback message above form */}
          {feedback && <div className={`mb-4 text-center font-semibold ${feedback.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{feedback}</div>}
          <textarea
            rows={4}
            placeholder="Describe symptoms..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-lg p-4 focus:border-teal-500 transition"
          />
          <input
            placeholder="Medicines prescribed..."
            value={medicines}
            onChange={(e) => setMedicines(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-teal-500 transition"
          />
          <FancyButton onClick={onSubmit}>Save & Finish</FancyButton>
        </div>
      </main>
    </div>
  );
}
