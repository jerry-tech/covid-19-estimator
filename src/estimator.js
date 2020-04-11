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
    record.impact.infectionsByRequestedTime = record.impact.currentlyInfected * Math.pow(2, 9);
    record.severeImpact.infectionsByRequestedTime = record.severeImpact.currentlyInfected * Math.pow(2, 9);

    // 15% percent calculation of impact and severe impact
    record.impact.severeCasesByRequestedTime = 0.15 * record.impact.infectionsByRequestedTime;
    record.severeImpact.severeCasesByRequestedTime = 0.15 * record.severeImpact.infectionsByRequestedTime;

    //total number of hospitalBedsByRequestedTime for impact && severe impact
    record.impact.hospitalBedsByRequestedTime = Math.round((0.35 * data.totalHospitalBeds) - record.impact.severeCasesByRequestedTime);
    record.severeImpact.hospitalBedsByRequestedTime = Math.round((0.35 * data.totalHospitalBeds) - record.severeImpact.severeCasesByRequestedTime);

    // casesForICUByRequestedTime for impact && severe impact
    record.impact.casesForICUByRequestedTime = 0.05 * record.impact.infectionsByRequestedTime;
    record.severeImpact.casesForICUByRequestedTime = 0.05 * record.severeImpact.infectionsByRequestedTime;

    //casesForVentilatorsByRequestedTime for impact && severe impact
    record.impact.casesForVentilatorsByRequestedTime = 0.02 * record.impact.infectionsByRequestedTime;
    record.severeImpact.casesForVentilatorsByRequestedTime = 0.02 * record.severeImpact.infectionsByRequestedTime;

    // estimation of how much money the economy is likely to lose daily form impact && severe impact
    record.impact.dollarsInFlight = Math.round((record.impact.infectionsByRequestedTime * data.region.avgDailyIncomePopulation * data.region.avgDailyIncomeInUSD) / 100);
    record.severeImpact.dollarsInFlight = Math.round((record.severeImpact.infectionsByRequestedTime * data.region.avgDailyIncomePopulation * data.region.avgDailyIncomeInUSD) / 100);
   
    return record;
};


const data = {
    region: {
        name: "Africa",
        avgAge: 19.7,
        avgDailyIncomeInUSD: 5,
        avgDailyIncomePopulation: 0.71
    },
    periodType: "days",
    timeToElapse: 58,
    reportedCases: 674,
    population: 66622705,
    totalHospitalBeds: 1380614
}

covid19ImpactEstimator(data);

export default covid19ImpactEstimator;

