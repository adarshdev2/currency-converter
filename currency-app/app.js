const { createApp } = Vue;

createApp({
  data() {
    return {
      apiKey: "1SMxQumaAcC996SUXGsnIBPW44t2RR82",

      amount: 1,
      fromCurrency: "USD",
      toCurrency: "INR",
      result: null,

      search: "",
      rates: {}
    };
  },

  computed: {
    currencyCodes() {
      return Object.keys(this.rates);
    },

    filteredRates() {
      return Object.fromEntries(
        Object.entries(this.rates).filter(([code, rate]) =>
          code.toLowerCase().includes(this.search.toLowerCase()) ||
          rate.toString().includes(this.search)
        )
      );
    }
  },

  methods: {
    async loadRates() {
      try {
        const res = await fetch(
          `https://api.currencybeacon.com/v1/latest?api_key=${this.apiKey}`
        );

        const data = await res.json();

        if (!data || !data.rates) throw "API failed";

        this.rates = data.rates;
      } catch (e) {
        console.warn("Using fallback rates");

        // ✅ FALLBACK DATA (NEVER BLANK)
        this.rates = {
          USD: 1,
          INR: 83.2,
          AUD: 1.9,
          EUR: 0.92,
          GBP: 0.79,
          JPY: 158.3,
          CAD: 1.35,
          SGD: 1.34
        };
      }
    },

    convert() {
      if (!this.rates[this.fromCurrency] || !this.rates[this.toCurrency]) {
        this.result = "N/A";
        return;
      }

      const usd = this.amount / this.rates[this.fromCurrency];
      this.result = (usd * this.rates[this.toCurrency]).toFixed(2);
    }
  },

  mounted() {
    this.loadRates();
    this.convert();
  }
}).mount("#app");
