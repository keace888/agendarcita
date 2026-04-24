export interface Referral {
  department: string;
  doctor: string;
}

export interface Patient {
  nombre: string;
  apellido: string;
  cedula: string;
  telefono: string;
  referral?: Referral;
}

export const SPECIALIST_DEPARTMENTS = ['Cardiología', 'Neurología', 'Endocrinología', 'Gastroenterología'];

export const REGULAR_DEPARTMENTS = [
  'Medicina General',
  'Pediatría',
  'Ginecología',
  'Traumatología',
  'Oftalmología',
  'Dermatología',
];

export const DEPT_ICONS: Record<string, string> = {
  'Cardiología': '🫀',
  'Neurología': '🧠',
  'Endocrinología': '🧬',
  'Gastroenterología': '💊',
  'Medicina General': '🏥',
  'Pediatría': '👶',
  'Ginecología': '🌸',
  'Traumatología': '🦴',
  'Oftalmología': '👁️',
  'Dermatología': '🩺',
};

export const patients: Patient[] = [
  {
    nombre: 'José',
    apellido: 'Contreras',
    cedula: '30496453',
    telefono: '04121234567',
    referral: {
      department: 'Cardiología',
      doctor: 'Dr. Ramón Herrera',
    },
  },
  {
    nombre: 'Ana',
    apellido: 'García',
    cedula: '12345678',
    telefono: '04141234567',
  },
  {
    nombre: 'Carlos',
    apellido: 'Pérez',
    cedula: '87654321',
    telefono: '04161234567',
    referral: {
      department: 'Neurología',
      doctor: 'Dra. Isabel Martínez',
    },
  },
  {
    nombre: 'María',
    apellido: 'López',
    cedula: '11223344',
    telefono: '04261234567',
  },
];

export function findPatient(cedula: string): Patient | undefined {
  const normalized = cedula.replace(/\D/g, '');
  return patients.find((p) => p.cedula === normalized);
}
