import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { PiPopcorn } from "react-icons/pi";
import "./styles.css";
import { useRef } from "react";

type ListProps = {
  type: "movies" | "series" | "search";
  children: React.ReactNode;
};

export default function List({ children, type }: ListProps) {
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
        <div className="list noselect" ref={listRef}>
          <button
            onClick={scrollToLeft}
            className="listBtn listBtnLeft absolute z-10 top-1/2 left-0 transform -translate-y-1/2 h-[100%] flex items-center justify-center"
          >
            <IoChevronBack size={36} fill="#E0E0E0" />
          </button>
          {children}
          <button
            onClick={scrollToRight}
            className="listBtn listBtnRight absolute z-10 top-1/2 right-0 transform -translate-y-1/2 h-[100%] flex items-center justify-center"
          >
            <IoChevronForward size={36} fill="#E0E0E0" />
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center text-[#E0E0E0] p-8 text-center">
        {/* Illustration */}
        <PiPopcorn size={48} fill="#FFA726" />

        {/* Main Message */}
        <h1 className="text-2xl font-bold mb-2">{emptyMessages[type].main}</h1>

        {/* Subtext */}
        <p className="text-[#B0B0B0] text-center mb-6">
          {emptyMessages[type].sub}
        </p>
      </div>
    );
  }
}
