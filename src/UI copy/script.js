if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('script.js').then((registration) => {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, (err) => {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
  '/',
  'w3.css',
  'script.js'
];

self.addEventListener('install', (event) => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = ['pages-cache-v1', 'blog-posts-cache-v1'];

  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames.map((cacheName) => {
        if (cacheWhitelist.indexOf(cacheName) === -1) {
          return caches.delete(cacheName);
        }
      })
    ))
  );
});

let dataPeriodType;
let dataTimeToElapse;
let dataReportedCases;
let dataPopulation;
let dataTotalHospitalBeds;
// ----------------------------------
const formError = 'w3-input w3-threequarter w3-animate-input w3-border w3-border-red';

let currimpactinfectx;
let infectbytimex;
let severbytimex;
let hospitalbedsx;
let icutimex;
let venttimex;
let dollarfilx;


let currimpactinfecty;
let infectbytimey;
let severbytimey;
let hospitalbedsy;
let icutimey;
let venttimey;
let dollarfily;
const validateForm = () => {
  let valid = true;
  dataPeriodType = document.getElementById('data-period-type').value;
  dataTimeToElapse = document.getElementById('data-time-to-elapse').value;
  dataReportedCases = document.getElementById('data-reported-cases').value;
  dataPopulation = document.getElementById('data-population').value;
  dataTotalHospitalBeds = document.getElementById('data-total-hospital-beds').value;

  if (dataPeriodType === 'Data_Period_type') {
    valid = false;
  } else if (dataTimeToElapse < 1) {
    valid = false;
  } else if (dataReportedCases < 1) {
    valid = false;
  } else if (dataPopulation < 1) {
    valid = false;
  } else if (dataTotalHospitalBeds < 1) {
    valid = false;
  }

  return valid;
};


const submitForm = () => {
  if (validateForm()) {
    // validateForm();
    dataPeriodType = document.getElementById('data-period-type').value;
    dataTimeToElapse = document.getElementById('data-time-to-elapse').value;
    dataReportedCases = document.getElementById('data-reported-cases').value;
    dataPopulation = document.getElementById('data-population').value;
    dataTotalHospitalBeds = document.getElementById('data-total-hospital-beds').value;


    // -------------------------------------------
    const data = {
      region: {
        name: 'Africa',
        avgAge: 19.7,
        avgDailyIncomeInUSD: 4,
        avgDailyIncomePopulation: 0.73
      },
      periodType: dataPeriodType,
      timeToElapse: dataTimeToElapse,
      reportedCases: dataReportedCases,
      population: dataPopulation,
      totalHospitalBeds: dataTotalHospitalBeds
    };
    const realData = data;
    const record = {
      data: realData,
      impact: {
        currentlyInfected: null,
        infectionsByRequestedTime: null,
        severeCasesByRequestedTime: null,
        hospitalBedsByRequestedTime: null,
        casesForICUByRequestedTime: null,
        casesForVentilatorsByRequestedTime: null,
        dollarsInFlight: null
      },
      severeImpact: {
        currentlyInfected: null,
        infectionsByRequestedTime: null,
        severeCasesByRequestedTime: null,
        hospitalBedsByRequestedTime: null,
        casesForICUByRequestedTime: null,
        casesForVentilatorsByRequestedTime: null,
        dollarsInFlight: null
      }
    };

    record.impact.currentlyInfected = data.reportedCases * 10;
    currimpactinfectx = record.impact.currentlyInfected;
    document.getElementById('currimpactinfectx').innerHTML = currimpactinfectx;
    record.severeImpact.currentlyInfected = data.reportedCases * 50;
    currimpactinfecty = record.severeImpact.currentlyInfected;
    document.getElementById('currimpactinfecty').innerHTML = currimpactinfecty;

    // infectionsByRequestedTime for impact && severeImpact
    let calDay = null;
    // const period = data.timeToElapse;
    const period = dataTimeToElapse;
    if (data.periodType === 'days') {
      calDay = period;
    } else if (data.periodType === 'weeks') {
      calDay = period * 7;
    } else if (data.periodType === 'months') {
      calDay = period * 30;
    }
    const factor = Math.trunc(calDay / 3);
    record.impact.infectionsByRequestedTime = Math.trunc(record.impact.currentlyInfected
    * (2 ** factor));
    infectbytimex = record.impact.infectionsByRequestedTime;
    document.getElementById('infectbytimex').innerHTML = infectbytimex;

    record.severeImpact.infectionsByRequestedTime = Math.trunc(record.severeImpact.currentlyInfected
    * (2 ** factor));
    infectbytimey = record.severeImpact.infectionsByRequestedTime;
    document.getElementById('infectbytimey').innerHTML = infectbytimey;

    // 15% percent calculation of impact and severe impact
    record.impact.severeCasesByRequestedTime = Math.trunc(0.15
    * record.impact.infectionsByRequestedTime);
    severbytimex = record.impact.severeCasesByRequestedTime;
    document.getElementById('severbytimex').innerHTML = severbytimex;

    record.severeImpact.severeCasesByRequestedTime = Math.trunc(0.15
    * record.severeImpact.infectionsByRequestedTime);
    severbytimey = record.severeImpact.severeCasesByRequestedTime;
    document.getElementById('severbytimey').innerHTML = severbytimey;

    // total number of hospitalBedsByRequestedTime for impact && severe impact
    record.impact.hospitalBedsByRequestedTime = Math.trunc((0.35 * data.totalHospitalBeds)
    - record.impact.severeCasesByRequestedTime);
    hospitalbedsx = record.impact.hospitalBedsByRequestedTime;
    document.getElementById('hospitalbedsx').innerHTML = hospitalbedsx;

    record.severeImpact.hospitalBedsByRequestedTime = Math.trunc((0.35 * data.totalHospitalBeds)
    - record.severeImpact.severeCasesByRequestedTime);
    hospitalbedsy = record.severeImpact.hospitalBedsByRequestedTime;
    document.getElementById('hospitalbedsy').innerHTML = hospitalbedsy;

    // casesForICUByRequestedTime for impact && severe impact
    record.impact.casesForICUByRequestedTime = Math.trunc(0.05
    * record.impact.infectionsByRequestedTime);
    icutimex = record.impact.casesForICUByRequestedTime;
    document.getElementById('icutimex').innerHTML = icutimex;

    record.severeImpact.casesForICUByRequestedTime = Math.trunc(0.05
    * record.severeImpact.infectionsByRequestedTime);
    icutimey = record.severeImpact.casesForICUByRequestedTime;
    document.getElementById('icutimey').innerHTML = icutimey;

    // casesForVentilatorsByRequestedTime for impact && severe impact
    record.impact.casesForVentilatorsByRequestedTime = Math.trunc(0.02
    * record.impact.infectionsByRequestedTime);
    venttimex = record.impact.casesForVentilatorsByRequestedTime;
    document.getElementById('venttimex').innerHTML = venttimex;

    record.severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(0.02
    * record.severeImpact.infectionsByRequestedTime);
    venttimey = record.impact.casesForVentilatorsByRequestedTime;
    document.getElementById('venttimey').innerHTML = venttimey;

    // estimation of how much money the economy is likely to lose daily form impact && severe impact
    record.impact.dollarsInFlight = Math.trunc((record.impact.infectionsByRequestedTime
    * data.region.avgDailyIncomePopulation * data.region.avgDailyIncomeInUSD) / calDay);
    dollarfilx = record.impact.dollarsInFlight;
    document.getElementById('dollarfilx').innerHTML = dollarfilx;

    record.severeImpact.dollarsInFlight = Math.trunc((record.severeImpact.infectionsByRequestedTime
    * data.region.avgDailyIncomePopulation * data.region.avgDailyIncomeInUSD) / calDay);
    dollarfily = record.severeImpact.dollarsInFlight;
    document.getElementById('dollarfily').innerHTML = dollarfily;
  } else {
    document.getElementById('data-period-type').className = formError;
    document.getElementById('data-time-to-elapse').className = formError;
    document.getElementById('data-reported-cases').className = formError;
    document.getElementById('data-population').className = formError;
    document.getElementById('data-total-hospital-beds').className = formError;
  }
};
