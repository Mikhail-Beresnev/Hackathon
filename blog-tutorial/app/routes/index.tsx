import { Link } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";

// https://dev.to/zachtylr21/building-a-simple-search-ui-with-remix-57da
// https://remix.run/docs/en/v1/tutorials/blog

const api_url = "https://api.gsa.gov/technology/digital-registry/v1/";
const api_key = "p4mWC4HMGpxqBfcQJdYMIAPDZbBjMb47j5rjTz6g";
let fields = ["agencies", "mobile_apps", "social_media"];
let option = 0;

// Make a fetch request to the API based on the term and field searched
export async function fetch_data(term: String, field: String) {
  // Currently only works for agiencies, but system is set up for future work to check mobile apps social media accounts
  const res = await fetch(api_url + fields[option] + "?q=" + term + "&API_KEY=" + api_key);
  let json_res = await res.json();
  return json_res;
}

export const loader: LoaderFunction = async ({
  request,
}) => {
  // Take what is in the search bar and add it to the url as a route
  const url = new URL(request.url);
  // Take the the item in the url to get the query
  const query = url.searchParams.get("query");
  // Make the search request
  let response = await search_request(request, query, fields[0]);
  // Clean the response down to results
  let results = await clean(response);
  // results = array
  return json(results);
};

// HTML for the search bar and the resulting cards
export function search_bar(query: any) {
  return (
    <div>
      <form className="outline outline-black outline-1">
        <input className="w-full" type="text" name="query" placeholder="Search Government Agencies..." />
      </form>
      <ul>
        {display_cards(query)}
      </ul>
    </div>
  );
}

// Take a search, process it
export async function search_request(request: Request, query: String | null, fields: string) {
  // check if the query is null
  if (!query) {
    return <div></div>;
  }
  const data = await fetch_data(query, fields);
  return data;
}

// Get just the results from the data if there are any
export async function clean(data: any) {
  if (data.results === undefined) {
    return null;
  }
  return data.results;
}

// Process json data down into cards
export function display_cards(query: any) {
  // If there are no cards, display nothing
  if (query.length == 0) {
    return (
      <li key='0'>
        <div className="max-w rounded overflow-hidden shadow-lg">
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2"></div>
            <p className="text-gray-700 text-base">  
            </p>
          </div>
        </div>
      </li>
    );
  }
  // Turn the query info into cards
  return (
    query.map((v: any) => (
      <li key={Math.random()}>
        <div className="max-w rounded overflow-hidden shadow-lg">
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">{v.name}</div>
            <p className="text-gray-700 text-base">
              {v.info_url}
            </p>
          </div>
        </div>
      </li>
    ))
  );
}

// Main HTML
export default function Index() {
  const query = useLoaderData();
  console.log(query);
  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
            <div className="lg:pb-18 relative px-4 pt-16 pb-8 sm:px-6 sm:pt-24 sm:pb-14 lg:px-8 lg:pt-32">
              <h1 className="text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
                <span className="block text-black-500 drop-shadow-md">
                  Gov Authentication
                </span>
              </h1>
              <div className="mx-auto mt-16 max-w-7xl text-center">
                {search_bar(query)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
