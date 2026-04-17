# Adding Medicina Estética to agendarcita

This guide documents all the changes needed to add the **Medicina Estética** department
to the booking site. The EHR side is already fully configured — this document only covers
the agendarcita (booking) side.

---

## Context

The EHR (`ehr-app`) already has:
- Doctor: **Dr. Carlos Vargas** (`carlos.vargas@hdl.com`, dept `estetica`)
- EHR dept slug: `estetica`
- 8 aesthetic clinical modules (toxina botulínica, rellenos, peeling, láser/IPL, etc.)
- Pink color theme: `#fce7f3` / `#be185d` / `#f9a8d4`

The booking site needs to expose this department so patients can schedule appointments.
Appointments written to `agendarcita.appointments` with `department = 'estetica'` will
automatically show up in the EHR calendar for Dr. Vargas.

---

## Files to change (3 files total)

### 1. `app/agendar/page.tsx`

Add an entry to the `DEPARTMENTS` array:

```tsx
const DEPARTMENTS = [
  { slug: 'oftalmologia',  label: 'Oftalmología',      icon: '👁️',  desc: 'Salud visual y ocular' },
  { slug: 'traumatologia', label: 'Traumatología',     icon: '🦴',  desc: 'Lesiones músculo-esqueléticas' },
  { slug: 'oncologia',     label: 'Oncología',          icon: '🩺',  desc: 'Diagnóstico y tratamiento oncológico' },
  // ADD THIS:
  { slug: 'estetica',      label: 'Medicina Estética',  icon: '✨',  desc: 'Tratamientos estéticos y rejuvenecimiento' },
];
```

This makes the department appear in the picker at `/agendar`.

---

### 2. `app/agendar/[dept]/CalendarPicker.tsx`

Add the doctor to the `DOCTORS` map:

```tsx
const DOCTORS: Record<string, string> = {
  oftalmologia:  'Dra. Ana Salcedo',
  traumatologia: 'Dr. Carlos Medina',
  oncologia:     'Dra. María Torres',
  // ADD THIS:
  estetica:      'Dr. Carlos Vargas',
};
```

This is the name stored in `agendarcita.appointments.doctor_name` and shown in the EHR calendar.

---

### 3. `app/agendar/[dept]/IntakeForm.tsx`

Two additions:

**a) Add pre-appointment intake fields** in `DEPT_CONFIG`:

```tsx
const DEPT_CONFIG: Record<string, Field[]> = {
  oftalmologia: [ /* existing */ ],
  traumatologia: [ /* existing */ ],
  oncologia: [ /* existing */ ],
  // ADD THIS:
  estetica: [
    {
      key: 'motivo_consulta',
      label: 'Motivo de la consulta estética',
      type: 'textarea',
    },
    {
      key: 'area_tratamiento',
      label: 'Área(s) de interés',
      type: 'text',
    },
    {
      key: 'tratamientos_previos',
      label: 'Tratamientos estéticos previos',
      type: 'textarea',
    },
    {
      key: 'alergias_conocidas',
      label: 'Alergias conocidas',
      type: 'text',
    },
    {
      key: 'medicamentos_actuales',
      label: 'Medicamentos actuales',
      type: 'text',
    },
  ],
};
```

**b) Fix the `deptLabel` fallback** (currently hardcoded to `'Oncología'` for unknown depts):

```tsx
const deptLabel =
  dept === 'oftalmologia'
    ? 'Oftalmología'
    : dept === 'traumatologia'
    ? 'Traumatología'
    : dept === 'oncologia'
    ? 'Oncología'
    : dept === 'estetica'
    ? 'Medicina Estética'   // ADD THIS
    : dept;                  // fallback for future depts
```

---

### 4. `app/api/book-appointment/route.ts`

Add the dept label and email icon:

```ts
const DEPT_LABELS: Record<string, string> = {
  oftalmologia:  'Oftalmología',
  traumatologia: 'Traumatología',
  oncologia:     'Oncología',
  estetica:      'Medicina Estética',   // ADD THIS
};

const DEPT_ICONS: Record<string, string> = {
  oftalmologia:  '👁️',
  traumatologia: '🦴',
  oncologia:     '🩺',
  estetica:      '✨',                  // ADD THIS
};
```

These values appear in the confirmation email sent to the patient.

---

## How the data flows into the EHR

When a patient books via `/agendar/estetica/...`, the `POST /api/book-appointment` handler writes:

```sql
INSERT INTO agendarcita.appointments
  (patient_id, department, doctor_name, scheduled_at, status)
VALUES
  ($patientId, 'estetica', 'Dr. Carlos Vargas', $scheduledTime, 'scheduled')
```

The EHR calendar query filters `a.department = 'estetica'` for Dr. Vargas's login,
so the appointment will appear in his calendar automatically with no further changes needed.

---

## Booking URL format

If you need to link directly to the aesthetics booking flow (e.g., from a QR code or landing page):

```
/agendar/estetica/calendario?cedula=12345678
```

Or starting from the intake form:

```
/agendar/estetica?cedula=12345678
```

---

## No database migrations needed

The `agendarcita.appointments` table already accepts any string in the `department` column.
The EHR `ehr_app.users` table already has Dr. Carlos Vargas with `department = 'estetica'`.
No SQL changes are required.
