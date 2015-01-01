var nach = require('./index')
var _ = require('lodash');
var utils = require('./lib/utils');
var moment = require('moment');

var fs = require('fs');

var routingNumber = "281073555"; // Pulaski routing number
var companyIdentification = "983597258";
var companyName = "Zipline Labs Inc";
var transactionDiscription = 'Zip Transfer';
	
var achFile = new nach.File({
	immediateDestination: '281074114',
	immediateOrigin: '123456789',
	immediateDestinationName: 'Pulaski Bank',
	immediateOriginName: 'Zipline Labs Inc.',
	referenceCode: '#A000001',
});

var creditTransaction = new nach.Entry({
	receivingDFI: '081000210',
	DFIAccount: '12345678901234567',
	amount: '35.21',
	idNumber: 'RAj##23920rjf31',
	individualName: 'Glen Selle',
	discretionaryData: 'A1',
	transactionCode:'22'
});

var debitTransaction = new nach.Entry({
	receivingDFI: '101000019',
	DFIAccount: '923698412584',
	amount: '35.21',
	idNumber: 'RAj##23920rjf31',
	individualName: 'Tom Horner',
	discretionaryData: 'A1',
	transactionCode:'27'
});


var creditLow = new nach.Batch({
	serviceClassCode: '220',
	companyName: companyName,
	standardEntryClassCode: 'XIO',
	companyIdentification: companyIdentification,
	companyEntryDescription: transactionDiscription,
	companyDescriptiveDate: moment(utils.computeBusinessDay(1)).format('MMM D'),
	effectiveEntryDate: utils.computeBusinessDay(1),
	originatingDFI: routingNumber 
});

//creditLow.addEntry(creditTransaction);
console.log('test.js: creditLow', _.pluck(creditLow.header, 'value'))

var creditHigh = new nach.Batch({
	serviceClassCode: '220',
	companyName: companyName,
	standardEntryClassCode: 'WEB',
	companyIdentification: companyIdentification, 
	companyEntryDescription: transactionDiscription,
	companyDescriptiveDate: moment(utils.computeBusinessDay(8)).format('MMM D'),
	effectiveEntryDate: utils.computeBusinessDay(8),
	originatingDFI: routingNumber
});
utils.guinneaPig(creditHigh);
//creditHigh.addEntry(creditTransaction);
console.log('test.js: creditHigh', _.pluck(creditHigh.header, 'value'))
utils.guinneaPig(creditHigh);

var allDebits = new nach.Batch({
	serviceClassCode: '225',
	companyName: companyName,
	standardEntryClassCode: 'PPD',
	companyIdentification: companyIdentification,
	companyEntryDescription: transactionDiscription,
	companyDescriptiveDate: moment(utils.computeBusinessDay(2)).format('MMM D'),
	effectiveEntryDate: utils.computeBusinessDay(2),
	originatingDFI: routingNumber
});
utils.guinneaPig(creditHigh);

allDebits.addEntry(debitTransaction);
console.log('test.js: debit', _.pluck(allDebits.header, 'value'))

//console.log('test.js', _.pluck(creditLow.header, 'value'))
achFile.addBatch(creditLow);

//console.log('test.js', _.pluck(creditHigh.header, 'value'))
achFile.addBatch(creditHigh);
//console.log(creditHigh._entries);

//console.log('test.js', _.pluck(debit.header, 'value'))
achFile.addBatch(allDebits);

achFile.generateFile(function(fileString){
	fs.writeFile('NACHA.txt', fileString, function(err) {
		if(err) console.log(err);
		console.log(fileString);
	})
});