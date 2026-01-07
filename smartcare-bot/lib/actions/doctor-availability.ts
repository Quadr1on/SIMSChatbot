"use server"

import { createServerComponentClient } from "@/lib/supabase/server"

export async function submitDoctorAvailability(formData: any) {
  try {
    const supabase = await createServerComponentClient()

    const { data, error } = await supabase
      .from("doctor_availability")
      .insert([
        {
          doctor_id: formData.doctorId,
          doctor_name: formData.doctorName,
          department: formData.department,
          specialization: formData.specialization,
          available_days: formData.availableDays,
          start_time: formData.startTime,
          end_time: formData.endTime,
          room_or_op_no: formData.roomOrOpNo,
          status: formData.status,
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
