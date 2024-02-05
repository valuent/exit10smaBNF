const axios = require("axios");
const jsonfile = require("jsonfile");
const BNFfile = "D:/bnfclose.json";
const NFfile = "D:/niftyclose.json";

const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static("public"));
var ltpNifty;
var ltpBanknifty;

var getLtpNifty = () => {
  axios
    .get(
      "http://localhost:21000/CombinedPremium?OptionPortfolioName=NIFTYFUTTEST"
    )
    .then(function (response) {
      ltpNifty = parseInt(response.data.response);
    });
};

var getLtpBankNifty = () => {
  axios
    .get(
      "http://localhost:21000/CombinedPremium?OptionPortfolioName=BNFFUTTEST"
    )
    .then(function (response) {
      ltpBanknifty = parseInt(response.data.response);
    });
};

setInterval(getLtpNifty, 10);
setInterval(getLtpBankNifty, 10);

var hours;
var mins;
var secs;
var milisec;
var dateEX;
var getDate = () => {
  clock = new Date();
  hours = clock.getHours();
  mins = clock.getMinutes();
  secs = clock.getSeconds();
  milisec = clock.getMilliseconds();
  dateEX = hours + ":" + mins + ":" + secs + ":" + milisec;
};
setInterval(getDate, 10);

var niftyClose;
var bnfClose;
var closeMinute;
var openMinute;
var nextCandleMin;
var niftyData = {};
niftyData.table = [];

var existingData = jsonfile.readFileSync(NFfile);
niftyData = existingData;

var bnfData = {};
bnfData.table = [];

var existingData = jsonfile.readFileSync(BNFfile);
bnfData = existingData;

var dataToCsv = () => {
  // Main IF loop for open Data
  if (
    parseInt(mins) % 5 == 0 &&
    parseInt(secs) == 0 &&
    parseInt(hours) >= 9 &&
    parseInt(milisec) < 100
  ) {
    openMinute = hours + ":" + mins + ":" + secs;
    closeMinute = parseInt(mins + 4);
    // Check for 60 mins
    if (closeMinute > 59) {
      closeMinute = 0;
      restNum = closeMinute % 60;
      closeMinute = closeMinute + restNum;
    }

    console.log(closeMinute);
    // Set next candle open
    if (!nextCandleMin) {
      nextCandleMin = parseInt(mins + 4);
      // Check for 60 mins
      if (nextCandleMin > 59) {
        nextCandleMin = 0;
        restNum = nextCandleMin % 60;
        nextCandleMin = nextCandleMin + restNum;
      }
    }
  }

  if (
    parseFloat(mins) == parseInt(nextCandleMin) &&
    parseInt(mins) == closeMinute &&
    parseInt(secs) > 58 &&
    parseInt(milisec) >= 800
  ) {
    var existingData = jsonfile.readFileSync(NFfile);
    niftyData = existingData;

    var existingData = jsonfile.readFileSync(BNFfile);
    bnfData = existingData;

    niftyClose = parseInt(ltpNifty);
    bnfClose = parseInt(ltpBanknifty);

    var obj = {
      time: openMinute,
      close: niftyClose,
    };
    niftyData.table.push(obj);

    jsonfile.writeFileSync(NFfile, niftyData, {
      spaces: 2,
      EOL: "\r\n",
    });

    var obj = {
      time: openMinute,
      close: bnfClose,
    };
    bnfData.table.push(obj);

    jsonfile.writeFileSync(BNFfile, bnfData, {
      spaces: 2,
      EOL: "\r\n",
    });

    nextCandleMin = parseInt(mins + 5);
    if (nextCandleMin > 59) {
      nextCandleMin = 0;
      restNum = nextCandleMin % 60;
      nextCandleMin = nextCandleMin + restNum;
    }
    // console.log(nextCandleMin);
  }
  // console.log(nextCandleMin);
};

setInterval(dataToCsv, 10);

var jsonDataNifty;
var sumOfNineNifty;
var dataForAverageNifty = () => {
  sumOfNineNifty = 0;
  jsonDataNifty = jsonfile.readFileSync(NFfile);
  lastNine = jsonDataNifty.table.slice(1).slice(-9);

  for (var i = 0; i < 9; i++) {
    // console.log(lastNine[i].close);
    sumOfNineNifty = sumOfNineNifty + parseInt(lastNine[i].close);
  }
  // console.log(sumOfNineNifty);
};

setInterval(dataForAverageNifty, 100);

var smaOf10Nifty = 0;
var Sma10CalcNifty = () => {
  var sum = 0;
  var currentClose = parseInt(ltpNifty);
  sum = sumOfNineNifty + currentClose;
  smaOf10Nifty = sum / 10;
  // console.log(smaOf10Nifty);
};

setInterval(Sma10CalcNifty, 100);

var jsonDatabnf;
var sumOfNinebnf;
var dataForAverageBnf = () => {
  sumOfNinebnf = 0;
  jsonDatabnf = jsonfile.readFileSync(BNFfile);
  lastNine = jsonDatabnf.table.slice(1).slice(-9);

  for (var i = 0; i < 9; i++) {
    // console.log(lastNine[i].close);
    sumOfNinebnf = sumOfNinebnf + parseInt(lastNine[i].close);
  }
  // console.log(sumOfNinebnf);
};

setInterval(dataForAverageBnf, 100);

var smaOf10bnf = 0;
var Sma10CalcBNF = () => {
  var sum = 0;
  var currentClose = parseInt(ltpBanknifty);
  sum = sumOfNinebnf + currentClose;
  smaOf10bnf = sum / 10;
  // console.log(smaOf10bnf);
};

setInterval(Sma10CalcBNF, 100);

//
niftyQty = 8;
var niftySetQty8 = () => {
  niftyQty = 8;
};
var niftySetQty4 = () => {
  niftyQty = 4;
};
var niftySetQty2 = () => {
  niftyQty = 2;
};

bnfQty = 8;
var bnfSetQty8 = () => {
  bnfQty = 8;
};
var bnfSetQty4 = () => {
  bnfQty = 4;
};
var bnfSetQty2 = () => {
  bnfQty = 2;
};

// BNf QTY

//
var niftyPosFlag = 0;
var niftyLongFlag = 0;
var niftyShortFlag = 0;
var niftyEntryPrice = 0;
var niftyLong = () => {
  axios
    .get(
      `http://localhost:21000/PlaceMultiLegOrderAdv?OptionPortfolioName=NFLONG&StrategyTag=BNF&Symbol=NIFTY&Product=MIS&Lots=${niftyQty}`
    )
    .then(function (response) {
      if (response.data.error) {
        console.log(response.data.error);
      } else {
        niftyEntryPrice = parseInt(ltpNifty);
        niftyPosFlag = parseInt(1);
        niftyLongFlag = parseInt(1);
        console.log(niftyEntryPrice, niftyPosFlag, niftyLongFlag);
      }
    });
};

var niftyLongExit = () => {
  axios
    .get(
      `http://localhost:21000/ExitMultiLegOrderByDetails?OptionPortfolioName=NFLONG&StrategyTag=BNF&Symbol=NIFTY&Product=MIS&Lots=${niftyQty}`
    )
    .then(function (response) {
      if (response.data.error) {
        console.log(response.data.error);
      } else {
        niftyEntryPrice = parseInt(0);
        niftyPosFlag = parseInt(0);
        niftyLongFlag = parseInt(0);
        console.log(niftyEntryPrice, niftyPosFlag, niftyLongFlag);
      }
    });
};

var niftyShort = () => {
  axios
    .get(
      `http://localhost:21000/PlaceMultiLegOrderAdv?OptionPortfolioName=NFSHORT&StrategyTag=BNF&Symbol=NIFTY&Product=MIS&Lots=${niftyQty}`
    )
    .then(function (response) {
      if (response.data.error) {
        console.log(response.data.error);
      } else {
        niftyEntryPrice = parseInt(ltpNifty);
        niftyPosFlag = parseInt(1);
        niftyShortFlag = parseInt(1);
        console.log(niftyEntryPrice, niftyPosFlag, niftyShortFlag);
      }
    });
};

var niftyShortExit = () => {
  axios
    .get(
      `http://localhost:21000/ExitMultiLegOrderByDetails?OptionPortfolioName=NFSHORT&StrategyTag=BNF&Symbol=NIFTY&Product=MIS&Lots=${niftyQty}`
    )
    .then(function (response) {
      if (response.data.error) {
        console.log(response.data.error);
      } else {
        niftyEntryPrice = parseInt(0);
        niftyPosFlag = parseInt(0);
        niftyShortFlag = parseInt(0);
        console.log(niftyEntryPrice, niftyPosFlag, niftyShortFlag);
      }
    });
};

var niftyCheckShortSL = () => {
  if (niftyPosFlag == 1 && niftyShortFlag == 1) {
    if (
      parseInt(mins) == closeMinute &&
      parseInt(secs) > 58 &&
      parseInt(milisec) >= 500
    ) {
      if (smaOf10Nifty < ltpNifty && ltpNifty >= niftyEntryPrice) {
        niftyShortExit();
        console.log("SL exec");
      }
    }
  }
};

var niftyCheckLongSL = () => {
  if (niftyPosFlag == 1 && niftyLongFlag == 1) {
    if (
      parseInt(mins) == closeMinute &&
      parseInt(secs) > 58 &&
      parseInt(milisec) >= 500
    ) {
      if (smaOf10Nifty > ltpNifty && ltpNifty <= niftyEntryPrice) {
        niftyLongExit();
        console.log("SL exec");
      }
    }
  }
};

setInterval(niftyCheckShortSL, 100);
setInterval(niftyCheckLongSL, 100);

// BNF All funtion

var bnfPosFlag = 0;
var bnfLongFlag = 0;
var bnfShortFlag = 0;
var bnfEntryPrice = 0;
var bnfLong = () => {
  axios
    .get(
      `http://localhost:21000/PlaceMultiLegOrderAdv?OptionPortfolioName=BNLONG&StrategyTag=BNF&Symbol=BANKNIFTY&Product=MIS&Lots=${bnfQty}`
    )
    .then(function (response) {
      if (response.data.error) {
        console.log(response.data.error);
      } else {
        bnfEntryPrice = parseInt(ltpBanknifty);
        bnfPosFlag = parseInt(1);
        bnfLongFlag = parseInt(1);
        console.log(bnfEntryPrice, bnfPosFlag, bnfLongFlag);
      }
    });
};

var bnfLongExit = () => {
  axios
    .get(
      `http://localhost:21000/ExitMultiLegOrderByDetails?OptionPortfolioName=BNLONG&StrategyTag=BNF&Symbol=BANKNIFTY&Product=MIS&Lots=${bnfQty}`
    )
    .then(function (response) {
      if (response.data.error) {
        console.log(response.data.error);
      } else {
        bnfEntryPrice = parseInt(0);
        bnfPosFlag = parseInt(0);
        bnfLongFlag = parseInt(0);
        console.log(bnfEntryPrice, bnfPosFlag, bnfLongFlag);
      }
    });
};

var bnfShort = () => {
  axios
    .get(
      `http://localhost:21000/PlaceMultiLegOrderAdv?OptionPortfolioName=BNSHORT&StrategyTag=BNF&Symbol=BANKNIFTY&Product=MIS&Lots=${bnfQty}`
    )
    .then(function (response) {
      if (response.data.error) {
        console.log(response.data.error);
      } else {
        bnfEntryPrice = parseInt(ltpBanknifty);
        bnfPosFlag = parseInt(1);
        bnfShortFlag = parseInt(1);
        console.log(bnfEntryPrice, bnfPosFlag, bnfShortFlag);
      }
    });
};

var bnfShortExit = () => {
  axios
    .get(
      `http://localhost:21000/ExitMultiLegOrderByDetails?OptionPortfolioName=BNSHORT&StrategyTag=BNF&Symbol=BANKNIFTY&Product=MIS&Lots=${bnfQty}`
    )
    .then(function (response) {
      if (response.data.error) {
        console.log(response.data.error);
      } else {
        bnfEntryPrice = parseInt(0);
        bnfPosFlag = parseInt(0);
        bnfShortFlag = parseInt(0);
        console.log(bnfEntryPrice, bnfPosFlag, bnfShortFlag);
      }
    });
};

var bnfCheckShortSL = () => {
  if (bnfPosFlag == 1 && bnfShortFlag == 1) {
    if (
      parseInt(mins) == closeMinute &&
      parseInt(secs) > 58 &&
      parseInt(milisec) >= 500
    ) {
      if (smaOf10bnf < ltpBanknifty && ltpBanknifty >= bnfEntryPrice) {
        bnfShortExit();
        console.log("SL exec");
      }
    }
  }
};

var bnfCheckLongSL = () => {
  if (bnfPosFlag == 1 && bnfLongFlag == 1) {
    if (
      parseInt(mins) == closeMinute &&
      parseInt(secs) > 58 &&
      parseInt(milisec) >= 500
    ) {
      if (smaOf10bnf > ltpBanknifty && ltpBanknifty <= bnfEntryPrice) {
        bnfLongExit();
        console.log("SL exec");
      }
    }
  }
};

var niftyReset = () => {
  niftyEntryPrice = parseInt(0);
  niftyPosFlag = parseInt(0);
  niftyLongFlag = parseInt(0);
  niftyShortFlag = parseInt(0);
  console.log(niftyEntryPrice, niftyPosFlag, niftyShortFlag);
};

var bnfReset = () => {
  bnfEntryPrice = parseInt(0);
  bnfPosFlag = parseInt(0);
  bnfLongFlag = parseInt(0);
  bnfShortFlag = parseInt(0);
  console.log(bnfEntryPrice, bnfPosFlag, bnfLongFlag);
};

setInterval(bnfCheckShortSL, 100);
setInterval(bnfCheckLongSL, 100);

var mtmLive = 0;
var getMtm = () => {
  mtmLive = axios
    .get("http://localhost:21000/MTM?UserID=KX9424")
    .then(function (response) {
      mtmLive = response.data.response;
    });
};

setInterval(getMtm, 250);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/terminal.html");
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Emits data every second
  setInterval(() => {
    socket.emit("U_Sma", dateEX);
    socket.emit("U_PriceNifty", ltpNifty);
    socket.emit("U_PriceBnf", ltpBanknifty);
    socket.emit("U_SmaNifty", smaOf10Nifty);
    socket.emit("U_SmaBnf", smaOf10bnf);
    socket.emit("U_EntryPriceNifty", niftyEntryPrice);
    socket.emit("U_EntryPriceBnf", bnfEntryPrice);
    socket.emit("U_PosStatusNifty", niftyPosFlag);
    socket.emit("U_PosStatusBnf", bnfPosFlag);
    socket.emit("U_LongFlagNifty", niftyLongFlag);
    socket.emit("U_LongFlagBnf", bnfLongFlag);
    socket.emit("U_ShortFlagNifty", niftyShortFlag);
    socket.emit("U_ShortFlagBnf", bnfShortFlag);
    socket.emit("U_ClosingMin", closeMinute);
    socket.emit("U_LiveMtm", mtmLive);
    socket.emit("U_NiftyQty", niftyQty);
    socket.emit("U_BnfQty", bnfQty);
  }, 20);

  socket.on("NiftyQtySet8", () => {
    console.log("Nifty Qty = 8 Lots");
    // Call your function here
    niftySetQty8();
  });
  socket.on("NiftyQtySet4", () => {
    console.log("Nifty Qty = 4 Lots");
    // Call your function here
    niftySetQty4();
  });
  socket.on("NiftyQtySet2", () => {
    console.log("Nifty Qty = 2 Lots");
    // Call your function here
    niftySetQty2();
  });

  // BNF qty set

  socket.on("BnfQtySet8", () => {
    console.log("Bank Nifty Qty = 8 Lots");
    // Call your function here
    bnfSetQty8();
  });
  socket.on("BnfQtySet4", () => {
    console.log("Bank Nifty Qty = 4 Lots");
    // Call your function here
    bnfSetQty4();
  });
  socket.on("BnfQtySet2", () => {
    console.log("Bank Nifty Qty = 2 Lots");
    // Call your function here
    bnfSetQty2();
  });

  socket.on("NiftyLE", () => {
    console.log("Nifty Long Executed");
    // Call your function here
    niftyLong();
  });

  socket.on("NiftySE", () => {
    console.log("Nifty Short Executed");
    // Call your function here
    niftyShort();
  });

  socket.on("NiftyLX", () => {
    console.log("Nifty Long Exit Executed");
    // Call your function here
    niftyLongExit();
  });

  socket.on("NiftySX", () => {
    console.log("Nifty Short Exit Executed");
    // Call your function here
    niftyShortExit();
  });

  // BNF Calls

  socket.on("BnfLE", () => {
    console.log("Banknifty Long Executed");
    // Call your function here
    bnfLong();
  });

  socket.on("BnfSE", () => {
    console.log("Banknifty Short Executed");
    // Call your function here
    bnfShort();
  });

  socket.on("BnfLX", () => {
    console.log("Banknifty Long Exit Executed");
    // Call your function here
    bnfLongExit();
  });

  socket.on("BnfSX", () => {
    console.log("Banknifty Short Exit Executed");
    // Call your function here
    bnfShortExit();
  });

  socket.on("BnfReset", () => {
    console.log("Bnf Reset Executed");
    // Call your function here
    bnfReset();
  });
  socket.on("NiftyReset", () => {
    console.log("Nifty Reset Executed");
    // Call your function here
    niftyReset();
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 5050;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
