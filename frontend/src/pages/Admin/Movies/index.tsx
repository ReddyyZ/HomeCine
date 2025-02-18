import { useState } from "react";
import { useAuth } from "../../../contexts/AuthProvider";
import { getMovies } from "../../../services/apiClient";
import { Movie } from "../../types/movies";
import Image from "../../../components/Image";
import DropdownMenu from "../../../components/DropdownMenu";
import { IoAdd } from "react-icons/io5";
import colors from "../../../constants/colors";
import { IoEllipsisVertical } from "react-icons/io5";
import TextWithReadMore from "../../../components/TextWithReadMore";

export default function AdminMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const auth = useAuth();

  const loadMovies = async () => {
    if (!auth.user) return;

    const res = await getMovies(auth.user);
    if (res.status === 401) {
      return auth.logout();
    }
    if (res.data?.error) {
      return alert(res.data.error);
    }

    setMovies(res.data);
  };

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Movies</h1>

        <DropdownMenu
          items={[
            {
              id: 1,
              value: "Create series",
            },
            {
              id: 2,
              value: "Upload movie",
            },
          ]}
          onSelect={(item) => console.log(item)}
          value={
            <div className="flex gap-2">
              New
              <IoAdd size={24} />
            </div>
          }
          btnStyle={{
            maxWidth: 100,
            justifyContent: "center",
            borderRadius: 4,
            backgroundColor: colors.primary,
          }}
          itemsContainerClassName="w-36 -translate-x-12"
        />
      </div>

      <div>
        <button
          onClick={loadMovies}
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          Load Movies
        </button>

        <div className="bg-secondaryBg mt-4 rounded-sm p-4">
          {movies.map((movie) => (
            <div className="my-4 flex w-full justify-between gap-1">
              <div
                key={movie.id}
                className="flex flex-col justify-between gap-4 rounded-sm md:flex-row"
              >
                <Image
                  src={movie.posterUrl}
                  className="aspect-video h-44 w-full max-w-80"
                />
                <div>
                  <p className="text-xl font-bold">{movie.title}</p>
                  <p>{movie.year}</p>
                  <TextWithReadMore
                    value={movie.overview ? movie.overview : ""}
                    limit={250}
                  />
                </div>
              </div>
              <DropdownMenu
                items={[
                  {
                    id: 1,
                    value: "Edit",
                  },
                  {
                    id: 2,
                    value: "Delete",
                  },
                ]}
                onSelect={(item) => console.log(item)}
                value={<IoEllipsisVertical size={24} />}
                btnStyle={{
                  maxWidth: "fit-content",
                  padding: 6,
                  justifyContent: "center",
                  borderRadius: 4,
                }}
                itemsContainerClassName="w-24 -translate-x-1/2"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
