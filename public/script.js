window.onload = function() {
    var converter = new showdown.converter();
    var pad = document.getElementById('pad');
    var markdownArea = document.getElementById('markdown');

    pad.addEventListener('keydown', function(e) {
        if(e.keyCode === 9) {
            var start = this.selectionStart;
            var end = this.selectionEnd;

            var target = e.target;
            var value = target.value;

            target.value = value.substring(0, start) 
                            + "\t"
                            + value.substring(end);
            this.selectionStart = this.selectionEnd = start +1;

            e.preventDefault();
        }
    });

    var previousMarkdownValue;
    //convert text area to markdown html
    var convertTextAreaToMarkdown = function(){
        var markdownText = pad.value;
        previousMarkdownValue = markdownText;
        html = converter.makeHTML(markdownText);
        markdownArea.innerHTML = html;
    };

    var didChangeOccur = function(){
        if(previousMarkdownValue != pad.value){
            return true;
        } 
        return false;
    };

    setInterval(function(){
        if(didChangeOccur()){
            convertTextAreaToMarkdown();
        }
    },1000);

    pad.addEventListener('input', convertTextAreaToMarkdown);

    //ignore if on home page
    if(document.location.pathname > 1){
        //implement share js
        var documentName = document.location.pathname.substring(1);
        sharejs.open(documentName, 'text', function(error, doc) {
            doc.attach_textarea(pad);
            convertTextAreaToMarkdown();
        });
    }
    convertTextAreaToMarkdown();
   
};