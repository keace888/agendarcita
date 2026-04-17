'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Slot {
  dateLabel: string;
  dayLabel: string;
  time: string;
  available: boolean;
  key: string;
  isoDate: string;
}

const DAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const TIMES = [
  { label: '8:00 AM', hour: 8 },
  { label: '9:00 AM', hour: 9 },
  { label: '10:00 AM', hour: 10 },
  { label: '11:00 AM', hour: 11 },
  { label: '2:00 PM', hour: 14 },
  { label: '3:00 PM', hour: 15 },
  { label: '4:00 PM', hour: 16 },
  { label: '5:00 PM', hour: 17 },
];

function getSlots(): { date: string; day: string; slots: Slot[] }[] {
  const days: { date: string; day: string; slots: Slot[] }[] = [];
  const today = new Date();
  let offset = 1;

  while (days.length < 5) {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    offset++;
    if (d.getDay() === 0 || d.getDay() === 6) continue;

    const dateLabel = `${d.getDate()} ${MONTHS_ES[d.getMonth()]}`;
    const dayLabel = DAYS_ES[d.getDay()];
    const dateNum = d.getDate();

    const slots: Slot[] = TIMES.map((t, i) => {
      // Build timestamp in Venezuela time (UTC-4) regardless of client timezone
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const hh = String(t.hour).padStart(2, '0');
      const isoDate = new Date(`${yyyy}-${mm}-${dd}T${hh}:00:00-04:00`).toISOString();
      return {
        dateLabel,
        dayLabel,
        time: t.label,
        available: (dateNum + i * 3) % 4 !== 0,
        key: `${dateNum}-${t.label}`,
        isoDate,
      };
    });

    days.push({ date: dateLabel, day: dayLabel, slots });
  }

  return days;
}

const DOCTORS: Record<string, string> = {
  oftalmologia: 'Dra. Ana Salcedo',
  traumatologia: 'Dr. Carlos Medina',
  oncologia: 'Dra. María Torres',
};

export default function CalendarPicker({
  dept,
  cedula,
  nombre,
  apellido,
  email,
  nacimiento,
  sexo,
}: {
  dept: string;
  cedula: string;
  nombre: string;
  apellido: string;
  email: string;
  nacimiento: string;
  sexo: string;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(false);
  const [takenSlots, setTakenSlots] = useState<Set<string>>(new Set());
  const days = getSlots();

  async function confirm() {
    if (!selected || loading) return;
    setLoading(true);
    setSlotTaken(false);

    const clinicalData = JSON.parse(sessionStorage.getItem(`intake_${dept}`) ?? '{}');

    try {
      const res = await fetch('/api/book-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cedula, nombre, apellido, email, nacimiento, sexo,
          dept,
          doctor: DOCTORS[dept] ?? 'Médico asignado',
          scheduledTime: selected.isoDate,
          slot: selected.key,
          clinicalData,
        }),
      });

      if (res.status === 409) {
        setTakenSlots((prev) => new Set(prev).add(selected.key));
        setSelected(null);
        setLoading(false);
        return;
      }
    } catch (_) {
      // continue even if network fails in demo
    }

    router.push(
      `/confirmado?dept=${encodeURIComponent(dept)}&nombre=${encodeURIComponent(nombre)}&slot=${encodeURIComponent(selected.key)}`
    );
  }

  return (
    <div>
      <div className="space-y-4">
        {days.map((day) => (
          <div key={day.date} className="bg-white rounded-2xl shadow-sm p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              {day.day} · {day.date}
            </p>
            <div className="flex flex-wrap gap-2">
              {day.slots.map((slot) => {
                const isSelected = selected?.key === slot.key;
                const blocked = !slot.available || takenSlots.has(slot.key);
                return (
                  <button
                    key={slot.key}
                    type="button"
                    disabled={blocked}
                    onClick={() => setSelected(slot)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      backgroundColor: blocked ? '#f3f4f6' : isSelected ? '#1B4F8A' : '#e8f0fb',
                      color: blocked ? '#d1d5db' : isSelected ? '#ffffff' : '#1B4F8A',
                      cursor: blocked ? 'not-allowed' : 'pointer',
                      border: isSelected ? '2px solid #1B4F8A' : '2px solid transparent',
                    }}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="mt-6 bg-white rounded-2xl shadow-md p-5">
          <p className="text-sm text-gray-600 mb-1">Horario seleccionado:</p>
          <p className="font-semibold text-gray-800 mb-4">
            {selected.dateLabel} · {selected.time}
          </p>
          <button
            type="button"
            onClick={confirm}
            disabled={loading}
            className="w-full text-white font-semibold py-3 rounded-xl transition-opacity hover:opacity-90 disabled:opacity-50 text-sm"
            style={{ backgroundColor: '#2ECC71' }}
          >
            {loading ? 'Confirmando...' : 'Confirmar Cita →'}
          </button>
        </div>
      )}
    </div>
  );
}
