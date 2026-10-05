import CustomerForm from "../components/CustomerForm";

export default function Customers({
  records,
  setRecords,
}) {
  return (
    <CustomerForm
      records={records}
      setRecords={setRecords}
    />
  );
}