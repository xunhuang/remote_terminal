import React, { useState, useEffect } from "react";

import "./App.css";

const baseurl = "https://remote-terminal-appserver-3khoexoznq-uw.a.run.app";
function FetchDataComponent() {
  const [response_id, setResponse_id] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${baseurl}/launch?workflow=web-linux.yml`)
      .then((response) => response.json())
      .then((data) => {
        const response_id = data.response_id;
        console.log(response_id);
        setResponse_id(response_id);
      });
  }, []);

  useEffect(() => {
    if (!response_id) {
      return;
    }
    const fetchData = () => {
      console.log("fetching data");
      const url = `${baseurl}/get?key=${response_id}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setData(data);
          if (data.data !== null) {
            clearInterval(intervalId);
          }
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    };

    const intervalId = setInterval(fetchData, 5000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [response_id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <ul>
        {data.data !== null && (
          <div>
            <a className="App-link" href={data.data}>
              {data.data}
            </a>
            <div>Type "q" to if you see a black screen</div>
          </div>
        )}
        {/* {data.data !== null && window.location.replace(data.data)} */}
      </ul>
    </div>
  );
}

const TimeSinceLoaded = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return <div>Time since: {seconds} seconds</div>;
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>Desktop launching (takes about 1 minute)</div>
        <TimeSinceLoaded />

        <div>
          <FetchDataComponent />
        </div>
      </header>
    </div>
  );
}

export default App;
