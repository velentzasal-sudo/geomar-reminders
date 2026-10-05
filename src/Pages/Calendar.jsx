import CalendarView from "../components/CalendarView";

export default function Calendar({
  records,
}) {
  return (
    <>
      <h1 className="text-5xl font-bold mb-8">
        Ημερολόγιο
      </h1>

      <CalendarView
        records={records}
      />
    </>
  );
}
