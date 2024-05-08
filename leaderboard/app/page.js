'use client';
import React, { useState } from 'react';

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);

  const addScore = async () => {
    // Logic to add score
    setShowPopup(true);
  }

  const [uuid, setUuid] = useState('');
  const [score, setScore] = useState(0);

  const handleScoreChange = (event) => {
    setScore(event.target.value);
  };

  const handleUuidChange = (event) => {
    setUuid(event.target.value);
  }; 

  const handleScoreSubmit = async () => {
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
              <tr>
                <td className="px-4 py-2">1</td>
                <td className="px-4 py-2">John</td>
                <td className="px-4 py-2">100</td>
              </tr>
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
