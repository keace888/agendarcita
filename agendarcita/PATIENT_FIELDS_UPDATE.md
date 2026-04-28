# Patient Form Expansion — EHR Agent Notes

agendarcita now collects additional demographic fields on the patient registration form.
These are sent to the booking API and saved via an UPDATE after the core patient upsert.
The UPDATE is wrapped in a silent try/catch so bookings won't break if columns are missing —
but until the migration runs, this data will be silently dropped.

## New columns needed in `agendarcita.patients`

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

## Field details

| Column | Source | Example values |
|--------|--------|----------------|
| `lugar_nacimiento` | Free text | "Caracas, Venezuela" |
| `nacionalidad` | Free text | "Venezolano/a" |
| `ocupacion` | Free text | "Ingeniero" |
| `estado_civil` | Enum-like | soltero, casado, divorciado, viudo, union_libre |
| `direccion` | Free text | "Av. Libertador, Edif. Centro, Piso 3" |
| `contacto_emergencia_nombre` | Free text | "María Contreras" |
| `contacto_emergencia_parentesco` | Free text | "Madre" |
| `contacto_emergencia_direccion` | Free text | "Av. Libertador, Caracas" |

## Notes
- All fields are optional — patients may leave them blank
- `telefono` column (added previously) holds the full phone with country code e.g. `+14121234567`
- `email` column is now unused by agendarcita (phone replaced it)
- The UPDATE uses COALESCE so existing values are never overwritten by NULL
