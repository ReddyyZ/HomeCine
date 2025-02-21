import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { PiPopcorn } from "react-icons/pi";
import "./styles.css";
import { useRef } from "react";

type ListProps = {
  type: "movies" | "series" | "search";
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export default function List({ children, type, style }: ListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  const scrollToLeft = () => {
    if (!listRef.current) return;
    listRef.current.scrollLeft -= 200;
  };
  const scrollToRight = () => {
    if (!listRef.current) return;
    listRef.current.scrollLeft += 200;
  };

  const emptyMessages = {
    movies: {
      main: "No Movies Found",
      sub: "It looks like your library is empty. Upload a movie to get started!",
    },
    series: {
      main: "No Series Found",
      sub: "It looks like your library is empty. Upload a series to get started!",
    },
    search: {
      main: "No Results Found",
      sub: "It looks like there are no results for your search. Try again with a different keyword!",
    },
  };

  if (Array.isArray(children) && children.length) {
    return (
      <div className="relative">
        <div className="list noselect" ref={listRef} style={style}>
          <button
            onClick={scrollToLeft}
            className="listBtn listBtnLeft absolute top-0 left-0 z-10 flex h-[100%] items-center justify-center"
          >
            <IoChevronBack size={36} fill="#E0E0E0" />
          </button>
          {children}
          <button
            onClick={scrollToRight}
            className="listBtn listBtnRight absolute right-0 z-10 flex h-[100%] items-center justify-center"
          >
            <IoChevronForward size={36} fill="#E0E0E0" />
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center p-8 text-center text-gray-100">
        {/* Illustration */}
        <PiPopcorn size={48} fill="#FFA726" />

        {/* Main Message */}
        <h1 className="mb-2 text-2xl font-bold">{emptyMessages[type].main}</h1>

        {/* Subtext */}
        <p className="mb-6 text-center text-gray-200">
          {emptyMessages[type].sub}
        </p>
      </div>
    );
  }
}
