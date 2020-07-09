class CountryData {
  constructor(data) {
    this.data = data;
  }
  getCountryAtIndex(index) { return this.data[index]; }
  getCountryWithName(name) { return this.data.find(x => x.name.common == name); }
  getRandomCountry() { return getRandom(this.data); }
  getNumberOfCountries() { return this.data.length; }
}

var countries = null;
var index = -1;
var shuffledCountries = [];
var correct = 0;
var isGuessingCapital = false;

$(document).ready(() => {
  console.log('document loaded');
  $.getJSON("country_data.json", function (json) {
    countries = new CountryData(json);

    start();
  });
})

function start() {
  countries.data.forEach(x => shuffledCountries.push(x))

  for (var i = countries.getNumberOfCountries() - 1; i >= 0; i--) {
    var random = Math.round(Math.random() * i);
    var temp = shuffledCountries[i];
    shuffledCountries[i] = shuffledCountries[random];
    shuffledCountries[random] = temp;
  }

  $('.idk').click(function() { answer(false); });

  $('.stats').html('answered: 0<span class="outof">/'+countries.getNumberOfCountries()+'</span> — correct: 0');
  next();
}

function next() {
  index++;
  if(index >= countries.getNumberOfCountries()) {
    finish()
    return;
  }
  var country = shuffledCountries[index];
  isGuessingCapital = Math.random() > 0.5;
  if (!isGuessingCapital) {
    $('.country-name').off('input').prop('disabled', false).on('input', function () {
      var text = $(this).val();
      if (text.toLowerCase() === country.name.common.toLowerCase() ||
        text.toLowerCase() === country.name.official.toLowerCase()) {
        answer(true);
      }
    }).val('').focus();
    $('.capital-name').off('input').prop('disabled', true).val(country.capital);
  } else {
    $('.capital-name').off('input').prop('disabled', false).on('input', function () {
      var text = $(this).val();
      if (text.toLowerCase() === country.capital.toLowerCase()) {
        answer(true);
      }
    }).val('').focus();
    $('.country-name').off('input').prop('disabled', true).val(country.name.common);
  }
}

function answer(b) {
  var done = index + 1;
  correct += b ? 1 : 0;
  $('.stats').html('answered: ' + done + '<span class="outof">/'+countries.getNumberOfCountries()+'</span> — correct: ' + correct);
  if(b) {
    next();
  } else {
    if(isGuessingCapital) {
      $('.capital-name').addClass('answer').val(shuffledCountries[index].capital);
    } else {
      $('.country-name').addClass('answer').val(shuffledCountries[index].name.common);
    }
    setTimeout(function() {
      $('.answer').removeClass('answer');
      next();
    }, 1000)
  }
}

function finish() {
  console.log('finished');
}
/*function addRow(localindex) {
  var country = countries.getCountryAtIndex(localindex);
  console.log(country)
  $('.box').append('<div class="country-row" data-index="' + localindex + '"><input class="country-name"></input><div class="capital-name"></div></div>');
  $('.country-row[data-index="' + index + '"] input').on('input',function() {
    var current = $(this).val();
    if(current.toLowerCase() === country.name.common.toLowerCase() ||
    current.toLowerCase() === country.name.official.toLowerCase()) {
      $(this).off('input').val(country.name.common).prop('disabled', true);
      $('.country-row[data-index="' + index + '"] .capital-name').text(country.capital);
      index++;
      addRow(index);
    }
  }).focus();
}*/

function getRandom(array) {
  var length = array.length;
  var index = Math.floor(Math.random() * length);
  return array[index];
}
