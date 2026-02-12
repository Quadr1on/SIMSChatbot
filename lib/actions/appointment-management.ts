"use server"

import { createServerComponentClient } from "@/lib/supabase/server"

export async function submitAppointment(formData: any) {
  try {
    const supabase = await createServerComponentClient()

    const { data, error } = await supabase
      .from("appointment_management")
      .insert([
        {
          appointment_id: formData.appointmentId,
          patient_name: formData.patientName,
          doctor_name: formData.doctorName,
          appointment_date: formData.appointmentDate,
          appointment_time: formData.appointmentTime,
          status: formData.status,
          notes: formData.notes,
        },
      ])
      .select()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}
