"use client"

import { useState } from "react"
import { ChevronLeft, Users, Loader2 } from "lucide-react"
import Link from "next/link"
import { Toaster, toast } from "sonner"
import { submitPatientDetails } from "@/lib/actions/patient-details"

export default function PatientDetailsForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    patientId: `PAT-${Date.now()}`,
    patientName: "",
    age: "",
    gender: "",
    phoneNumber: "",
    wardName: "",
    bedNumber: "",
    floor: "",
    admissionStatus: "",
    condition: "",
  })

  const wards = ["Ward A", "Ward B", "Ward C", "ICU", "Emergency"]
  const admissionStatuses = ["Admitted", "Discharged", "Pending"]
  const conditions = ["Stable", "Critical"]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !formData.patientName ||
      !formData.wardName ||
      !formData.bedNumber ||
      !formData.floor ||
      !formData.admissionStatus
    ) {
      toast.error("Validation Error", {
        description: "Please fill all required fields",
      })
      return
    }

    setLoading(true)
    try {
      const result = await submitPatientDetails(formData)

      if (result.success) {
        toast.success("Success!", {
          description: "Patient details saved successfully",
        })

        // Reset form
        setFormData({
          patientId: `PAT-${Date.now()}`,
          patientName: "",
          age: "",
          gender: "",
          phoneNumber: "",
          wardName: "",
          bedNumber: "",
          floor: "",
          admissionStatus: "",
          condition: "",
        })
      } else {
        toast.error("Error", {
          description: result.error || "Failed to save patient details",
        })
      }
    } catch (error) {
      toast.error("Error", {
        description: "Something went wrong",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8 px-4 relative overflow-hidden">
      <Toaster position="top-right" richColors />

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200/20 rounded-full mix-blend-multiply blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-200/20 rounded-full mix-blend-multiply blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors mb-6 font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">Patient Details</h1>
          </div>
          <p className="text-slate-600 ml-11">Register and manage patient information</p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          {loading && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">Saving patient details...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient ID */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Patient ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.patientId}
                disabled
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 placeholder-slate-400 cursor-not-allowed"
              />
            </div>

            {/* Patient Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Patient Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                placeholder="Enter full name"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
              />
            </div>

            {/* Age and Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter age"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
              />
            </div>

            {/* Ward Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Ward Name <span className="text-red-500">*</span>
              </label>
              <select
                name="wardName"
                value={formData.wardName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
              >
                <option value="">Select a ward</option>
                {wards.map((ward) => (
                  <option key={ward} value={ward}>
                    {ward}
                  </option>
                ))}
              </select>
            </div>

            {/* Bed Number and Floor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Bed Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="bedNumber"
                  value={formData.bedNumber}
                  onChange={handleChange}
                  placeholder="Enter bed number"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Floor <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  placeholder="Enter floor number"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
                />
              </div>
            </div>

            {/* Admission Status */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Admission Status <span className="text-red-500">*</span>
              </label>
              <select
                name="admissionStatus"
                value={formData.admissionStatus}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
              >
                <option value="">Select status</option>
                {admissionStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Condition</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
              >
                <option value="">Select condition</option>
                {conditions.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-slate-400 disabled:to-slate-400 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-200 mt-8 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Patient Details"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
