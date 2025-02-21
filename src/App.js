import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [isValidJson, setIsValidJson] = useState(true);
  const [dropdownOptions, setDropdownOptions] = useState({
    alphabets: false,
    numbers: false,
    highestAlphabet: false,
  });
  const [apiResponse, setApiResponse] = useState(null);
  const [error, setError] = useState('');

  const validateJson = (input) => {
    try {
      JSON.parse(input);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleJsonInputChange = (e) => {
    setJsonInput(e.target.value);
    setIsValidJson(true);
    setError('');
  };

  const handleSubmit = async () => {
    if (!validateJson(jsonInput)) {
      setIsValidJson(false);
      setError('Invalid JSON format. Please check your input.');
      return;
    }

    try {
      const parsedJson = JSON.parse(jsonInput);
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/bfhl`, parsedJson);
      setApiResponse(response.data);
    } catch (err) {
      setError('Failed to fetch data from the API.');
      console.error(err);
    }
  };

  const handleDropdownChange = (option) => {
    setDropdownOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const renderResponse = () => {
    if (!apiResponse) return null;

    let selectedData = apiResponse;

    if (dropdownOptions.alphabets || dropdownOptions.numbers || dropdownOptions.highestAlphabet) {
      selectedData = [];
      if (dropdownOptions.alphabets) {
        selectedData.push(...apiResponse.alphabets);
      }
      if (dropdownOptions.numbers) {
        selectedData.push(...apiResponse.numbers);
      }
      if (dropdownOptions.highestAlphabet) {
        selectedData.push(apiResponse.highest_alphabet);
      }
    }
    

    return (
      <div className="mt-4 p-4 bg-gray-100 rounded w-4/5">
        <h2 className="text-lg font-bold">Response:</h2>
        <pre className="bg-white p-2 rounded border border-gray-300 overflow-auto">
          {JSON.stringify(selectedData, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">JSON Processor</h1>
      <textarea
        rows="4"
        cols="50"
        className="w-full max-w-lg p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter JSON"
        value={jsonInput}
        onChange={handleJsonInputChange}
      ></textarea>
      {!isValidJson && <p className="text-red-500 mt-2">{error}</p>}
      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Submit
      </button>

      {apiResponse && (
        <div className="mt-6">
          <div className="flex flex-col space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={dropdownOptions.alphabets}
                onChange={() => handleDropdownChange('alphabets')}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span>Alphabets</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={dropdownOptions.numbers}
                onChange={() => handleDropdownChange('numbers')}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span>Numbers</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={dropdownOptions.highestAlphabet}
                onChange={() => handleDropdownChange('highestAlphabet')}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span>Highest Alphabet</span>
            </label>
          </div>
        </div>
      )}

      {renderResponse()}
    </div>
  );
}

export default App;
