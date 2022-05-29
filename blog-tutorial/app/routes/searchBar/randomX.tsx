// https://dev.to/zachtylr21/building-a-simple-search-ui-with-remix-57da
// https://remix.run/docs/en/v1/tutorials/blog

import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";

const api_url = "https://api.gsa.gov/technology/digital-registry/v1/";
const api_key = "p4mWC4HMGpxqBfcQJdYMIAPDZbBjMb47j5rjTz6g";
let fields = ["agencies"];
let search = "cia";

export async function action() {
    const res = await fetch(api_url + fields[0] + "?q=" + search + "&API_KEY=" + api_key);
    console.log(res);
    return json(await res.json());
  }

export const loader: LoaderFunction = async ({
    request,
  }) => {
    const url = new URL(request.url);
    console.log(url);
    const query = url.searchParams.get("query");
    return json(await process_search(query));
};


// Main search bar card
export function searchBar() {
    console.log("tst");
    const posts= useLoaderData();
    console.log(posts);
    return (
        <form className="outline outline-black outline-1">
            <input className="w-full" type="text" name="query" placeholder="Search Government Agencies..." />
            <p>test</p>
        </form>
    );
} 

// taking a search, process it
export async function process_search(null_query: String | null) {
    console.log("testing");
    console.log(!null_query);

    // check if the query is null
    if (typeof null_query == null) {
        return;
    }
    let query = !null_query; // to not deal with null everytime
    return;
    const data = useLoaderData();
    return (
      <ul>
        {data.map((object: any) => (
          <li key={object.results.id}>
            <p>{object.metadata}</p>
          </li>
        ))}
      </ul>
    );
    
}

  
  