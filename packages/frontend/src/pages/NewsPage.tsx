import React, { useState } from 'react';
import { NewsFeed } from '../components/News/NewsFeed';
import { FetchNewsOptions } from '../api/newsApi';

// Optionally, you can build NewsFilterControls for advanced filtering
// import { NewsFilterControls } from '../components/News/NewsFilterControls';

const NewsPage: React.FC = () => {
  // Basic filter state (expand as needed)
  const [options, setOptions] = useState<FetchNewsOptions>({});

  // Example: Uncomment and implement NewsFilterControls to allow users to filter news
  // const handleFilterChange = (opts: FetchNewsOptions) => setOptions(opts);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Market News & Sentiment</h1>
      {/* <NewsFilterControls options={options} onChange={handleFilterChange} /> */}
      <NewsFeed options={options} />
    </div>
  );
};

export default NewsPage;
