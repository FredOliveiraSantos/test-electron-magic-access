import { useState } from 'react';
import './index.css';
import Modal from 'react-modal';

export default function App() {
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [cardSearchData, setCardSearchData] = useState<ReadonlyArray<any>>();

  const handleInputChange = (e: any) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = () => {
    setIsLoading(true);
    // Implement your search logic here
    fetch(`https://api.magicthegathering.io/v1/cards?name=${searchValue}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCardSearchData(data?.cards?.filter((card) => card.imageUrl));
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const closeModal = () => {
    setCardSearchData(undefined);
  };
  return (
    <div className="magic-card-back">
      <div className="search-container">
        <span className="search-icon">&#128269;</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search MTG Card..."
          value={searchValue}
          onChange={handleInputChange}
        />
        <button
          className={`bg-green-500 mt-2 text-white px-4 py-2 rounded-md transition duration-300 ${
            isLoading || !searchValue?.length
              ? 'cursor-not-allowed'
              : 'hover:bg-green-60'
          }`}
          onClick={handleSearch}
          disabled={isLoading || !searchValue?.length}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
      <Modal
        isOpen={!!cardSearchData}
        onRequestClose={closeModal}
        contentLabel="Card List Modal"
      >
        <div className="modal-content">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold mb-4">Found Cards:</h2>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-green-600"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
          <ul className="list-disc pl-4">
            {cardSearchData?.map((card) => (
              <div key={card.id} className="mb-2">
                <img
                  src={card.imageUrl}
                  alt={card.name}
                  className="w-full h-auto max-w-[360px] max-h-[500px]"
                />
              </div>
            ))}
          </ul>
        </div>
      </Modal>
    </div>
  );
}
