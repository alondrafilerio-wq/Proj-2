const restaurant = document.body.dataset.restaurant;  // this line tells us that each htmk page is telling js white restaurant it is, so i wont have to edit comments.js for every page - reduce reuse
console.log("restaurant:", restaurant);
function addComment(event) {
    if (event) event.preventDefault();
    alert ("addComment Is Running!");
    let name = document.getElementById("name").value;
    let comment = document.getElementById("comment").value;
    console.log ("Name:", name);
    console.log("comment:", comment);
    if (name.trim() ==="" || comment.trim() === "") {
        alert("Please fill in both boxes.");
        return;
    }
    console.log("About to send fetch");
    console.log("STARTING FETCH");
    fetch("http://localhost:3000/comments",{
        method:"POST",
        headers: {
        "Content-Type":"application/json"
        },
         body: JSON.stringify ({
            restaurant: restaurant,
            name:name,
            comment: comment
         })
    }) 
    .then(response => {
        console.log("reponse status:", response.status);
        return response.json();
    })
    .then(data => {
        console.log("comment saved!!",data);
        alert("i made it into the second.then");

        console.log(data);
        console.log(document.getElementById("comments"));

        document.getElementById("comments").style.border ="3px solid red";
        document.getElementById("comments").style.minHeight ="100px";
        let newComment = document.createElement("div");
        newComment.className = "comment";

        newComment.innerHTML = `
            <p><strong>${data.username}</strong></p>
            <p>${data.comment}</p>
            <button onclick="deleteComment(${data.id}, this)>Delete</button>

        `;
        alert(newComment.innerHTML);
        document.getElementById("comments").appendChild(newComment);
        console.log("AFTER APPEND:",document.getElementById("comments").innerHTML);
        

    })
    .catch(error => {
        console.error("Error:", error);
    });
}

function loadComments() {
    fetch (`http://localhost:3000/comments/${restaurant}`)
        .then(response => response.json())
        .then(data => {
            let commentsBox = document.getElementById("comments");

            data.forEach (comment => {
                let newComment = document.createElement("div");
                newComment.className = "comment";

                newComment.innerHTML = `
                <p><strong>${comment.username}</strong></p>
                <p>${comment.comment}</p>
                <button onclick="deleteComment(${comment.id},this)">Delete</button>
                `;

                commentsBox.appendChild(newComment);
            })
        })
        .catch(error=> {
            console.error("error loading comment:", error);
        });
}
function deleteComment( id, button) {
    fetch (`http://localhost:3000/comments/${id}`, {
        method: "DELETE"
    })
    .then ( response => response.json())
    .then (data => {
        console.log(data);

        button.parentElement.remove();
    })
    .catch(error => {
        console.error ("Error deleting Comment")
    });
}

window.onload = loadComments;