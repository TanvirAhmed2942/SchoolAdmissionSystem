import Heading from "@/common/Heading";
import ApplyClassTable from "@/components/applyclasstable/ApplyClassTable";

const headingProps = {
  upper_subtitle: "Admissions open for 2026",
  title: "Available Classes",
  subtitle:
    "Select an available class to reserve a seat. A reservation will be held for 10 minutes while you confirm admission.",
};

function App() {
  return (
    <div>
      <Heading {...headingProps} />
      <ApplyClassTable />
    </div>
  );
}

export default App;
