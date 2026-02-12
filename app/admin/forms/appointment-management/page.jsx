"use client"

import { useState } from "react"
import { ChevronLeft, Calendar, Loader2 } from "lucide-react"
import Link from "next/link"
import { Toaster, toast } from "sonner"
import { submitAppointment } from "@/lib/actions/appointment-management"

export default function AppointmentManagementForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    appointmentId: `APT-${Date.now()}`,
    patientName: "",
    doctorName: "",
    appointmentDate: "",
    appointmentTime: "",
    status: "",
    notes: "",
  })

  const statuses = ["Scheduled", "Completed", "Cancelled", "No Show"]
  const patients = ["John Doe", "Jane Smith", "Robert Johnson", "Emily Davis"]
  const doctors = ["Dr. Ahmed", "Dr. Sarah", "Dr. Michael", "Dr. Lisa"]

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
      !formData.doctorName ||
      !formData.appointmentDate ||
      !formData.appointmentTime ||
      !formData.status
    ) {
      toast.error("Validation Error", {
        description: "Please fill all required fields",
      })
      return
    }

    setLoading(true)
    try {
      const result = await submitAppointment(formData)

      if (result.success) {
        toast.success("Success!", {
          description: "Appointment saved successfully",
        })

        // Reset form
        setFormData({
          appointmentId: `APT-${Date.now()}`,
          patientName: "",
          doctorName: "",
          appointmentDate: "",
          appointmentTime: "",
          status: "",
          notes: "",
        })
      } else {
        toast.error("Error", {
          description: result.error || "Failed to save appointment",
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
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/20 rounded-full mix-blend-multiply blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-200/20 rounded-full mix-blend-multiply blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors mb-6 font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">Appointment Management</h1>
          </div>
          <p className="text-slate-600 ml-11">Schedule and track patient appointments</p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          {loading && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">Saving appointment...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Appointment ID */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Appointment ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.appointmentId}
                disabled
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 placeholder-slate-400 cursor-not-allowed"
              />
            </div>

            {/* Patient and Doctor Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Patient Name <span className="text-red-500">*</span>
                </label>
                <select
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all outline-none"
                >
                  <option value="">Select patient</option>
                  {patients.map((patient) => (
                    <option key={patient} value={patient}>
                      {patient}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Doctor Name <span className="text-red-500">*</span>
                </label>
                <select
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all outline-none"
                >
                  <option value="">Select doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor} value={doctor}>
                      {doctor}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all outline-none"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all outline-none"
              >
                <option value="">Select status</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any notes about the appointment"
                rows="4"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all outline-none resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-400 disabled:to-slate-400 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-200 mt-8 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Appointment"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
