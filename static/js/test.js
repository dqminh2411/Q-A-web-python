
document.addEventListener('DOMContentLoaded', function() {
    // Handle edit button clicks
    document.querySelectorAll('.edit-comment').forEach(button => {
        button.addEventListener('click', function() {
            const commentDiv = this.closest('.comment');
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

    // Handle cancel button clicks
    document.querySelectorAll('.cancel-edit').forEach(button => {
        button.addEventListener('click', function() {
            const contentContainer = this.closest('.comment-content-container');
            const commentText = contentContainer.querySelector('.comment-text');
            const editForm = contentContainer.querySelector('.edit-form');

            // Hide edit form, show comment text
            editForm.style.display = 'none';
            commentText.style.display = 'block';
        });
    });

    // Handle save button clicks
    document.querySelectorAll('.save-edit').forEach(button => {
        button.addEventListener('click', function() {
            const commentDiv = this.closest('.comment');
            const commentId = commentDiv.id.split('-')[1];
            const textarea = commentDiv.querySelector('textarea');
            const newContent = textarea.value;
            const contentContainer = commentDiv.querySelector('.comment-content-container');
            const commentText = contentContainer.querySelector('.comment-text');
            const editForm = contentContainer.querySelector('.edit-form');

            // Send AJAX request to update comment
            fetch(`/comment/edit/${commentId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')  // You'll need to implement getCookie
                },
                body: JSON.stringify({
                    content: newContent
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update comment text
                    commentText.textContent = newContent;
                    // Hide edit form, show updated comment
                    editForm.style.display = 'none';
                    commentText.style.display = 'block';
                } else {
                    alert('Error updating comment');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error updating comment');
            });
        });
    });
});

// Function to get CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
