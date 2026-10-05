import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";

export default function CalendarView({
  records,
}) {
  const navigate = useNavigate();

  const events = records.flatMap(
    (customer) => {
      const events = [];

      if (customer.nextCardDate) {
        events.push({
          title: `📨 Καρτέλα - ${customer.customer}`,
          start: customer.nextCardDate,
          color: "#2563eb",
          customer: customer.customer,
        });

        if (
          customer.monthlyCardRepeat
        ) {
          for (
            let i = 1;
            i <= 12;
            i++
          ) {
            const nextDate =
              new Date(
                customer.nextCardDate
              );

            nextDate.setMonth(
              nextDate.getMonth() +
                i
            );

            events.push({
              title: `📨 Καρτέλα - ${customer.customer}`,
              start: nextDate
                .toISOString()
                .split("T")[0],
              color: "#2563eb",
              customer:
                customer.customer,
            });
          }
        }
      }

      return events;
    }
  );

  return (
    <div
      id="calendar"
      className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-8"
    >
      <h2 className="text-2xl font-bold mb-4">
        📅 Ημερολόγιο
      </h2>

      <div className="bg-white rounded-2xl p-4 text-black">
        <FullCalendar
          plugins={[
            dayGridPlugin,
            interactionPlugin,
          ]}
          initialView="dayGridMonth"
          locale="el"
          height="700px"
          events={events}
          dayMaxEvents={true}
          weekends={true}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth",
          }}
          eventClick={(info) => {
            const customerName =
              info.event.extendedProps
                .customer;

            if (!customerName)
              return;

            navigate(
              `/customers/${encodeURIComponent(
                customerName
              )}`
            );
          }}
        />
      </div>
    </div>
  );
}