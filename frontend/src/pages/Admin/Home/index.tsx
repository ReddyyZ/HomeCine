import { useEffect, useState } from "react";
import { counts } from "../../../services/apiClient";
import { useAuth } from "../../../contexts/AuthProvider";

export default function AdminHome() {
  const [countsData, setCountsData] = useState<{
    movies: number;
    series: number;
    videos: number;
    users: number;
  }>();
  const auth = useAuth();

  const loadData = async () => {
    if (!auth.admin) {
      return auth.logoutAdmin();
    }
    const res = await counts(auth.admin);
    if (!res) {
      return console.log("Error loading data");
    }
    if (res.data?.error) {
      return console.log(res.data.error);
    }

    setCountsData(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>

      <div>
        <h2 className="mb-4 text-xl font-bold">Movies</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-md bg-gray-600 p-4 shadow-md">
            <h3 className="text-lg font-bold">Number of movies</h3>
            <p className="text-gray-500">{countsData?.movies}</p>
          </div>
          <div className="rounded-md bg-gray-600 p-4 shadow-md">
            <h3 className="text-lg font-bold">Number of series</h3>
            <p className="text-gray-500">{countsData?.series}</p>
          </div>
          <div className="rounded-md bg-gray-600 p-4 shadow-md">
            <h3 className="text-lg font-bold">Total of uploaded videos</h3>
            <p className="text-gray-500">{countsData?.videos}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-bold">Users</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-md bg-gray-600 p-4 shadow-md">
            <h3 className="text-lg font-bold">Registered users</h3>
            <p className="text-gray-500">{countsData?.users}</p>
          </div>
        </div>
      </div>
    </>
  );
}
