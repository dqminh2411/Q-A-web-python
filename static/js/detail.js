

console.log(currentUser)
// post info
const title = document.getElementById('post-title-id')
const caption = document.getElementById('post-caption-id')
const subject = document.getElementById('post-subject-id')
console.log(subject.textContent)
const postId = document.getElementById('post-id').getAttribute('pid')



// button
const updPostBtn = document.getElementById('update-post-btn')
const delPostBtn = document.getElementById('delete-post-btn')
const canCmtBtn = document.getElementById('cancel-cmt-btn')

const remFileBtn = document.getElementById('remove-file-btn')
let remove = false
// update post form
const updPostForm = document.getElementById('update-post-form')
const titleForm = document.getElementById('update-title')
const fileForm = document.getElementById('update-file')
const subForm = document.getElementById('update-subject')
const capForm = document.getElementById('update-caption')
// update modal
// const updModal = document.getElementById('updatePostModal')

// delete post form
const delForm = document.getElementById('delete-form')

// comment info

const cmtTag = document.getElementById('cmt-tag')



// update comment form
const updCmtForm = document.getElementById('update-cmt-form')
const contentForm = document.getElementById('update-content')
const addCmtForm = document.getElementById('add-cmt-form')


// CSRF token
const csrf = document.getElementsByName('csrfmiddlewaretoken')

if(updPostBtn){
    updPostBtn.addEventListener('click', e=>{
        titleForm.value = title.textContent
        subForm.value = subject.textContent
        capForm.value = caption.textContent
        const postFileDiv = document.getElementById('post-file')
    
        if(postFileDiv){
            
            const file = document.getElementById('post-file-id')
            const image = document.getElementById('post-image-id')
    
            remFileBtn.style.display = 'block';
            const imgPre = document.getElementById('preview-image')
            const filePre = document.getElementById('preview-file')
            const postFile = postFileDiv.getAttribute('file')
    
            if(isImage(postFile)){
                imgPre.src = image.src
                imgPre.style.display = 'block'
                remFileBtn.addEventListener('click', ev =>{
                    imgPre.style.display = 'none'
                    remFileBtn.style.display = 'none'
                    remove = true
                })
                filePre.style.display = 'none'
            }
            else{
                filePre.href = file.href
                filePre.style.display = 'block'
                remFileBtn.addEventListener('click', ev =>{
                    filePre.style.display = 'none'
                    remFileBtn.style.display = 'none'
                    remove = true
                })
                imgPre.style.display = 'none'
            }
            
        }
    })
}

// kiem tra url file la anh hay khong
function isImage(url){
    return (url.toLowerCase().match('\.(png|jpeg|jpg|gif)$') != null);
}

// update post form
if(updPostForm){
    
    updPostForm.addEventListener('submit', e => {
        e.preventDefault();
        console.log('submitted');

        // Tạo một FormData đẻ chứa file trong AJAX call
        let formData = new FormData();
        formData.append('csrfmiddlewaretoken', csrf[0].value);
        formData.append('title', titleForm.value);
        formData.append('caption', capForm.value);
        formData.append('subject', subForm.value);
        if(fileForm.files.length > 0){
            formData.append('file', fileForm.files[0]);
        }
            
        formData.append('remove', remove);

        $.ajax({
            type: 'POST',
            url: `/post/update/${postId}/`,
            data: formData,
            processData: false,  // không cho jQuery chuyển file data thành query string
            contentType: false,  
            success: function(response) {
                remove = false
                const postFileDiv = document.getElementById('post-file')
                if("file" in response){
                    
                    if(postFileDiv){ // postFileDiv !== null, !== undefined
                        console.log('co postFileDiv')
                        const file = document.getElementById('post-file-id')
                        const image = document.getElementById('post-image-id')
                        
                        // check url là file ảnh hay file khác
                        if (isImage(response.file)){
                            postFileDiv.setAttribute('file',response.file)
                            image.src = response.file
                            image.style.display = 'block'
                            file.style.display = 'none'
                        }
                        else{
                            postFileDiv.setAttribute('file',response.file)
                            image.style.display = 'none'
                            file.href = response.file
                            file.style.display = 'block'
                        }
                        postFileDiv.style.display = 'block'
                    }
                    else{
                        console.log('khong co postFileDiv')
                        const newPostFileDiv = document.createElement('div');
                        newPostFileDiv.setAttribute('id','post-file');
                        newPostFileDiv.setAttribute('file', response.file);
                        newPostFileDiv.setAttribute('style','');
                        const newImage = document.createElement('img');
                        newImage.setAttribute('id','post-image-id');
                        newImage.setAttribute('src','#');
                        newImage.setAttribute('class', 'img-fluid');
                        newImage.setAttribute('style', 'border-radius: 10px; height: 400px;width: 800px;margin-left: 0px');
                        newPostFileDiv.appendChild(newImage)

                        const newFile = document.createElement('a');
                        newFile.setAttribute('id','post-file-id');
                        newFile.setAttribute('href','#');
                        newFile.setAttribute('class','btn btn-primary');
                        newFile.setAttribute('target','_blank');
                        newFile.setAttribute('style','');
                        newFile.textContent = 'File';
                        newPostFileDiv.appendChild(newFile)
                        if(isImage(response.file)){
                            newImage.src = response.file
                            newImage.style.display = 'block'
                            newFile.style.display = 'none'
                        }
                        else{
                            newFile.href = response.file
                            newImage.style.display = 'none'
                            newFile.style.display = 'block'
                        }
                        newPostFileDiv.style.display = 'block'
                        // set position for postFileDiv after <h5 class="card-title">{{ post.user }}</h5> in postdetail.html
                        const postUser = document.getElementById('post-user');
                        postUser.insertAdjacentElement('afterend', newPostFileDiv);
                    }   
                }
                else{
                    if(postFileDiv){
                        postFileDiv.remove()
                    }
                }
                
                title.textContent = response.title
                titleForm.value = response.title
                
                caption.innerHTML = response.caption.replace(/\n/g,'<br>');
                capForm.value = response.caption;
                subject.textContent = response.subject;
                subForm.value = response.subject;
            
                
                console.log('success');
                
                // Đóng modal dùng modal method của Bootstrap
                $('#updatePostModal').modal('hide');
                // reset form
                $('#update-post-form').trigger('reset');
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
}
document.addEventListener('DOMContentLoaded', function() {
    // hien thi anh hay file cua post
    const postFileDiv = document.getElementById('post-file')
    if (postFileDiv){
        const postFile = postFileDiv.getAttribute('file')
        const file = document.getElementById('post-file-id')
        const image = document.getElementById('post-image-id')
        if(isImage(postFile)){
            image.src = postFile
            image.style.display = 'block'
            file.style.display = 'none'
        }
        else{
            file.href = postFile
            file.style.display = 'block'
            image.style.display = 'none'
        }
    }

    // like or unlike post form
    const likeBtn = document.getElementById(`like-unlike-${postId}`);
    
    $.ajax({
        type:'GET',
        url: `/like-post/${postId}`,
        success: function(response){
            if(response.liked){
                likeBtn.textContent = `Unlike (${response.no_of_likes})`;
            }
            else {
                likeBtn.textContent =  `Like (${response.no_of_likes})`;
            }
        },
        error: function(error){
            console.log(error)
        }
    })
        
    
    

    const LikeUnlikeForm= document.getElementById(`like-unlike-form-${postId}`);
    console.log(postId)
    LikeUnlikeForm.addEventListener('submit', function(e){
            e.preventDefault();
            
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
    
    function editCmt(){
        // nut edit
        document.querySelectorAll('.edit-comment').forEach(button => {
            button.addEventListener('click', function() {
                // find closest parent element
                const commentDiv = this.closest('.comment');
                // find child elements using querySelector(className or tagname)
                const contentContainer = commentDiv.querySelector('.comment-content-container');
                const commentText = contentContainer.querySelector('.comment-text');
                const editForm = contentContainer.querySelector('.edit-form');
                const textarea = editForm.querySelector('textarea');

                // Show edit form, hide comment text
                commentText.style.display = 'none';
                editForm.style.display = 'block';
                textarea.focus();
            });
        });

        // nut cancel
        document.querySelectorAll('.cancel-edit').forEach(button =>{
            button.addEventListener('click',function(){
                const contentContainer = this.closest('.comment-content-container');
                const commentText = contentContainer.querySelector('.comment-text');
                const editForm = contentContainer.querySelector('.edit-form');
                const textarea = editForm.querySelector('textarea');
                // hien comment text, an edit form
                commentText.style.display = 'block';
                textarea.value = commentText.textContent;
                // textarea.focus();
                editForm.style.display = 'none';

            })
        })

        // nut save
        document.querySelectorAll('.save-edit').forEach(button => {
            
            button.addEventListener('click', function(){
                
                const commentDiv = this.closest('.comment');
                const contentContainer = this.closest('.comment-content-container');
                const commentText = contentContainer.querySelector('.comment-text');
                const newContent = contentContainer.querySelector('textarea').value;
                const editForm = contentContainer.querySelector('.edit-form')
            
                const cancelButton = contentContainer.querySelector('.cancel-edit');
                const commentId = parseInt(commentDiv.id.split('-')[1]);
                $.ajax({
                    type:'POST',
                    url:`/comment/edit/`,
                    data:{
                        'csrfmiddlewaretoken':csrf[0].value,
                        'newContent':newContent,
                        'cmt_id': commentId,
                    },
                    success: function(response){
                        commentText.innerHTML = response.cmtContent.replace(/\n/g,'<br>');
                    
                        editForm.style.display = 'none';
                        commentText.style.display = 'block';
                        // this.style.display = 'none';
                        console.log('success');
                    }, 
                    error: function(error){
                        console.log(error);
                    }
                })
            })
        })
    }
    
    function deleteCmt(){
        document.querySelectorAll('.delete-comment-form').forEach(delCmtForm =>{
            delCmtForm.addEventListener('submit', e => {
                e.preventDefault();
                console.log(delCmtForm)
                const commentId = parseInt(delCmtForm.id.split('-')[3]);
                $.ajax({
                    type:'POST',
                    url:`/comment/delete/`,
                    data:{
                        'csrfmiddlewaretoken':csrf[0].value,
                        'cmt_id':commentId,
                    },
                    success: function(response){
                        const commentDiv = document.getElementById(`comment-${commentId}`)
                        commentDiv.style.display = 'none'
                        // Đóng modal dùng modal method của Bootstrap
                        $(`#deleteCommentModal-${commentId}`).modal('hide');
                    },
                    error: function(error){
                        console.log(error);
                    },
                })
            })
        })
    }
    

    const loadCmts = () => {
        const cmtSection = document.getElementById('comments-section');
        const crit = 'time';
        fetch(`/comment/sort/${postId}/${crit}`)
        .then(response => response.json())
        .then(data => {
            if(data.comments.length > 0){
                data.comments.forEach(cmt =>{
                    cmtSection.insertAdjacentHTML('beforeend', `
                                <div class="comment p-3 mb-3"
                                    style="border: 1px solid #e3e3e3; border-radius: 10px; background-color: #f9f9f9;"
                                    id="comment-${cmt.id}">
                                    
                                    <h5 class="mb-1">
                                        <a href="/profile/${cmt.user}"
                                            style="text-decoration: none; font-weight: bold;">
                                            @${cmt.user}
                                        </a>
                                    </h5>
                                    <div class="comment-content-container">
                                        <!-- noi dung comment -->
                                        <p cmt-id="${cmt.id}" class="mb-2 comment-text"
                                            style="margin-left: 15px;">${cmt.content.replace(/\n/g,'<br>')}</p>
                                        <!-- like or unlike comment -->
                                        <form method="post" class="like-cmt-form" cmt-id="${cmt.id}">
                                            
                                            <button type="submit" class="btn btn-outline-primary like-cmt-btn" id="like-cmt-${cmt.id}">${cmt.liked? `Unlike (${cmt.no_of_likes})`:`Like (${cmt.no_of_likes})`}</button>
                                        </form>
                                        <!-- form chinh sua comment -->
                                        <div class="edit-form" style="display: none;">
                                            <textarea class="form-control mb-2">${cmt.content}</textarea>
                                            <button class="btn btn-secondary btn-sm cancel-edit">Cancel</button>
                                            <button type="submit" class="btn btn-primary btn-sm save-edit">Save</button>
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <small class="text-muted">${dateFormat(cmt.created_at)}  </small>
                                    </div>
                                    ${currentUser === cmt.user? `<button class="edit-comment" style="border:none; background: none;"><i
                                            class="fas fa-edit"></i></button>
                                        <!-- delete comment modal -->
                                        <div class="modal fade" id="deleteCommentModal-${cmt.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <div class="modal-dialog">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h1 class="modal-title fs-5" id="exampleModalLabel"><strong>Delete Comment</strong></h1>
                                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div class="modal-body">
                                                        Are you sure to delete this comment?
                                                    </div>
                                                    <div class="modal-footer">
                                                        <form id="delete-comment-form-${cmt.id}" class="delete-comment-form">
                                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" data-bs-target="#deleteCommentModal-${cmt.id}">Cancel</button>
                                                            <button type="submit" class="btn btn-danger del-cmt-btn" >Delete</button>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
    
                                        <button  style="border:none; background: none;"
                                            data-bs-toggle="modal" data-bs-target="#deleteCommentModal-${cmt.id}">
                                            <i class="fa-solid fa-trash"></i></button>`:""}
                                   
                                </div>`)
                })
                likeCmt();
                editCmt();
                deleteCmt();
            }
            else{
                cmtSection.insertAdjacentHTML('afterbegin','<p> No comments yet.</p>')
            }
            
        })
    }
    loadCmts();
    function likeCmt(){
        const likeCmtForms = document.querySelectorAll('.like-cmt-form');
        likeCmtForms.forEach(form =>{
            form.addEventListener('submit', function(e){
                e.preventDefault();
                const csrf_token = getCookie('csrftoken');
                
                const cmtId = parseInt(form.getAttribute('cmt-id'));
                const likeCmtBtn = document.getElementById(`like-cmt-${cmtId}`);
                $.ajax({
                    type:'POST',
                    url:`/comment/like/`,
                    data:{
                        'csrfmiddlewaretoken': csrf_token,
                        'cmt_id':cmtId,
                    },
                    success: function(response){
                        if(response.liked){
                            likeCmtBtn.textContent = `Unlike (${response.no_of_likes})`;
                        }
                        else{
                            likeCmtBtn.textContent = `Like (${response.no_of_likes})`;
                        }
                    },
                    error: function(error){
                        console.log(error)
                    }
                })
            })
        })
    }

    // sort comments
    const sortCmtBtn = document.getElementById('sort-cmt-btn');
    if (sortCmtBtn){
        const byTime = document.getElementById('sort-time')
        const byLike = document.getElementById('sort-like')
        const cmtSection = document.getElementById('comments-section')
        byTime.addEventListener('click', e=>{
            sortCmtBtn.textContent = 'By Time (default)';
            if(cmtSection.querySelector('.comment') === null){
                loadCmts()
            }
        })
        byLike.addEventListener('click', e=>{
            
            $.ajax({
                type:'GET',
                url:`/comment/sort/${postId}/'like'`,
                success: function(response){
                    sortCmtBtn.textContent = 'By Like';
                    if(cmtSection.querySelector('.comment')){
                        cmtSection.innerHTML = '';
                    }
                    response.comments.forEach(cmt =>{
                        cmtSection.insertAdjacentHTML('beforeend', `
                            <div class="comment p-3 mb-3"
                                style="border: 1px solid #e3e3e3; border-radius: 10px; background-color: #f9f9f9;"
                                id="comment-${cmt.id}">
                                
                                <h5 class="mb-1">
                                    <a href="/profile/${cmt.user}"
                                        style="text-decoration: none; font-weight: bold;">
                                        @${cmt.user}
                                    </a>
                                </h5>
                                <div class="comment-content-container">
                                    <!-- noi dung comment -->
                                    <p cmt-id="${cmt.id}" class="mb-2 comment-text"
                                        style="margin-left: 15px;">${cmt.content}</p>
                                    <!-- like or unlike comment -->
                                    <form method="post" class="like-cmt-form" cmt-id="${cmt.id}">
                                        
                                        <button type="submit" class="btn btn-outline-primary like-cmt-btn" id="like-cmt-${cmt.id}">${cmt.liked? `Unlike (${cmt.no_of_likes})`:`Like (${cmt.no_of_likes})`}</button>
                                    </form>
                                    <!-- form chinh sua comment -->
                                    <div class="edit-form" style="display: none;">
                                        <textarea class="form-control mb-2">${cmt.content}</textarea>
                                        <button class="btn btn-secondary btn-sm cancel-edit">Cancel</button>
                                        <button type="submit" class="btn btn-primary btn-sm save-edit">Save</button>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <small class="text-muted">${dateFormat(cmt.created_at)}  </small>
                                </div>
                                ${currentUser === cmt.user? `<button class="edit-comment" style="border:none; background: none;"><i
                                        class="fas fa-edit"></i></button>
                                    <!-- delete comment modal -->
                                    <div class="modal fade" id="deleteCommentModal-${cmt.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div class="modal-dialog">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h1 class="modal-title fs-5" id="exampleModalLabel"><strong>Delete Comment</strong></h1>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div class="modal-body">
                                                    Are you sure to delete this comment?
                                                </div>
                                                <div class="modal-footer">
                                                    <form id="delete-comment-form-${cmt.id}" class="delete-comment-form">
                                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" data-bs-target="#deleteCommentModal-${cmt.id}">Cancel</button>
                                                        <button type="submit" class="btn btn-danger del-cmt-btn" >Delete</button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button  style="border:none; background: none;"
                                        data-bs-toggle="modal" data-bs-target="#deleteCommentModal-${cmt.id}">
                                        <i class="fa-solid fa-trash"></i></button>`:""}
                               
                            </div>`)
                    })
                    likeCmt();
                    editCmt();
                    deleteCmt();

                },
                error: function(error){
                    console.log(error)
                }
            })
        })
    }
    
})

function dateFormat(dateString){
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
    return formattedDate; 

}
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
// document.addEventListener('DOMContentLoaded', function(){
//     const updCmtBtns = document.getElementsByClassName('update-cmt-btn')
//     console.log(updCmtBtns)
//     const cmtContents = document.getElementsByClassName('cmt-content')
//     const cmtBlocks = document.querySelectorAll('.comment')
//     const delCmtBtns = document.getElementsByClassName('delete-cmt-btn')
//     let i = 0
//     cmtBlocks.forEach(cmt =>{
//         const updCmtBtn = updCmtBtns[i]
//         const cmtContent = cmtContents[i]
//         const delCmtBtn = delCmtBtns[i]
//         i++
//         if (currentUser === cmt.getAttribute('user')){
//             updCmtBtn.addEventListener('click', e=>{
//                 contentForm.value = cmtContent.textContent
//                 canCmtBtn.style.display = 'inline-block'
//                 cmt.style.display = 'none'
//                 addCmtForm.style.display='none'
//                 updCmtForm.style.display='block'
//                 cmtTag.textContent = 'Update a comment'
//             })
//         }
//         else{
//             updCmtBtn.style.display = 'none'
//             delCmtBtn.style.display = 'none'
//         }
//     })
//     // updCmtBtns.forEach(button => {
//     //     button.addEventListener('click', e =>{
//     //         const cmtContent = cmtContents[i]
//     //         const cmtBlock = cmtBlocks[i]
//     //         i += 1
//     //         contentForm.value = cmtContent.textContent
//     //         canCmtBtn.style.display = 'inline-block'
//     //         cmtBlock.style.display = 'none'
//     //         addCmtForm.style.display='none'
//     //         updCmtForm.style.display='block'
//     //         cmtTag.textContent = 'Update a comment'
//     //     })
//     // })

// })


// updCmtForm.addEventListener('submit', e=>{
//     e.preventDefault()
//     const newContent = document.getElementById('update-content')
//     console.log(newContent.value)
//     $.ajax({
//         type: 'POST',
//         url: `/comment/${parseInt(updCmtBtn.getAttribute('cmt-id'))}/`,
//         data:{
//             'csrfmiddlewaretoken':csrf[0].value,
//             'cmt-content': newContent.value,
//         },
//         success: function(response){
//             cmtBlock.style.display = 'block'
//             canCmtBtn.style.display = 'none'
//             cmtContent.textContent = response.cmtContent
//             updCmtForm.style.display = 'none'
//             addCmtForm.style.display = 'block'
//             cmtTag.textContent = 'Add a comment'
//             console.log('success')
//         },
//         error: function(error){
//             console.log(error)
//         }
//     })
// })

// canCmtBtn.addEventListener('click', e=>{
//     history.back()
// })