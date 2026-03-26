'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Slot {
  dateLabel: string;
  dayLabel: string;
  time: string;
  available: boolean;
  key: string;
}

function getSlots(): { date: string; day: string; slots: Slot[] }[] {
  const days: { date: string; day: string; slots: Slot[] }[] = [];
  const DAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const MONTHS_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const TIMES = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

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

    const slots: Slot[] = TIMES.map((time, i) => ({
      dateLabel,
      dayLabel,
      time,
      available: (dateNum + i * 3) % 4 !== 0,
      key: `${dateNum}-${time}`,
    }));

    days.push({ date: dateLabel, day: dayLabel, slots });
  }

  return days;
}

export default function CalendarPicker({
  dept,
  cedula,
}: {
  dept: string;
  cedula: string;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const days = getSlots();

  async function confirm() {
    if (!selected) return;
    try {
      await fetch('/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cedula, dept, slot: selected }),
      });
    } catch (_) {
      // continue even if email fails in demo
    }
    router.push(
      `/confirmado?dept=${encodeURIComponent(dept)}&cedula=${cedula}&slot=${encodeURIComponent(selected)}`
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
                const isSelected = selected === slot.key;
                return (
                  <button
                    key={slot.key}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => setSelected(slot.key)}
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
          <p className="text-sm text-gray-600 mb-1">
            Horario seleccionado:
          </p>
          <p className="font-semibold text-gray-800 mb-4">{selected.replace('-', ' · ')}</p>
          <button
            type="button"
            onClick={confirm}
            className="w-full text-white font-semibold py-3 rounded-xl transition-opacity hover:opacity-90 text-sm"
            style={{ backgroundColor: '#2ECC71' }}
          >
            Confirmar Cita →
          </button>
        </div>
      )}
    </div>
  );
}
