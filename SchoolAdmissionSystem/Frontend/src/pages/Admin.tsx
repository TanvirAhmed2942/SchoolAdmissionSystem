import Heading from "@/common/Heading";
import ClassTableOverview from "@/components/admindashboard/ClassTableOverview";

function Admin() {
  const headingProps = {
    upper_subtitle: "Administration",
    title: "Admin Dashboard",
    subtitle: "Manage classes and review current seat availability.",
  };

  return (
    <div>
      <div className="flex flex-col fitems-center  gap-4">
        <Heading {...headingProps} />
        <ClassTableOverview />
      </div>
    </div>
  );
}

export default Admin;
