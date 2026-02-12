"use client"

import { useState } from "react"
import { ChevronLeft, Stethoscope, Loader2 } from "lucide-react"
import Link from "next/link"
import { Toaster, toast } from "sonner"
import { submitDoctorAvailability } from "@/lib/actions/doctor-availability"

export default function DoctorAvailabilityForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    doctorId: `DOC-${Date.now()}`,
    doctorName: "",
    department: "",
    specialization: "",
    availableDays: [],
    startTime: "",
    endTime: "",
    roomOrOpNo: "",
    status: true,
  })

  const departments = ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "General"]
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleDayToggle = (day) => {
    setFormData((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !formData.doctorName ||
      !formData.department ||
      !formData.specialization ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.roomOrOpNo ||
      formData.availableDays.length === 0
    ) {
      toast.error("Validation Error", {
        description: "Please fill all required fields",
      })
      return
    }

    setLoading(true)
    try {
      const result = await submitDoctorAvailability(formData)

      if (result.success) {
        toast.success("Success!", {
          description: "Doctor availability saved successfully",
        })

        // Reset form
        setFormData({
          doctorId: `DOC-${Date.now()}`,
          doctorName: "",
          department: "",
          specialization: "",
          availableDays: [],
          startTime: "",
          endTime: "",
          roomOrOpNo: "",
          status: true,
        })
      } else {
        toast.error("Error", {
          description: result.error || "Failed to save doctor availability",
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
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full mix-blend-multiply blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200/20 rounded-full mix-blend-multiply blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors mb-6 font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Stethoscope className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">Doctor Availability</h1>
          </div>
          <p className="text-slate-600 ml-11">Manage doctor schedules and availability slots</p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          {/* Success Message */}
          {formData.doctorId && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">Doctor availability saved successfully!</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Doctor ID */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Doctor ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.doctorId}
                disabled
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 placeholder-slate-400 cursor-not-allowed"
              />
            </div>

            {/* Doctor Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Doctor Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
                placeholder="Enter full name"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
              />
            </div>

            {/* Department and Specialization */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                >
                  <option value="">Select department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Specialization <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="E.g., Heart Surgery"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                />
              </div>
            </div>

            {/* Available Days */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">
                Available Days <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {days.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`px-2 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 border ${
                      formData.availableDays.includes(day)
                        ? "bg-blue-500 text-white border-blue-500 shadow-md"
                        : "bg-white border-slate-200 text-slate-700 hover:border-blue-300"
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  End Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                />
              </div>
            </div>

            {/* Room/OP Number */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Room / OP No <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="roomOrOpNo"
                value={formData.roomOrOpNo}
                onChange={handleChange}
                placeholder="E.g., OPD-101"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
              />
            </div>

            {/* Status Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <label className="text-sm font-semibold text-slate-900">
                Availability Status <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, status: !prev.status }))}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  formData.status ? "bg-blue-500" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    formData.status ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-slate-700">
                {formData.status ? "Available" : "Not Available"}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-400 disabled:to-slate-400 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-200 mt-8 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Doctor Availability"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
