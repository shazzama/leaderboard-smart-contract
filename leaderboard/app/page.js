'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [scores, setScores] = useState([]);

  const addScore = async () => {
    // Logic to add score
    setShowPopup(true);
  }
  useEffect(() => {
    // Retrieve scores
    axios.get('http://localhost:5000/api/highscore', {
      params: {
        game_name: "2048",
      }
    }).then((response) => {
      console.log(response.data);
      var dataWithRank = [];
      for (var i=0; i<response.data.length; i++) {
        dataWithRank.push({rank:i+1, uuid:response.data[i]["uuid"], score:response.data[i]["score"] })
      }
      setScores(dataWithRank);
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);

  const [uuid, setUuid] = useState('');
  const [score, setScore] = useState(0);

  const handleScoreChange = (event) => {
    setScore(event.target.value);
  };

  const handleUuidChange = (event) => {
    setUuid(event.target.value);
  }; 

  const handleScoreSubmit = async () => {
    // # curl -X POST -H "Content-Type: application/json" -d '{"game_name": "tetris", "score": "500", "user_identifier": "sam"}' http://localhost:5000/api/update_leaderboard
    axios.post('http://localhost:5000/api/update_leaderboard', {data: {game_name: "2048", score: score, "user_identifier": uuid }}).then((response) => { 
      console.log(response.data);

      scores.array.forEach(data => {
        if (data.uuid == uuid){
          data.score = score
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });

    // Logic to submit score
    setShowPopup(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-center">Leaderboard</h1>
        <br/>
        <div className="flex space-x-4">
          <button onClick={addScore} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" style={{ marginLeft: '10px' }}>
            Update Score
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" style={{ marginLeft: '10px' }}>
            Mint NFT
          </button>
        </div>
        <div>
          <table className="mt-8">
            <thead>
              <tr>
                <th className="px-4 py-2">Rank</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {
                scores.map((score) => {
                  return (
                    <tr key={score.uuid}>
                      <td className="px-4 py-2">{score.rank}</td>
                      <td className="px-4 py-2">{score.uuid}</td>
                      <td className="px-4 py-2">{score.score}</td>
                    </tr>
                  );
                
                })
              }
            </tbody>
          </table>
        </div>
      </div>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col items-center space-y-4 p-8 rounded border-4 border-gray-200">
              <h2 className="text-2xl font-bold mb-4">Update Score</h2>
              <input value={uuid} onChange={handleUuidChange} className="border border-gray-300 rounded-md px-4 py-2 text-black" placeholder="UUID" />
              <input value={score} onChange={handleScoreChange} className="border border-gray-300 rounded-md px-4 py-2 text-black" placeholder="Enter score" />
              <div className='flex space-x-4'>
                <button onClick={handleScoreSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Submit
                </button>
                <button onClick={() => setShowPopup(false)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Close
                </button>
              </div>
          </div>
        </div>
      )}
    </main>
  );
}
