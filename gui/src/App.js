import React, { useState, useEffect } from "react";

import "./App.css";

const terminals = [
  {
    name: "Linux Terminal",
    workflow: "web-linux.yml",
  },
  {
    name: "Mac Terminal",
    workflow: "web-mac.yml",
  },
  {
    name: "Linux X Desktop",
    workflow: "web-xvfb.yml",
  },
  {
    name: "Mac X Desktop (work in progress)",
    workflow: "web-xvfb-mac.yml",
  },
];

const baseurl = "https://remote-terminal-appserver-3khoexoznq-uw.a.run.app";
function FetchDataComponent({ terminal }) {
  const [response_id, setResponse_id] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${baseurl}/launch?workflow=${terminal.workflow}`)
      .then((response) => response.json())
      .then((data) => {
        const response_id = data.response_id;
        console.log(response_id);
        setResponse_id(response_id);
      });
  }, [terminal.workflow]);

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
    return <div>Loading... {terminal.name}</div>;
  }

  if (error) {
    return (
      <div>
        {terminal.name} Error: {error.message}
      </div>
    );
  }

  return (
    <div>
      <div>{terminal.name}</div>
      {data.data !== null && (
        <div>
          <a className="App-link" href={data.data}>
            {data.data}
          </a>
          <div>Type "q" to if you see a black screen</div>
        </div>
      )}
      {/* {data.data !== null && window.location.replace(data.data)} */}
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
  const [selectedTerminal, setSelectedTerminal] = useState(null);
  return (
    <div className="App">
      <header className="App-header">
        {!selectedTerminal &&
          terminals.map((terminal) => (
            <div key={terminal.name}>
              <button onClick={() => setSelectedTerminal(terminal)}>
                {terminal.name}
              </button>
            </div>
          ))}
        {selectedTerminal && (
          <div>
            <div>{selectedTerminal.name} launching (takes about 1 minute)</div>
            <TimeSinceLoaded />
            <FetchDataComponent terminal={selectedTerminal} />
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
