import InfiniteScroll from "react-infinite-scroller";
import { Person } from "./Person";
import { useInfiniteQuery } from "@tanstack/react-query";

const initialUrl = "https://swapi.dev/api/people/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {
  const { data, fetchNextPage, hasNextPage, isLoading, error } =
    useInfiniteQuery({
      queryKey: "sw-people",
      queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
      getNextPageParam: (lastPage) => lastPage.next,
    });
  if (isLoading) return <div>Loading ...!</div>;
  if (error) return <div>Error! {error.tostring()}</div>;

  return (
    <InfiniteScroll
      loadMore={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={<div>Loading ...</div>}
    >
      {data?.pages.map((page) =>
        page.results.map((person) => (
          <Person
            key={person.name}
            name={person.name}
            hairColor={person.hair_color}
            eyeColor={person.eye_color}
          />
        ))
      )}
    </InfiniteScroll>
  );
}
