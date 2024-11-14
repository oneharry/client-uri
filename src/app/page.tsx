import { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import Chart from "@/components/chart/chart";
import Table from "@/components/table/table";
import BarChart from '@/components/chart/chart';
import axios from 'axios';

interface ApplicationData {
  id: string;
  jobTitle: string;
  companyName: string;
  status: string;
  dateApplied: string;
}

const Home = ({ data }: { data: ApplicationData[] }) => {
  return (
    <div className="container mx-auto p-4 mx-0 md:mx-auto w-11/12 md:w-9/12">
      <h1 className="text-2xl font-bold mb-4">Job Application Board</h1>
      <Table />
      <BarChart />
    </div>
  );
};

export default Home;
