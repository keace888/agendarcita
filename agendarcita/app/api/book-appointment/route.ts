import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { findPatient } from '@/data/patients'

// Maps agendarcita display names → EHR department slugs
const DEPT_SLUG: Record<string, string> = {
  'Oftalmología':       'oftalmologia',
  'Traumatología':      'traumatologia',
  'Oncología':          'oncologia',
  'Medicina General':   'medicina_general',
  'Pediatría':          'pediatria',
  'Ginecología':        'ginecologia',
  'Dermatología':       'dermatologia',
  'Cardiología':        'cardiologia',
  'Neurología':         'neurologia',
  'Endocrinología':     'endocrinologia',
  'Gastroenterología':  'gastroenterologia',
}

export async function POST(request: Request) {
  const { cedula, dept, scheduledAt, doctorName } = await request.json()

  if (!cedula || !dept || !scheduledAt) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
  }

  const patient = findPatient(cedula)
  if (!patient) {
    return NextResponse.json({ error: 'Paciente no encontrado' }, { status: 404 })
  }

  const deptSlug = DEPT_SLUG[dept] ?? dept.toLowerCase()

  try {
    // Per-doctor conflict: same doctor can't have two patients at the same time.
    // If no doctor is assigned, fall back to per-department check.
    const conflictQuery = doctorName
      ? `SELECT id FROM agendarcita.appointments
         WHERE doctor_name = $1 AND scheduled_at = $2 AND status != 'cancelled'`
      : `SELECT id FROM agendarcita.appointments
         WHERE department = $1 AND scheduled_at = $2 AND status != 'cancelled'`
    const conflict = await pool.query(conflictQuery, [doctorName ?? deptSlug, scheduledAt])
    if (conflict.rows.length > 0) {
      return NextResponse.json(
        { error: 'Este médico ya tiene un paciente en ese horario. Por favor elige otro.' },
        { status: 409 }
      )
    }

    // Upsert patient (trim whitespace so names stay clean)
    const upsert = await pool.query<{ id: string }>(
      `INSERT INTO agendarcita.patients (nombre, apellido, cedula, telefono)
       VALUES (TRIM($1), TRIM($2), TRIM($3), TRIM($4))
       ON CONFLICT (cedula) DO UPDATE SET
         nombre    = TRIM(EXCLUDED.nombre),
         apellido  = TRIM(EXCLUDED.apellido),
         telefono  = TRIM(EXCLUDED.telefono),
         updated_at = now()
       RETURNING id`,
      [patient.nombre, patient.apellido, patient.cedula, patient.telefono]
    )
    const patientId = upsert.rows[0].id

    // Set referral data if present
    if (patient.referral) {
      await pool.query(
        `UPDATE agendarcita.patients
         SET referral_department = $1, referral_doctor = $2
         WHERE id = $3`,
        [patient.referral.department, patient.referral.doctor, patientId]
      )
    }

    // Insert appointment
    await pool.query(
      `INSERT INTO agendarcita.appointments
         (patient_id, department, doctor_name, scheduled_at, status)
       VALUES ($1, $2, $3, $4, 'scheduled')`,
      [patientId, deptSlug, doctorName ?? null, scheduledAt]
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[book-appointment]', err)
    return NextResponse.json({ error: 'Error al guardar la cita' }, { status: 500 })
  }
}
