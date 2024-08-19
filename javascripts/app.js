var form = document.getElementById('joinForm');
var url = 'https://kn20faihs8.execute-api.eu-west-2.amazonaws.com/prod/epc-submit';
var formResponse = document.getElementById('form-response')
var submit = document.getElementById('submit')

function post(url, body, callback) {
  var req = new XMLHttpRequest();
  req.open("POST", url, true);
  req.setRequestHeader("Content-Type", "application/json");
  req.addEventListener("load", function () {
    if (req.status < 400) {
      callback(null, JSON.parse(req.responseText));
    } else {
      callback(new Error("Request failed: " + req.statusText));
    }
  });
  req.send(JSON.stringify(body));
}
function success () {
    $('#form-response').html('Thank you for placing an order for an EPC with Connor & Company. We shall be in touch shortly.');
    $("#joinForm").css("display", "none");
    $("#form-response").css("display", "block");
}
function error (err) {
    $('#form-response').html('Sorry there was an error. Please reload the page.');
    $("#joinForm").css("display", "none");
    $("#form-response").css("display", "block");
    console.log(err)
}

form.addEventListener('submit', function (e) {
    $('.button').text('Sending . . .').attr("disabled", "disabled");
    e.preventDefault();

var payload = {
    name: form.name.value,
    agent: form.agent.value,
    email: form.email.value,
    number: form.number.value,
    address: form.address.value,
    notes: form.info.value
  }
  post(url, payload, function (err, res) {
    if (err) { return error(err) }
    success()
  })
});