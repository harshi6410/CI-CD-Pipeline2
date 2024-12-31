function deployApp() {
    fetch('/deploy')
        .then(response => response.json())
        .then(data => {
            alert("Deployment triggered: " + data.message);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
