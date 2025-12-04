import LineChart from "../dashboard/components/LineChart";

interface VisualizationsViewProps {
  data: any; // Replace with the actual type if available
}

export default function VisualizationsView({ data }: VisualizationsViewProps) {
  return (
    <div className="w-full max-w-4xl mx-auto h-96 bg-gray-800 rounded-xl shadow-2xl p-4">
      <LineChart data={data} />
    </div>
  );
}
