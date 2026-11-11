import { useGetClassesQuery } from "@/api/AdminApi";
import Heading from "@/common/Heading";
import ClassTableOverview from "@/components/admindashboard/ClassTableOverview";

function Admin() {
  const headingProps = {
    upper_subtitle: "Administration",
    title: "Admin Dashboard",
    subtitle: "Manage classes and review current seat availability.",
  };

  const {
    data: classes,
    isLoading,
    isError,
    error,
  } = useGetClassesQuery(undefined);

  console.log("Classes data:", classes);
  if (isLoading) {
    return <p>Loading classes...</p>;
  }

  if (isError) {
    return <p>Failed to load classes.</p>;
  }

  console.log("Classes data after loading:", classes);
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
