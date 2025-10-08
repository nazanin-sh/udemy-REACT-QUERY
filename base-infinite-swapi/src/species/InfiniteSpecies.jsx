import InfiniteScroll from "react-infinite-scroller";
import { Species } from "./Species";
import { useInfiniteQuery } from "@tanstack/react-query";

const initialUrl = "https://swapi.dev/api/species/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["swapi-species"],
    queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    getNextPageParam: (lastPage) => lastPage.next || undefined,
  });

  return (
    <InfiniteScroll
      loadMore={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={<div>Loading ...</div>}
    >
      {data?.pages.map((page) =>
        page.results.map((person) => (
          <Species
            key={person.name}
            name={person.name}
            averageLifespan={person.average_life_span}
            language={person.language}
          />
        ))
      )}
    </InfiniteScroll>
  );
}
