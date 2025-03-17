const express = require('express');
const yahooFinance = require('yahoo-finance2').default;
const app = express();
const port = 3000;

// // Set EJS as the templating engine
// app.set('view engine', 'ejs');

// // Serve static files (CSS, JS, etc.)
// app.use(express.static('public'));


// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));  // Ensure Vercel finds the views folder

// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, "public"))); 

// List of Nifty 50 stock symbols (with .NS suffix for Yahoo Finance)
const nifty50Symbols = [
    'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'HINDUNILVR.NS',
    'ICICIBANK.NS', 'KOTAKBANK.NS', 'HDFCBANK.NS', 'SBIN.NS', 'BHARTIARTL.NS',
    'LT.NS', 'BAJFINANCE.NS', 'ASIANPAINT.NS', 'HCLTECH.NS', 'AXISBANK.NS',
    'MARUTI.NS', 'TITAN.NS', 'ULTRACEMCO.NS', 'SUNPHARMA.NS', 'NTPC.NS',
    'ONGC.NS', 'NESTLEIND.NS', 'POWERGRID.NS', 'M&M.NS', 'BAJAJ-AUTO.NS',
    'ADANIPORTS.NS', 'WIPRO.NS', 'COALINDIA.NS', 'JSWSTEEL.NS', 'TECHM.NS',
    'SHREECEM.NS', 'GRASIM.NS', 'TATASTEEL.NS', 'IOC.NS', 'DRREDDY.NS',
    'BRITANNIA.NS', 'EICHERMOT.NS', 'INDUSINDBK.NS', 'CIPLA.NS', 'UPL.NS',
    'HEROMOTOCO.NS', 'DIVISLAB.NS', 'BPCL.NS', 'GAIL.NS', 'HDFCLIFE.NS',
    'SBILIFE.NS', 'BAJAJFINSV.NS', 'TATAMOTORS.NS', 'VEDL.NS', 'HINDALCO.NS'
];

// Route to fetch and display Nifty 50 stock data
app.get('/', async (req, res) => {
    try {
        // Fetch stock data for each Nifty 50 symbol
        const stockData = await Promise.all(
            nifty50Symbols.map(async (symbol) => {
                const result = await yahooFinance.quoteSummary(symbol, { modules: ['price'] });
                return {
                    symbol: result.price.symbol.replace('.NS', ''), // Remove .NS suffix
                    name: result.price.shortName,
                    price: result.price.regularMarketPrice,
                    change: result.price.regularMarketChange,
                    changePercent: result.price.regularMarketChangePercent * 100, // Multiply by 100 for percentage
                };
            })
        );

        // Render the EJS template with the stock data
        res.render('index', { stocks: stockData });
    } catch (error) {
        console.error('Error fetching stock data:', error);
        res.status(500).send('Error fetching stock data');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});