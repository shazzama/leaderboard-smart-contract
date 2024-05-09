'use client';
import React, { useState, useEffect } from 'react';

import axios from 'axios';

const Spinner = () => {
  return (
    <div role="status">
      <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
      </svg>
      <span class="sr-only">Loading...</span>
    </div>
  )
}

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [scores, setScores] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [txHash, setTxnHash]  = useState('');

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
    setSubmitting(true);

    axios.post('http://localhost:5000/api/update_leaderboard', {data: {game_name: "2048", score: score, "user_identifier": uuid }}).then((response) => { 
      console.log(response.data);
      setTxnHash(response.data);

      scores.array.forEach(data => {
        if (data.uuid == uuid){
          data.score = score
        }
      });
      setSubmitting(false);
    })
    .catch((error) => {
      console.log(error);
    });
  };

  const mintNft = async () => {
      axios.post('http://localhost:5000/api/mint_nft', {data: {prompt: "2024 winner"}}).then((response) => {
        console.log(response.data);
        alert(response.data)
      })    .catch((error) => {
        console.log(error);
      });
  }

  

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-center">Leaderboard</h1>
        <br/>
        <div className="flex space-x-4">
          <button onClick={addScore} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" style={{ marginLeft: '10px' }}>
            Update Score
          </button>
          <button onClick={mintNft} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" style={{ marginLeft: '10px' }}>
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
                {
                  submitting ? <Spinner /> :
                  <>
                    <button onClick={handleScoreSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      Submit
                    </button>
                    <button onClick={() => setShowPopup(false)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      Close
                    </button>
                  </>
                }
                {
                  txHash &&
                  <>
                    <a href={`https://sepolia.basescan.org/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">View on Basescan</a>
                    <button onClick={() => setShowPopup(false)} type="button" class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Close</button>
                  </>
                }
              </div>
          </div>
        </div>
      )}
    </main>
  );
}
