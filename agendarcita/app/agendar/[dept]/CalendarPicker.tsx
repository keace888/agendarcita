'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Slot {
  label:       string   // display: "8:00 AM"
  scheduledAt: string   // ISO string stored in DB
  key:         string   // unique key for React
  available:   boolean
}

interface Day {
  date:    string  // display: "17 Abr"
  day:     string  // display: "Mié"
  slots:   Slot[]
}

function getSlots(): Day[] {
  const days: Day[] = [];
  const DAYS_ES   = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const MONTHS_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  // Hours in 24h for scheduling (matching labels below)
  const HOURS = [8, 9, 10, 11, 14, 15, 16, 17];
  const LABELS = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

  const now = new Date();
  let offset = 1;

  while (days.length < 5) {
    const d = new Date(now);
    d.setDate(now.getDate() + offset);
    offset++;
    if (d.getDay() === 0 || d.getDay() === 6) continue;

    const dateLabel = `${d.getDate()} ${MONTHS_ES[d.getMonth()]}`;
    const dayLabel  = DAYS_ES[d.getDay()];
    const dateNum   = d.getDate();

    const slots: Slot[] = HOURS.map((hour, i) => {
      // Store as UTC equivalent of Venezuela time (UTC-4): add 4 hours to local midnight
      const dt = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), hour + 4, 0, 0, 0));
      const scheduledAt = dt.toISOString()

      return {
        label:       LABELS[i],
        scheduledAt,
        key:         `${d.getFullYear()}-${d.getMonth()}-${dateNum}-${hour}`,
        available:   (dateNum + i * 3) % 4 !== 0,
      }
    });

    days.push({ date: dateLabel, day: dayLabel, slots });
  }

  return days;
}

export default function CalendarPicker({
  dept,
  cedula,
}: {
  dept:   string;
  cedula: string;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<Slot | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const days = getSlots();

  async function confirm() {
    if (!selected) return;
    setLoading(true);
    setError(null);

    try {
      // Save to DB
      const bookRes = await fetch('/api/book-appointment', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cedula, dept, scheduledAt: selected.scheduledAt }),
      });
      const bookData = await bookRes.json();
      if (!bookRes.ok) {
        setError(bookData.error ?? 'Error al guardar la cita');
        setLoading(false);
        return;
      }

      // Send confirmation email (best-effort)
      try {
        await fetch('/api/send-confirmation', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cedula, dept, slot: `${selected.label}` }),
        });
      } catch (_) { /* ignore email errors */ }

      router.push(
        `/confirmado?dept=${encodeURIComponent(dept)}&cedula=${cedula}&slot=${encodeURIComponent(selected.label)}`
      );
    } catch (_) {
      setError('Error de conexión. Intenta de nuevo.');
      setLoading(false);
    }
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
                return (
                  <button
                    key={slot.key}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => { setSelected(slot); setError(null); }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      backgroundColor: !slot.available
                        ? '#f3f4f6'
                        : isSelected
                        ? '#1B4F8A'
                        : '#e8f0fb',
                      color: !slot.available
                        ? '#d1d5db'
                        : isSelected
                        ? '#ffffff'
                        : '#1B4F8A',
                      cursor: !slot.available ? 'not-allowed' : 'pointer',
                      border: isSelected ? '2px solid #1B4F8A' : '2px solid transparent',
                    }}
                  >
                    {slot.label}
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
          <p className="font-semibold text-gray-800 mb-4">{selected.label}</p>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={confirm}
            disabled={loading}
            className="w-full text-white font-semibold py-3 rounded-xl transition-opacity hover:opacity-90 text-sm disabled:opacity-60"
            style={{ backgroundColor: '#2ECC71' }}
          >
            {loading ? 'Guardando cita…' : 'Confirmar Cita →'}
          </button>
        </div>
      )}
    </div>
  );
}
