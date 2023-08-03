$('.button').click(function(){
    $('.box').addClass('is-sent');
    
    setTimeout(function(){
      $('.box').removeClass('is-sent');  
    }, 1800);
  });