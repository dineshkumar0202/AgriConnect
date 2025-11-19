import React, { useEffect, useState } from "react";
import { useApp } from "../context.jsx";

const ExternalNews = () => {
  const { strings } = useApp();
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");

  // Using a free no-key API
  const API_URL = "https://newsdata.io/api/1/news?apikey=pub_15176b29195c3666c1d6f75b5417883a3fd9&q=agriculture&country=in&language=en";

  useEffect(() => {
    const loadNews = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();

        if (!data.results) {
          setError("Failed to load news.");
          return;
        }

        setArticles(data.results);
      } catch (err) {
        setError("Failed to load news.");
      }
    };

    loadNews();
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 space-y-4">
      <h2 className="text-xl font-semibold">{strings.externalNewsTitle}</h2>

      {error && (
        <p className="text-sm text-red-500 bg-red-100 px-3 py-2 rounded-xl">
          {error}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {articles.map((item, index) => (
          <div key={index} className="card p-3 space-y-2">
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-40 object-cover rounded-xl"
              />
            )}
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm text-slate-600 line-clamp-3">
              {item.description}
            </p>
            <p className="text-xs text-slate-400">{item.pubDate}</p>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                className="text-emerald-600 underline text-xs"
              >
                Read full article
              </a>
            )}
          </div>
        ))}
      </div>
    </main>
  );
};

export default ExternalNews;
