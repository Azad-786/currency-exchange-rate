import React, { useEffect, useState } from 'react';
import country_list from "./Data";
import 'bootstrap/dist/css/bootstrap.min.css';
import exchangeRateImage from "../assets/exchange-rate-image.png"


const Convertor = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFrom] = useState("USD");
  const [toCurrency, setTo] = useState("GBP");
  const [currency, setCurrency] = useState([]);
  const [converted, setConverted] = useState('');
  const [date, setDate] = useState('');
  const [historicalRate, setHistoricalRate] = useState('');
  const api_key = '786c3ef64a4b1053d8a183bf';

  useEffect(() => {
    if (Array.isArray(country_list)) {
      setCurrency(country_list);
    } else {
      console.error("country_list is not an array");
    }
  }, []);


  useEffect(() => {
    async function fetchConversion() {
      try {
        const result = await fetch(
          `https://v6.exchangerate-api.com/v6/${api_key}/latest/${fromCurrency}`
        );
        const data = await result.json();
        if (data.result === 'success') {
          setConverted(data.conversion_rates[toCurrency]);
        } else {
          console.error("Error fetching conversion rates:", data.error);
        }
      } catch (error) {
        console.error("Error fetching conversion rates:", error);
      }
    }
    fetchConversion();
  }, [fromCurrency, toCurrency]);
  useEffect(() => {
    async function fetchHistoricalRate() {
      if (date) {
        try {
          const formattedDate = new Date(date).toISOString().split('T')[0];
          const result = await fetch(
            `https://v6.exchangerate-api.com/v6/${api_key}/${formattedDate}?base=${fromCurrency}`
          );
          const data = await result.json();
          if (data.result === 'success') {
            setHistoricalRate(data.conversion_rates[toCurrency]);
          } else {
            console.error("Error fetching historical rates:", data.error);
          }
        } catch (error) {
          console.error("Error fetching historical rates:", error);
        }
      }
    }
    fetchHistoricalRate();
  }, [date, fromCurrency, toCurrency]);

  // Function to handle currency exchange
  function handleExchange() {
    if (date && historicalRate !== '') {
      const totalExchange = amount * historicalRate;
      setConverted(totalExchange.toFixed(2));
    } else {
      const totalExchange = amount * converted;
      setConverted(totalExchange.toFixed(2));
    }
  }


  return (
    
    <div class="container-fluid bg-darkgray">
    <div className='container mx-auto p-4'>
    <div className="heading">
    <h1 className="text-3xl font-bold underline mb-4">
        Currency Converter
      </h1>
    </div>
    <div className="row">
    <div className="leftSide col-lg-6">
      <img src={exchangeRateImage} alt="left-image"/>
    </div>
    <div className="rightSide col-lg-6 my-auto">
    

      <div className="wrapper  p-4 rounded-lg shadow-xl">
        <form className="space-y-4">
          <div className="amount">
            <p className="text-lg text-justify font-semibold mb-auto">Please Enter Your Amount</p>
            <input
              type='number'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder='1'
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="convert_box row flex items-center justify-between">
            <div className="form col-lg-6">
              <p className="text-lg text-justify font-semibold mb-auto"> Currency From</p>
              <div className="select_input flex items-center space-x-2">
                <select
                  value={fromCurrency}
                  onChange={(e) => setFrom(e.target.value)}
                  
                  className="p-2 border rounded w-100"
                >
                  {currency.map((cur, key) => (
                    <option key={key} value={cur}>
                      {cur}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="to col-lg-6">
              <p className="text-lg text-justify font-semibold mb-auto"> CurrencyTo</p>
              <div className="select_input flex items-center space-x-2">
                <select
                  value={toCurrency}
                  onChange={(e) => setTo(e.target.value)}
                  className="p-2 border rounded w-100"
                >
                  {currency.map((cur, key) => (
                    <option key={key} value={cur}>
                      {cur}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="date mb-4">
            <p className="text-lg text-justify font-semibold mb-auto">Select Date for Historical Rate</p>
            <input
              type='date'
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="result text-lg font-semibold">
            <p>{amount} {fromCurrency} = {converted} {toCurrency}</p>
            {date && historicalRate !== '' && (
              <p>On {date}, {amount} {fromCurrency} = {(amount * historicalRate).toFixed(2)} {toCurrency}</p>
            )}
          </div>

          <button
            type='button'
            onClick={handleExchange}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Get Exchange Rate
          </button>
        </form>
      </div>
    </div>
    </div>
    </div>
    </div>
  );
}

export default Convertor;
