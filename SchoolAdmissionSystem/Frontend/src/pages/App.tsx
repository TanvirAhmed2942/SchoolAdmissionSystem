import Heading from "@/common/Heading";

const headingProps = {
  upper_subtitle: "Admissions open for 2025",
  title: "Available Classes",
  subtitle:
    "Select an available class to reserve a seat. A reservation will be held for 10 minutes while you confirm admission.",
};

function App() {
  return <Heading {...headingProps} />;
}

export default App;
