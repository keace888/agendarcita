# Patient Form Expansion — EHR Agent Notes

agendarcita now collects additional demographic fields on the patient registration form.
These arrive in the booking API and are saved via a separate UPDATE after the core patient upsert.
The UPDATE is wrapped in a silent try/catch — bookings won't break if columns are missing,
but data will be silently dropped until the migration below is run.

---

## 1. Migration — run this on `agendarcita` schema

```sql
ALTER TABLE agendarcita.patients
  ADD COLUMN IF NOT EXISTS lugar_nacimiento               TEXT,
  ADD COLUMN IF NOT EXISTS nacionalidad                   TEXT,
  ADD COLUMN IF NOT EXISTS ocupacion                      TEXT,
  ADD COLUMN IF NOT EXISTS estado_civil                   TEXT,
  ADD COLUMN IF NOT EXISTS direccion                      TEXT,
  ADD COLUMN IF NOT EXISTS contacto_emergencia_nombre     TEXT,
  ADD COLUMN IF NOT EXISTS contacto_emergencia_parentesco TEXT,
  ADD COLUMN IF NOT EXISTS contacto_emergencia_direccion  TEXT;
```

---

## 2. Field reference

| Column | Source | Example values | Notes |
|--------|--------|----------------|-------|
| `lugar_nacimiento` | Free text | "Caracas, Venezuela" | — |
| `nacionalidad` | Free text | "Venezolano/a" | — |
| `ocupacion` | Free text | "Ingeniero" | — |
| `estado_civil` | Controlled values | see below | lowercase string |
| `direccion` | Free text | "Av. Libertador, Edif. Centro, Piso 3" | patient's home address |
| `contacto_emergencia_nombre` | Free text | "María Contreras" | — |
| `contacto_emergencia_parentesco` | Free text | "Madre", "Esposo/a" | — |
| `contacto_emergencia_direccion` | Free text | "Av. Libertador, Caracas" | — |

**`estado_civil` possible values:** `soltero`, `casado`, `divorciado`, `viudo`, `union_libre`
You may want to map these to display labels (e.g. `union_libre` → "Unión libre") in the UI.

---

## 3. `telefono` column (previously communicated)

The `email` column in `agendarcita.patients` is now **unused** by agendarcita.
Phone number is stored in `telefono` as a full E.164 string: `+14121234567`, `+584121234567`, `+574121234567`.
Existing rows have `telefono = NULL` until patients rebook.

---

## 4. Backward compatibility

- All new fields are optional — patients may submit the form without filling them in (value will be NULL)
- Existing patient rows will have NULLs for all new columns until the patient books again
- The UPDATE uses COALESCE, so re-booking never overwrites a value already on file with NULL

---

## 5. Suggested EHR display changes

These fields are standard Venezuelan hospital intake fields. Suggested placement:

- **Patient profile / ficha del paciente**: show `estado_civil`, `ocupacion`, `nacionalidad`, `lugar_nacimiento`, `direccion` in a "Datos Demográficos" section
- **Encounter sidebar or admission view**: show `contacto_emergencia_nombre`, `contacto_emergencia_parentesco`, `contacto_emergencia_direccion` grouped as "Contacto de Emergencia" — this is critical for inpatient/emergency scenarios
- **Patient list / search**: `cedula` remains the primary identifier; `telefono` is now the contact field to surface (replace any display of `email`)

---

## 6. `cedula` field note

agendarcita now labels this field **"Cédula / Pasaporte"** with the hint:
*"Cédula si eres venezolano, número de pasaporte si eres extranjero"*

Foreign patients will have a passport number here instead of a V- cédula.
Your patient search and deduplication logic should handle alphanumeric values in this column.
