$(document).ready(function(){
  $('.alert-error').addClass('.alert-danger');
  $('.alert-success_msg').addClass('.alert-success');
  $('.delete-article').on('click',function(e){
    $target = $(e.target)
    const id = $target.attr('data-id')
    $.ajax({
      type:'DELETE',
      url:'/articles/'+id,
      success: function(response){
        alert('Deleting article')
        window.location.href = '/'
      },
      error: function(err){
        console.log(err)
      }
    })
  })
})