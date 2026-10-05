import CustomerForm from "../components/CustomerForm";

export default function Customers({
  records,
  setRecords,
}) {
  return (
    <>
      <h1 className="text-5xl font-bold mb-8">
        Πελάτες
      </h1>

      <CustomerForm
        records={records}
        setRecords={setRecords}
      />
    </>
  );
}