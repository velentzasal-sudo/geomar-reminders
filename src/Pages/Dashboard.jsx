import DashboardCards from "../components/DashboardCards";

export default function Dashboard({
  records,
}) {
  return (
    <>
      <h1 className="text-5xl font-bold mb-8">
        Dashboard
      </h1>

      <DashboardCards
        records={records}
      />
    </>
  );
}