document.addEventListener('DOMContentLoaded', function(){
    // recommend posts
    const rcmBtn = document.getElementById('rcm-btn');
    rcmBtn.addEventListener('click', function(){
        const spinner = document.getElementById('spinner')
        spinner.style.display = 'flex';

        // loại bỏ hết bài post gợi ý của lần gần nhất
        const rcmPostsDiv = document.getElementById('rcm-posts');
        rcmPostsDiv.replaceChildren();
        rcmPostsDiv.style.display = 'none';
        
        const postAlert = document.getElementById('post-alert');
        postAlert.style.display = 'none';
        const title = document.getElementById('title').value;
        const subject = document.getElementById('subject').value;
        const caption = document.getElementById('caption').value;
        console.log(title)
        console.log(subject)
        console.log(caption)
        fetch(`/post/recommend/`,{
            method:'POST',
            headers: {
                'Content-Type':'application/json',
                'X-CSRFToken':getCookie('csrftoken'),
            },
            body: JSON.stringify({
                title: title,
                subject: subject,
                caption: caption,
            })
        })
            .then(response => response.json())
            .then(data => {
                spinner.style.display = 'none';
                let postExist = false;
                if(data.error){
                    postAlert.textContent = data.error;
                    postAlert.style.display = 'block';
                    return;
                }
                const same_sub = data.same_sub;
                if(same_sub){
                    same_sub.forEach(post => {
                        postExist = true;
                        // cac box chua thong tin post duoc goi y
                        const postBox = document.createElement('div')
                        postBox.classList.add('post-box')
                        // phan ben trai hien thi so comment
                        const leftPart = document.createElement('div')
                        leftPart.classList.add('left-part')
                        const cmtBubble = document.createElement('div')
                        cmtBubble.classList.add('comment-bubble')
                        if (post['no_of_comments'] <= 1){
                            cmtBubble.textContent = `${post['no_of_comments']} comment`
                        }
                        else{
                            cmtBubble.textContent = `${post['no_of_comments']} comments`   
                        }
                        leftPart.appendChild(cmtBubble)
                        postBox.appendChild(leftPart)
                        // phan ben phai hien thi cac thong tin khac cua post
                        const rightPart = document.createElement('div')
                        rightPart.classList.add('right-part')
                        const ptitle = document.createElement('a')
                        ptitle.href = `/postdetail/${post['id']}/`
                        ptitle.classList.add('post-title')
                        ptitle.textContent = post['title']
                        const pcaption = document.createElement('p')
                        pcaption.classList.add('post-caption')
                        pcaption.textContent = post['caption']
    
                        const pmeta = document.createElement('div')
                        pmeta.classList.add('post-meta')
                        const psubject = document.createElement('span')
                        psubject.classList.add('post-subject')
                        psubject.textContent = post['subject']
                        const pMetaInfo = document.createElement('span')
                        pMetaInfo.classList.add('meta-info')
                        pMetaInfo.textContent = `created at: ${dateFormat(post['created_at'])} by ${post['user']}`
    
                        pmeta.appendChild(psubject)
                        pmeta.appendChild(pMetaInfo)
                        rightPart.appendChild(ptitle)
                        rightPart.appendChild(pcaption)
                        rightPart.appendChild(pmeta)
    
                        postBox.appendChild(rightPart)
                        rcmPostsDiv.insertAdjacentElement('beforeend',postBox);
                    });
                }
               
                const diff_sub = data.diff_sub;
                if(diff_sub){
                    diff_sub.forEach(post =>{
                        postExist = true;
                        // cac box chua thong tin post duoc goi y
                        const postBox = document.createElement('div')
                        postBox.classList.add('post-box')
                        // phan ben trai hien thi so comment
                        const leftPart = document.createElement('div')
                        leftPart.classList.add('left-part')
                        const cmtBubble = document.createElement('div')
                        cmtBubble.classList.add('comment-bubble')
                        if (post['no_of_comments'] <= 1){
                            cmtBubble.textContent = `${post['no_of_comments']} comment`
                        }
                        else{
                            cmtBubble.textContent = `${post['no_of_comments']} comments`   
                        }
                        leftPart.appendChild(cmtBubble)
                        postBox.appendChild(leftPart)
                        // phan ben phai hien thi cac thong tin khac cua post
                        const rightPart = document.createElement('div')
                        rightPart.classList.add('right-part')
                        const ptitle = document.createElement('a')
                        ptitle.href = `/postdetail/${post['id']}/`
                        ptitle.target = '_blank'
                        ptitle.classList.add('post-title')
                        ptitle.textContent = post['title']
                        const pcaption = document.createElement('p')
                        pcaption.classList.add('post-caption')
                        pcaption.textContent = post['caption']
    
                        const pmeta = document.createElement('div')
                        pmeta.classList.add('post-meta')
                        const psubject = document.createElement('span')
                        psubject.classList.add('post-subject')
                        psubject.textContent = post['subject']
                        const pMetaInfo = document.createElement('span')
                        pMetaInfo.classList.add('meta-info')
                        pMetaInfo.textContent = `created at: ${dateFormat(post['created_at'])} by ${post['user']}`
    
                        pmeta.appendChild(psubject)
                        pmeta.appendChild(pMetaInfo)
                        rightPart.appendChild(ptitle)
                        rightPart.appendChild(pcaption)
                        rightPart.appendChild(pmeta)
    
                        postBox.appendChild(rightPart)
                        rcmPostsDiv.insertAdjacentElement('beforeend',postBox);
                    })
                }
                
            
                if (postExist){
                    rcmPostsDiv.style.display = 'block';
                    postAlert.style.display = 'none';
                }
                else{
                    rcmPostsDiv.style.display = 'none';
                    postAlert.textContent = 'No post has relevant content to your post.'
                    postAlert.style.display = 'block';
                }
            })
            .catch(error => {
                console.error(error);
            })
    })
    
    const searchForm = document.getElementById('search-form');
    searchForm.addEventListener('submit', e=>{
        e.preventDefault();
        const query = searchForm.querySelector('input[name="q"]').value; 
        const url = `${searchForm.action}?q=${encodeURIComponent(query)}`;
        window.open(url,'_blank');
    })
    
})
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Tên cookie có bắt đầu bằng xâu tham số hay k
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
function dateFormat(dateString){
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    // format YYYY-MM-DD HH:MM
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
    return formattedDate; 
}