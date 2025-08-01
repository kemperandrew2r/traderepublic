const portfolio = [
  { name: "NVIDIA", symbol: "NVDA", buyDate: "2020-06-10", buyPrice: 60, shares: 3 },
  { name: "Apple", symbol: "AAPL", buyDate: "2020-07-21", buyPrice: 90, shares: 15 },
  { name: "Google", symbol: "GOOGL", buyDate: "2021-01-15", buyPrice: 1400, shares: 2 },
  { name: "Tesla", symbol: "TSLA", buyDate: "2020-03-11", buyPrice: 90, shares: 7 },
  { name: "Bitcoin", symbol: "BTC/USD", buyDate: "2020-05-30", buyPrice: 8500, shares: 1.2 }
];

const apiKey = "d13f0c2f60b14e8891b46f1eb5afbb4c";
const table = document.getElementById("portfolio-table");

async function loadPortfolio() {
  try {
    for (const asset of portfolio) {
      const url = `https://api.twelvedata.com/price?symbol=${asset.symbol}&apikey=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!data || !data.price) continue;

      const currentPrice = parseFloat(data.price);
      const totalValue = currentPrice * asset.shares;
      const gain = totalValue - (asset.buyPrice * asset.shares);
      const percent = ((gain / (asset.buyPrice * asset.shares)) * 100).toFixed(1);

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${asset.name}</td>
        <td>${asset.buyDate}</td>
        <td>${asset.buyPrice.toLocaleString("de-DE")} €</td>
        <td>${currentPrice.toLocaleString("de-DE")} €</td>
        <td>${asset.shares}</td>
        <td>${totalValue.toLocaleString("de-DE")} €</td>
        <td class="${gain >= 0 ? 'gain' : 'loss'}">${gain.toLocaleString("de-DE")} € (${percent}%)</td>
      `;
      table.appendChild(row);
    }
  } catch (err) {
    console.error("Fehler beim Laden der Kurse:", err);
  }
}

loadPortfolio();

// === BTC CHART ===
async function loadBTCChart() {
  try {
    const res = await fetch(`https://api.twelvedata.com/time_series?symbol=BTC/USD&interval=1month&outputsize=12&apikey=${apiKey}`);
    const data = await res.json();

    const labels = data.values.map(p => p.datetime).reverse();
    const values = data.values.map(p => parseFloat(p.close)).reverse();

    const btcContainer = document.createElement("div");
    btcContainer.innerHTML = `<canvas id="btcChart" width="800" height="300"></canvas>`;
    document.body.appendChild(btcContainer);

    const ctx = document.getElementById("btcChart").getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "BTC Preisverlauf (live)",
          data: values,
          borderColor: "#f2a900",
          backgroundColor: "rgba(242, 169, 0, 0.2)",
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: "white" } }
        },
        scales: {
          x: { ticks: { color: "white" } },
          y: { ticks: { color: "white" } }
        }
      }
    });
  } catch (err) {
    console.error("Fehler beim Laden des BTC-Charts:", err);
  }
}

loadBTCChart();