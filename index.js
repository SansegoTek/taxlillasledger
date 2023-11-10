const fs = require("fs");

const contractFunctions = {
  "0xbd3eaa6f": "createProfile",
  "0x095ea7b3": "approve",
  "0x68ce0b56": "startQuest",
  "0xc855dea3": "startQuest",
  "0x756fcd69": "completeMeditation",
  "0xf51333f5": "startQuestWithData",
  "0x6e278cf1": "stylist",
  "0x8a2da17b": "startQuest",
  "0xb0ea6a1b": "crack",
  "0xa22cb465": "setApprovalForAll",
  "0x1efedbe5": "sendHero",
  "0xbb5e613b": "petBridge",
  "0x7ff36ab5": "swapExactETHForTokens", //18. DONE
  "0x18cbafe5": "swapExactTokensForETH", // 12
  "0xa59f3e0c": "enter", // 246
  "0x67dfd4c9": "leave", // 58
  "0x598647f8": "bid", // 49  // Buying Heroes (bought 7, summoned 8)
  "0x528be0a9": "completeQuest", // 20802
  "0xfe90ff7d": "cancelQuest", // 22
  "0x4ea8a311": "summonCrystal", // 56
  "0x690e7c09": "open",
  "0x303e6aa4": "convertMultiple", // 8 ** LP **
  "0xf305d719": "addLiquidityETH", // 9. HAS VALUE  ** LP **
  "0x8dbdbe6d": "deposit", // 4  - ** LP **
  "0x5d444f91": "rechargeCrystal", // 120xa9059cbb
  "0x5eac6239": "claimRewards", // 568
  "0xfa863736": "startMeditation", // 740
  "0xe30d4440": "claimAirdrop", // 9
  "0xe8e33700": "addLiquidity", // 8
  "0x0ad58d2f": "withdraw", // 11
  "0x02751cec": "removeLiquidityETH", // ????
  "0xbaa2abde": "removeLiquidity", // 5
  "0x4a517a55": "swapAndRedeem", // 20
  "0x90d25074": "deposit", // 6
  "0x096c5e1a": "sellItem", // 34
  "0x9f37092a": "buyItem", // 2
  "0x38ed1739": "swapExactTokensForTokens", // 6
  "0x106f46e4": "consumeItem", // 1
  "0x4c7f588f": "petIncubation", // 11 // DFK GOLD contract, not sure what function though
  "0xad660825": "itemBridge", // 29 - Item Bridge: HAS VALUE
  "0xa9059cbb": "transfer",
  "0x": "nativeTransfer",
};

const tokenMap = {
  Ambertaffy: "NULL1",
  "Atonement Crystal Lesser": "NULL2",
  Bloater: "NULL3",
  "Blue Pet Egg": "NULL4",
  "Blue Stem": "NULL5",
  Darkweed: "NULL6",
  "DFK Gold": "NULL7",
  "Gaia's Tears": "NULL8",
  "Golden Egg": "NULL9",
  Goldvein: "NULL10",
  "Green Pet Egg": "NULL11",
  "Grey Pet Egg": "NULL12",
  "Health Vial": "NULL13",
  Ironscale: "NULL14",
  Jewel: "ID:108585",
  "Jewel LP Token ONE/Jewel": "NULL15",
  Lanterneye: "NULL16",
  "Mana Vial": "NULL17",
  Milkweed: "NULL18",
  ONE: "ID:3766",
  Ragweed: "NULL19",
  Redgill: "NULL20",
  Redleaf: "NULL21",
  Rockroot: "NULL22",
  Sailfish: "NULL23",
  Shimmerskin: "NULL24",
  "Shvas Rune": "NULL25",
  Silverfin: "NULL26",
  Spiderfruit: "NULL27",
  "Stamina Vial": "NULL28",
  SwiftThistle: "NULL29",
  xJewel: "ID:3431761",

  "NFT hero 32898": "NFT1",
  "NFT hero 30179": "NFT2",
  "NFT hero 24170": "NFT3",
  "NFT hero 30532": "NFT4",
  "NFT hero 36323": "NFT5",
  "NFT hero 38662": "NFT6",
  "NFT hero 44341": "NFT7",
};

const rawTxs = fs.readFileSync(`./data/txs-rcpt.json`);
const txs = JSON.parse(rawTxs);
const csv = [];
const csvFile = fs.readFileSync("./data/dfk-report.csv").toString();
const csvLines = csvFile.split("\n");
csvLines.shift();
for (const line of csvLines) {
  const fields = line.split(",");
  csv.push({
    timestamp: fields[0],
    sentAmt: fields[1],
    sentCur: fields[2],
    receivedAmt: fields[3],
    receivedCur: fields[4],
    feeAmt: fields[5],
    feeCur: fields[6],
    netWorthAmt: fields[7],
    netWorthCur: fields[8],
    label: fields[9],
    description: fields[10],
    txHash: fields[11],
  });
}

const getDifferences = () => {
  const csvTxHashes = [...new Set(csv.map((tx) => tx.txHash?.toLowerCase()))];
  const txsTxHashes = [...new Set(txs.map((tx) => tx.ethHash?.toLowerCase()))];
  console.log(csvTxHashes.length);
  console.log(txsTxHashes.length);

  // in csv, not in txs
  var difference1 = csvTxHashes.filter((x) => !txsTxHashes.includes(x));
  console.log(difference1);

  // in txs, not in csv
  var difference2 = txsTxHashes.filter((x) => !csvTxHashes.includes(x));
  console.log(difference2);
};

const getSelectorOfMissingTxs = async () => {
  const csvTxHashes = [...new Set(csv.map((tx) => tx.txHash?.toLowerCase()))];
  const txsTxHashes = [...new Set(txs.map((tx) => tx.ethHash?.toLowerCase()))];

  var difference2 = txsTxHashes.filter((x) => !csvTxHashes.includes(x));

  const missing = txs.filter((tx) => difference2.includes(tx.ethHash));
  const missingSelector = missing.map((m) => m.input.substr(0, 10));
  const distinctMissingSelector = [...new Set(missingSelector)];
  console.log(distinctMissingSelector);
};

const getAllMissingTxsBySelector = () => {
  const csvTxHashes = [...new Set(csv.map((tx) => tx.txHash?.toLowerCase()))];

  const distinctSelectors = [
    ...new Set(txs.map((tx) => tx.input.substr(0, 10))),
  ];

  for (const sel of distinctSelectors) {
    const matching = txs.filter((tx) => tx.input.substr(0, 10) === sel);
    const inCsv = matching.filter((m) => csvTxHashes.includes(m.ethHash));
    console.log(
      `${contractFunctions[sel]} (${sel}) - ${inCsv.length}/${matching.length}`
    );
  }
};

const getCsvWithoutTransactionHash = () => {
  const wo = csv.filter((c) => !c.txHash);
  console.log(wo);
};

const getMissingTxsBySelector = (selector) => {
  const csvTxHashes = [...new Set(csv.map((tx) => tx.txHash?.toLowerCase()))];

  const matching = txs.filter((tx) => tx.input.substr(0, 10) === selector);
  const notInCsv = matching.filter((m) => !csvTxHashes.includes(m.ethHash));
  const inCsv = matching.filter((m) => csvTxHashes.includes(m.ethHash));

  console.log("*** NOT IN ***");
  for (const tx of notInCsv) {
    console.log(tx.ethHash);
  }

  console.log("*** IS IN ***");
  for (const tx of inCsv) {
    console.log(tx.ethHash);
  }
};

const updateCsvWithNullForUnknownTokens = () => {
  for (const line of csv) {
    const origSentCur = line.sentCur;
    const newSentCur = tokenMap[origSentCur];
    if (newSentCur) {
      line.sentCur = newSentCur;
      line.description = `${line.description} - (sent ${origSentCur})`;
    }
    const origReceivedCur = line.receivedCur;
    const newReceivedCur = tokenMap[origReceivedCur];
    if (newReceivedCur) {
      line.receivedCur = newReceivedCur;
      line.description = `${line.description} - (received ${origReceivedCur})`;
    }
    if (
      (line.receivedAmt === "0" || line.receivedAmt === "") &&
      (line.sentAmt === "0" || line.sentAmt === "")
    ) {
      line.sentAmt = line.feeAmt;
      line.sentCur = line.feeCur;
      line.feeAmt = "";
      line.feeCur = "";
    }
  }

  const data = [];
  data.push(
    "Date,Sent Amount,Sent Currency,Received Amount,Received Currency,Fee Amount,Fee Currency,Net Worth Amount,Net Worth Currency,Label,Description,TxHash"
  );
  for (const tx of csv) {
    data.push(
      `${tx.timestamp},${tx.sentAmt},${tx.sentCur},${tx.receivedAmt},${tx.receivedCur},${tx.feeAmt},${tx.feeCur},${tx.netWorthAmt},${tx.netWorthCur},${tx.label},${tx.description},${tx.txHash}`
    );
  }
  fs.writeFileSync("./data/dfk-report-fix-currencies.csv", data.join("\r\n"));
};

const findDuplicates = () => {
  const map = new Map();
  for (const line of csv) {
    theKeyObj = {
      ...line,
      label: "",
      description: "",
      feeAmt: "",
    };
    theKey = JSON.stringify(theKeyObj);
    if (!map.has(theKey)) {
      map.set(theKey, 1);
    } else {
      map.set(theKey, map.get(theKey) + 1);
    }
  }

  for (const thing of map) {
    if (thing[1] > 1) console.log(`${thing[0]} - ${thing[1]}`);
  }
};

updateCsvWithNullForUnknownTokens();

/* TODO

*** CHECK THAT THE CSV UPDATED WITH CURRENCIES CORRECTLY! ***


counts of transaction types that are included in CSV

-- None (check, and need fee records for all of these)
crack (0xb0ea6a1b) - 0/1                        ** Think this needs deeper look, missing costs eg. gold - Update receipt of pet manually in CSV in the same way as for heroes
rechargeCrystal (0x5d444f91) - 0/2              ** INCLUDE - THERE ARE JEWEL TRANSFER RECORDS
convertMultiple (0x303e6aa4) - 0/1              ** This is probably the banker CLAIM button - nothing transferred to me. Just put as cost
createProfile (0xbd3eaa6f) - 0/1                ** DONE IN TAXHMY
approve (0x095ea7b3) - 0/80                     ** DONE IN TAXHMY
startQuest (0x68ce0b56) - 0/223                 ** DONE IN TAXHMY
open (0x690e7c09) - 0/12                        ** look into (part of summoning)
startQuest (0xc855dea3) - 0/2394                ** DONE IN TAXHMY
completeMeditation (0x756fcd69) - 0/125         ** look into
startQuestWithData (0xf51333f5) - 0/1148        ** DONE IN TAXHMY
stylist (0x6e278cf1) - 0/1                      ** DONE IN TAXHMY
startQuest (0x8a2da17b) - 0/485                 ** DONE IN TAXHMY
setApprovalForAll (0xa22cb465) - 0/2            ** DONE IN TAXHMY


-- Some (find and work out why)
nativeTransfer (0x) - 9/10                      ** DONE IN TAXHMY
claimRewards (0x5eac6239) - 74/86               ** No transfers, so just record fee
deposit (0x8dbdbe6d) - 2/3                      ** No transfers, so just record fee
completeQuest (0x528be0a9) - 3411/4332          ** DONE IN TAXHMY
startMeditation (0xfa863736) - 105/107          ** No transfers, so just record fee
cancelQuest (0xfe90ff7d) - 12/30                ** DONE IN TAXHMY
swapExactTokensForTokens (0x38ed1739) - 3/5     ** Missing 2 have no transfer records, so just add fee


-- All (spot checks)
swapExactETHForTokens (0x7ff36ab5) - 6/6        ** DONE IN TAXHMY
enter (0xa59f3e0c) - 123/123                    ** DONE IN TAXHMY
leave (0x67dfd4c9) - 29/29                      ** DONE IN TAXHMY
bid (0x598647f8) - 7/7                          ** DONE IN TAXHMY
addLiquidityETH (0xf305d719) - 2/2              ** DOESN'T LOOK RIGHT, NO RECEIPT OF LP TOKEN
summonCrystal (0x4ea8a311) - 8/8                ** NO RECEIPT OF NFT
swapExactTokensForETH (0x18cbafe5) - 4/4        ** DONE IN TAXHMY
claimAirdrop (0xe30d4440) - 9/9                 ** Look fine
addLiquidity (0xe8e33700) - 2/2                 ** NO RECEIPT OF TOKEN?
withdraw (0x0ad58d2f) - 1/1                     ** CHECK
removeLiquidityETH (0x02751cec) - 1/1           ** Look fine, LABEL?
removeLiquidity (0xbaa2abde) - 1/1              ** Look fine, LABEL?
swapAndRedeem (0x4a517a55) - 5/5                ** CHECK - BRIDGING JEWEL
deposit (0x90d25074) - 3/3                      ** NOTHING RECEIVED
sellItem (0x096c5e1a) - 17/17                   ** Look fine, LABEL?
buyItem (0x9f37092a) - 1/1                      ** Look fine, LABEL?
consumeItem (0x106f46e4) - 1/1                  ** Look fine, LABEL?
petIncubate (0x4c7f588f) - 1/1                  ** AS ABOVE
itemBridge (0xad660825) - 29/29                 
sendHero (0x1efedbe5) - 15/15
petBridge (0xbb5e613b) - 1/1

ALL SWAPS ARE ALMOST DEFINITELY MISCATEGORISED (although actually, logged as descriptions not labels)
 - Just review all descriptions

 Really need to report locked JEWEL? or only when claim?

 UPDATE FOR RECEIPT OF NFTS - summon, purchase, pet crack
  - hmm. heroes received e.g. - 0x270d21ceaf75596acefcc96dda863bab16c070eae4479c448088fcdf4be72e5c
  
Find the 14 duplicates
 - 6 of them are same transaction with 2 different fees - e.g 0x58983efd693ad33b2c1862cd64bbaba9d18f55853e4d732d96619d2c6cd5bf3c

Might need to set fees back to ONE so that balances add up

*/
