import Heading from "@/common/Heading";
import MyApplicationsTable from "@/components/myapplicationstable/MyApplicationsTable";
import { Button } from "@/components/ui/button";

import { useNavigate } from "react-router";

function MyApplications() {
  const navigate = useNavigate();

  const headingProps = {
    upper_subtitle: "Admission records",
    title: "My Applications",
    subtitle:
      "Review the current student’s admission applications and reservation status.",
  };
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <Heading {...headingProps} />

        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          variant="secondary"
          onClick={() => navigate("/")}
        >
          View Available Classes
        </Button>
      </div>
      <MyApplicationsTable />
    </div>
  );
}

export default MyApplications;
