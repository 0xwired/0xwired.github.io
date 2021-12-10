const dump = require('./enode-dump.json')
const commonFormat = require('./utils.js')
var fs = require('fs');

// counter for countries/count
var finalCounter = {}

// The enode dump has 2 letter country codes, d3 uses 3 letter codes
// hence the helpers
const convertTwoToThreeLetterCode = () => {
    const final = {}
    const data = commonFormat['commonFormat']
    data.map((country)=> {
        final[country['alpha-2']] = country['alpha-3']
    })
    return final
}


const main =() => {
    const helperMapping = convertTwoToThreeLetterCode()
    Object.keys(dump).map((key)=> {
        const sampleCity = dump[key]
        sampleCity.map((record)=> {
            const coreRecord = record.Record
            const ip = record.IP
            // console.log(coreRecord)
            const city = coreRecord.City
            // const cityName = city.Names.en
            // console.log(cityName)
            const country = coreRecord.Country
            const countryName = country.Names.en
            const countryCode = helperMapping[country.IsoCode]
            // console.log(ip, countryName, countryCode)
            // console.log(country)
            const formattedName = countryName + ',' + countryCode
            if(!finalCounter.hasOwnProperty(formattedName)){
                finalCounter[formattedName] = 1
            }else{
                finalCounter[formattedName] = finalCounter[formattedName] + 1
            }
        })
    })
    
}

try {
    // Build final counter
    main()
    // Sort em
    const countriesSorted = Object.keys(finalCounter)
    .sort((a, b) =>  finalCounter[b] - finalCounter[a] )
    .reduce(
      (_sortedObj, key) => ({
        ..._sortedObj,
        [key]: finalCounter[key]
      }),
      {}
    );
    // Write to csv
    var csvString = "name,code,pop\n"
    Object.keys(countriesSorted).map((country)=> {
        csvString = csvString + (country + ',' + countriesSorted[country] + '\n')
    })
    fs.writeFile('./countries_enodes.csv', csvString, 'utf8', function (err) {
        if (err) {
          console.log('Some error occured - file either not saved or corrupted file saved.');
        } else{
          console.log('Transformed and formatted!');
        }
    });
}catch(e){
    console.log(e)
}