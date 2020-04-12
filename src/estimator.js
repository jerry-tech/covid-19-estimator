const covid19ImpactEstimator = (data) => {
  const realData = data;
  const record = {
    data: realData,
    impact: {}, // your best case estimation
    severeImpact: {} // your severe case estimation
  };
  // estimate the number of currently infected for IMPACT && severeImpact
  record.impact.currentlyInfected = data.reportedCases * 10;
  record.severeImpact.currentlyInfected = data.reportedCases * 50;


  // infectionsByRequestedTime for impact && severeImpact
  let calDay = null;
  const period = data.timeToElapse;
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
  record.severeImpact.infectionsByRequestedTime = Math.trunc(record.severeImpact.currentlyInfected
    * (2 ** factor));

  // 15% percent calculation of impact and severe impact
  record.impact.severeCasesByRequestedTime = Math.trunc(0.15
    * record.impact.infectionsByRequestedTime);
  record.severeImpact.severeCasesByRequestedTime = Math.trunc(0.15
    * record.severeImpact.infectionsByRequestedTime);

  // total number of hospitalBedsByRequestedTime for impact && severe impact
  record.impact.hospitalBedsByRequestedTime = Math.trunc((0.35 * data.totalHospitalBeds)
    - record.impact.severeCasesByRequestedTime);
  record.severeImpact.hospitalBedsByRequestedTime = Math.trunc((0.35 * data.totalHospitalBeds)
    - record.severeImpact.severeCasesByRequestedTime);

  // casesForICUByRequestedTime for impact && severe impact
  record.impact.casesForICUByRequestedTime = Math.trunc(0.05
    * record.impact.infectionsByRequestedTime);
  record.severeImpact.casesForICUByRequestedTime = Math.trunc(0.05
    * record.severeImpact.infectionsByRequestedTime);

  // casesForVentilatorsByRequestedTime for impact && severe impact
  record.impact.casesForVentilatorsByRequestedTime = Math.trunc(0.02
    * record.impact.infectionsByRequestedTime);
  record.severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(0.02
    * record.severeImpact.infectionsByRequestedTime);

  // estimation of how much money the economy is likely to lose daily form impact && severe impact
  record.impact.dollarsInFlight = Math.trunc((record.impact.infectionsByRequestedTime
    * data.region.avgDailyIncomePopulation * data.region.avgDailyIncomeInUSD));
  record.severeImpact.dollarsInFlight = Math.trunc((record.severeImpact.infectionsByRequestedTime
    * data.region.avgDailyIncomePopulation * data.region.avgDailyIncomeInUSD));

  return record;
};

// const data = {
//   region: {
//     name: 'Africa',
//     avgAge: 19.7,
//     avgDailyIncomeInUSD: 4,
//     avgDailyIncomePopulation: 0.73
//   },
//   periodType: 'days',
//   timeToElapse: 38,
//   reportedCases: 2747,
//   population: 92931687,
//   totalHospitalBeds: 678874
// };
// covid19ImpactEstimator(data);
export default covid19ImpactEstimator;
