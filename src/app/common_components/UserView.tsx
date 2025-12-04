import SummaryCard from "../dashboard/components/SummaryCards";

interface Data {
  universities: number;
  students: number;
  industryExperts: number;
  faculties: number;
  companies: number;
}

interface UsersViewProps {
  data: Data;
}

export default function UsersView({ data }: UsersViewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <SummaryCard
        title="Universities"
        count={data.universities}
        description="Total number of universities"
      />
      <SummaryCard
        title="Students"
        count={data.students}
        description="Total number of students"
      />
      <SummaryCard
        title="Industry Experts"
        count={data.industryExperts}
        description="Total number of industry experts"
      />
      <SummaryCard
        title="Faculties"
        count={data.faculties}
        description="Total number of faculties"
      />
      <SummaryCard
        title="Companies"
        count={data.companies}
        description="Total number of companies"
      />
    </div>
  );
}
