const csrf = document.getElementsByName('csrfmiddlewaretoken');
document.addEventListener('DOMContentLoaded', function(){
    const likeBtns = document.querySelectorAll('.like-unlike-btn');
    likeBtns.forEach(btn =>{
        const postId = btn.id.substring(12); // like-unlike-{{post.id}}
        $.ajax({
            type:'GET',
            url: `/like-post/${postId}`,
            success: function(response){
                if(response.liked){
                    btn.textContent = `Unlike (${response.no_of_likes})`;
                }
                else {
                    btn.textContent =  `Like (${response.no_of_likes})`;
                }
            },
            error: function(error){
                console.log(error)
            }
        })
        
    })

    const LikeUnlikeForms = document.querySelectorAll('.like-unlike-form');
    LikeUnlikeForms.forEach(form =>{
        form.addEventListener('submit', function(e){
            e.preventDefault();
            const postId = form.getAttribute('post-id');
            const likeBtn = document.getElementById(`like-unlike-${postId}`);
            $.ajax({
                type:'POST',
                url: `/like-post/${postId}`,
                data:{
                    'csrfmiddlewaretoken': csrf[0].value,
                },
                success: function(response){
                    if(response.liked){
                        likeBtn.textContent = `Unlike (${response.no_of_likes})`;
                    }
                    else {
                        likeBtn.textContent = `Like (${response.no_of_likes})`;
                    }
                }
            })
        })
    })
})