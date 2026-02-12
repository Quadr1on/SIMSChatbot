"use server"

import { createServerComponentClient } from "@/lib/supabase/server"

export async function submitPatientDetails(formData: any) {
  try {
    const supabase = await createServerComponentClient()

    const { data, error } = await supabase
      .from("patient_details")
      .insert([
        {
          patient_id: formData.patientId,
          patient_name: formData.patientName,
          age: formData.age,
          gender: formData.gender,
          phone_number: formData.phoneNumber,
          ward_name: formData.wardName,
          bed_number: formData.bedNumber,
          floor: formData.floor,
          admission_status: formData.admissionStatus,
          condition: formData.condition,
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
