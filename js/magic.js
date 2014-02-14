function show_msg(type, msg, duration) {
  $('#status').removeClass('error').removeClass('success').removeClass('notice');
  $('#status').addClass(type).html(msg).fadeIn(function() {
    if (duration > 0) {
      setTimeout(function() {
        $("#status").fadeOut("fast");
      }, duration);
    }
  });
}
$('#add_more_param').click(function(e) {
  $(this).parent().append($('#param_template .param-pair').clone());
});
$('#add_more_request_header').click(function(e) {
  $(this).parent().append($('#request_header_template .request-header-pair').clone());
});

$('fieldset').on('click', 'a.delete_this', function(e) {
  console.log('delete');
  $(this).parent().remove();
  return false;
});

$('#send').click(function(e) {
  show_msg('info', 'sending request ...');
  $('#response_wrapper').hide();
  var method = $('#method').val();
  var url = $('#request_uri').val();
  var data = [];
  $('input[name="param_key"]').each(function(e) {
    var key = $(this).val();
    if (key != '') {
      var val = $(this).next('input[name="param_value"]').val();
      if (val != '') {
        data.push(encodeURIComponent(key) + '=' + encodeURIComponent(val))
      }
    }
  });

  data = data.join('&');

  var headers = {};
  $('input[name="request_header_key"]').each(function(e) {
    var key = $(this).val();
    if (key != '') {
      var val = $(this).next('input[name="request_header_value"]').val();
      if (val != '') {
        headers[key] = val;
      }
    }
  });

  var requestSent = new Date().getTime();

  $.ajax({
    'url': url,
    'type': method,
    'data': data,
    'dataType': 'text',
    'headers': headers,
    'complete': function(jqXHR, textStatus) {
      $('#response_wrapper').show();
      if (jqXHR.status != 0) {
        $('#response_status').html('Status code: ' + jqXHR.status);
      } else {
        $('#response_status').html('');
      }
      $('#response_headers').html(jqXHR.getAllResponseHeaders());
      $('#response_body').html(jqXHR.responseText);
    },
    'error': function(jqXHR, textStatus, errorThrown) {
      show_msg('error', textStatus, errorThrown);
    },
    'success': function(data, textStatus, jqXHR) {
      var latency = new Date().getTime() - requestSent;
      show_msg('success', 'Request Successful In ' + latency + 'ms')
    }
  });
});