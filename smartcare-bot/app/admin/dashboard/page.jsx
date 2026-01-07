"use client"

import { useState } from "react"
import Link from "next/link"
import { Stethoscope, Users, Calendar, MapPin, ArrowRight } from "lucide-react"

const forms = [
  {
    id: 1,
    name: "Doctor Availability",
    description: "Manage doctor schedules and availability",
    icon: Stethoscope,
    href: "/admin/forms/doctor-availability",
    bgGradient: "from-blue-50 to-blue-100",
    accentColor: "text-blue-600",
    borderColor: "border-blue-200",
    hoverBg: "hover:bg-blue-100/50",
  },
  {
    id: 2,
    name: "Patient Details",
    description: "Register and manage patient information",
    icon: Users,
    href: "/admin/forms/patient-details",
    bgGradient: "from-emerald-50 to-emerald-100",
    accentColor: "text-emerald-600",
    borderColor: "border-emerald-200",
    hoverBg: "hover:bg-emerald-100/50",
  },
  {
    id: 3,
    name: "Appointment Management",
    description: "Schedule and track patient appointments",
    icon: Calendar,
    href: "/admin/forms/appointment-management",
    bgGradient: "from-purple-50 to-purple-100",
    accentColor: "text-purple-600",
    borderColor: "border-purple-200",
    hoverBg: "hover:bg-purple-100/50",
  },
]

export default function AdminDashboard() {
  const [hoveredId, setHoveredId] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-200/30 rounded-full mix-blend-multiply blur-3xl animate-blob"></div>
        <div
          className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-200/30 rounded-full mix-blend-multiply blur-3xl animate-blob"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/3 left-1/2 w-64 h-64 bg-emerald-200/30 rounded-full mix-blend-multiply blur-3xl animate-blob"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="relative z-10 min-h-screen px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-4 tracking-tight">Admin Dashboard</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Manage all hospital operations from a single unified interface. Access forms to manage doctors, patients,
              appointments, and ward information.
            </p>
          </div>

          {/* Forms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
            {forms.map((form) => {
              const Icon = form.icon
              const isHovered = hoveredId === form.id

              return (
                <Link
                  key={form.id}
                  href={form.href}
                  onMouseEnter={() => setHoveredId(form.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group"
                >
                  <div
                    className={`relative h-full bg-gradient-to-br ${form.bgGradient} border-2 ${form.borderColor} rounded-2xl p-8 backdrop-blur-sm transition-all duration-300 ${form.hoverBg} hover:border-opacity-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50`}
                  >
                    {/* Card content wrapper */}
                    <div className="relative">
                      {/* Icon Badge */}
                      <div
                        className={`inline-block p-3 bg-white/80 backdrop-blur rounded-xl mb-6 transition-transform duration-300 ${isHovered ? "scale-110 shadow-lg" : ""}`}
                      >
                        <Icon className={`w-6 h-6 ${form.accentColor}`} />
                      </div>

                      {/* Text Content */}
                      <h2
                        className={`text-2xl font-bold text-slate-900 mb-2 transition-colors duration-300 ${isHovered ? form.accentColor : ""}`}
                      >
                        {form.name}
                      </h2>
                      <p className="text-slate-600 text-sm leading-relaxed mb-6">{form.description}</p>

                      {/* CTA with arrow */}
                      <div className="flex items-center gap-2 font-semibold transition-all duration-300">
                        <span className={`${form.accentColor}`}>Access Form</span>
                        <ArrowRight
                          className={`w-4 h-4 ${form.accentColor} transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Footer Info */}
          <div className="text-center border-t border-slate-200 pt-8">
            <p className="text-slate-600 text-sm">
              All changes are saved automatically. Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
      `}</style>
    </div>
  )
}
