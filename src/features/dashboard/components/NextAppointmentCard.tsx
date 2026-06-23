import type { NextAppointment } from "../types";

type NextAppointmentCardProps = {
  appointment: NextAppointment;
};

export function NextAppointmentCard({
  appointment,
}: NextAppointmentCardProps) {
  return (
    <section className="rounded-lg border border-[#ddd6c8] bg-[#2f5d50] p-5 text-white shadow-sm">
      <p className="text-sm font-semibold text-[#d7ead1]">{appointment.label}</p>
      <h2 className="mt-3 text-2xl font-bold">{appointment.dateText}</h2>
      <p className="mt-3 text-sm leading-6 text-[#eef7ea]">
        {appointment.description}
      </p>
    </section>
  );
}
