import { useContext } from "react";
import { ScrapeContext } from "./ScrapeContext";

export default function Data() {
  const scrapeData = useContext(ScrapeContext);
  console.log(scrapeData);

  return (
    <div>
      <ul>
        {scrapeData.map((story) => {
          return <li key={story.id}>{story.title}</li>;
        })}
      </ul>
    </div>
  );
}
