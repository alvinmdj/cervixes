import AdminCheck from "../../components/AdminCheck";
import { api } from "../../utils/api";

const Dashboard = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <AdminCheck>
      <p className="text-2xl text-black">
        {hello.data ? hello.data.greeting : "Loading tRPC query..."}
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos
        laudantium facere maxime consequuntur est voluptatem qui unde, rerum
        temporibus laboriosam accusantium voluptates, cumque eos assumenda hic
        at esse officiis veritatis?
      </p>
    </AdminCheck>
  );
};

export default Dashboard;
